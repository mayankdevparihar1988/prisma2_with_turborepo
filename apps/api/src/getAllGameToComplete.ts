import { config as dotEnvConfig } from 'dotenv';
import { head } from 'lodash-es';
import { GamesBl } from './bl/games.js';
import { connectDb, disconnectDb } from './middleware/mongo.js';

dotEnvConfig();
const main = async () => {
  await connectDb();
  console.info('Start complete game process for current game');
  const game = new GamesBl();
  const allGameToComplete = await game.getGamesToComplete();
  console.log('TaskToClose', allGameToComplete);
  const allGameCompleted = await game.completeGame();
  console.log('The all game completed are ', head(allGameCompleted));

  await disconnectDb();
};

main();

export default main;
