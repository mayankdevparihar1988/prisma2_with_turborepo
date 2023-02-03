import express, { Application } from 'express';
import { config as dotEnvConfig } from 'dotenv';
import compression from 'compression';
import morgan from 'morgan';
import { Server } from 'http';
import { initCors, initBasicSecurity } from './middleware/security.js';
import { initGraphQlSubscriptions, initGraphQl } from './middleware/graphql.js';
import { connectDb } from './middleware/mongo.js';
import { bindRoutes } from './middleware/router.js';

dotEnvConfig();
const PORT: string = process.env.PORT || '8081';
const MORGAN_LOG_TYPE: string = process.env.MORGAN || 'tiny';

const app: Application = express();

// eslint-disable-next-line import/no-mutable-exports
export let server: Server;
const serverInitialize = async () => {
  app.use(morgan(MORGAN_LOG_TYPE));
  app.use(compression());
  app.use(initBasicSecurity());

  initCors(app);
  // initHelmet(app);

  app.get('/', (req, res) => {
    res.send({ msg: 'set api version for request' });
  });

  // routes
  bindRoutes(app);

  await connectDb();
  const grapqhlServer = initGraphQl(app);

  server = app.listen(PORT, (): void => {
    initGraphQlSubscriptions(grapqhlServer, server);
    // eslint-disable-next-line no-console
    console.info(`Listening to port ${PORT}`);
  });
};

serverInitialize();

export default app;
