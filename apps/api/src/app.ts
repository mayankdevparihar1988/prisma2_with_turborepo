import express, { Application } from 'express';
import { config as dotEnvConfig } from 'dotenv';
import compression from 'compression';
import morgan from 'morgan';
import { Server } from 'http';
import { toNumber } from 'lodash-es';
import { initCors, initBasicSecurity } from './middleware/security.js';
import { initGraphQlSubscriptions, initGraphQl } from './middleware/graphql.js';
import { connectDb } from './middleware/mongo.js';
import { gameTickEvery15Minute, gameTickEveryMinute } from './appTicks.js';
import { EVENT_TIME_DURATION } from './config/gameSettings.js';

dotEnvConfig();
const PORT: string = process.env.PORT || '8081';
const MORGAN_LOG_TYPE: string = process.env.MORGAN || 'tiny';

const app: Application = express();

// eslint-disable-next-line import/no-mutable-exports
export let server: Server;

const SEK_INTERVAL = 1000; // 1 sek

const tick1MinService = async () =>
  new Promise(() => {
    gameTickEveryMinute().then(() => {
      setInterval(gameTickEveryMinute, SEK_INTERVAL);
    });
  });

const tick15MinService = async () =>
  new Promise(() => {
    gameTickEvery15Minute().then(() => {
      setInterval(gameTickEvery15Minute, SEK_INTERVAL * 60 * EVENT_TIME_DURATION + 1); // every 15 min
    });
  });

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
  // bindRoutes(app);

  await connectDb();
  const grapqhlServer = initGraphQl(app);

  server = app.listen(PORT, (): void => {
    initGraphQlSubscriptions(grapqhlServer, server);
    // eslint-disable-next-line no-console
    console.info(`Listening to port ${PORT}`);
  });
};

await Promise.all([tick1MinService(), tick15MinService(), serverInitialize()]);

export default app;
