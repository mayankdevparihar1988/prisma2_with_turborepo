import { config as dotEnvConfig } from 'dotenv';
import { fetch } from 'undici';
import { EVENT_TIME_DURATION } from './config/gameSettings.js';

dotEnvConfig();
const { API_URI } = process.env;
const interval = 60 * EVENT_TIME_DURATION * 1000 + 1000; // Event Time Duration in min plue onesecond dely
const main = async () => {
  try {
    const body = {
      query: `
          mutation gameCompleteMutation {
            completeGame
          }
      `
    };

    const res = await fetch(API_URI, {
      body: JSON.stringify(body),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.info('........GAME COMPLETE..........');
    const json = await res.json();
    console.log(json);
  } catch (error) {
    console.error('Error In Complete Game', error);
  }
};

main();
setInterval(main, interval);
export default main;
