import express, { Application } from 'express';
import { config as dotEnvConfig } from 'dotenv';
import compression from 'compression';
import morgan from 'morgan';
import { Server } from 'http';
import { Kysely, PostgresDialect } from 'kysely';
import { DB } from 'kysely-codegen';
import pkg from 'pg';
import { initCors, initBasicSecurity } from './middleware/security.js';

const { Pool } = pkg;

dotEnvConfig();
const PORT: string = process.env.PORT || '8081';
const MORGAN_LOG_TYPE: string = process.env.MORGAN || 'tiny';

const app: Application = express();

// eslint-disable-next-line import/no-mutable-exports
export let server: Server;

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL
    })
  })
});

const SEK_INTERVAL = 1000; // 1 sek
const serverInitialize = async () => {
  app.use(morgan(MORGAN_LOG_TYPE));
  app.use(compression());
  app.use(initBasicSecurity());

  initCors(app);
  // initHelmet(app);

  app.get('/', async (req, res) => {
    const jokes = await db.selectFrom('Joke').selectAll().execute();
    res.send({ msg: 'set api version for request', jokes });
  });

  // routes
  // bindRoutes(app);

  // await connectDb();
  // const grapqhlServer = initGraphQl(app);

  server = app.listen(PORT, (): void => {
    // eslint-disable-next-line no-console
    console.info(`Listening to port ${PORT}`);
  });
};

serverInitialize();

export default app;
