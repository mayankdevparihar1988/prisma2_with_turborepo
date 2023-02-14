import express, { Application } from 'express';
import { JokeBl } from '../bl/joke/joke.js';

const app: Application = express();
/**
 * API Generic Api
 * http method
 * Get info
 * sends back current instance and api version
 * @return <object> with properties for instance and version
 */
app.get('/list', async (req, res): Promise<void> => {
  const jokeBl = new JokeBl();
  const jokes = await jokeBl.getList();
  res.send(jokes);
});
export const JokeRoute: Application = app;
