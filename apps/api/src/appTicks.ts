import { ApplicationPubSub } from '@schamane/small-graphql-mongoose-middleware';
import { format } from 'date-fns';
import { last } from 'lodash-es';
import { GamesBl } from './bl/games.js';
import { EVENTS } from './config/grapqhl.js';

export const gameTickEveryMinute = async (): Promise<void> => {
  console.info('gameTickEveryMinute:: 💡 tick');
  try {
    const games = new GamesBl();
    const completedGame = await games.completeGame();
    if (!completedGame) {
      console.info('gameTickEveryMinute:: 💡 no game to complete');
      return;
    }
    ApplicationPubSub.publish(EVENTS.GAME.COMPLETED, { gameCompleted: { completed: last(completedGame) } });
    console.info('gameTickEveryMinute:: 💡 event for finished game');
  } catch (ex) {
    console.error(ex);
  } finally {
    console.info('gameTickEveryMinute:: 💡 tick done');
  }
};

export const gameTickEvery15Minute = async (): Promise<void> => {
  console.info('gameTickEvery15Minute:: 💡 tick');
  try {
    const name = `Game ${new Date().toISOString()}`;
    const games = new GamesBl();
    const createdGame = await games.createGame(name);
    ApplicationPubSub.publish(EVENTS.GAME.CREATED, { gameCreated: { created: createdGame._id } });
    console.info('gameTickEvery15Minute:: 💡 event for created game');
  } catch (ex) {
    console.error(ex);
  } finally {
    console.info('gameTickEvery15Minute:: 💡 tick done');
  }
};
