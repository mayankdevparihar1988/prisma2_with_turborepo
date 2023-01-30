import { config as dotEnvConfig } from 'dotenv';
import { GamesBl } from './bl/games.js';
import { connectDb, disconnectDb } from './middleware/mongo.js';

dotEnvConfig();
const main = async () => {
  await connectDb();
  console.info('Start complete game process for current game');
  const game = new GamesBl();
  await game.deleteAllCompletedGames();
  await disconnectDb();
};

main();

export default main;
