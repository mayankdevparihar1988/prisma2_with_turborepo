import { config as dotEnvConfig } from 'dotenv';
import { format } from 'date-fns';
import { fetch } from 'undici';
import { EVENT_TIME_DURATION } from './config/gameSettings.js';

dotEnvConfig();
const { API_URI } = process.env;
const interval = EVENT_TIME_DURATION * 60 * 1000;
const main = async () => {
  try {
    const body = {
      query: `
          mutation createGame($gameInput: GameCreateInput ) {
            create (gameInput: $gameInput)   {
              id
            }
          }
      `,
      variables: { gameInput: { name: `Test_Game_OF_${format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS")}` } }
    };

    const res = await fetch(API_URI, {
      body: JSON.stringify(body),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.info('........NEW GAME CREATED..........');
    const json = await res.json();
    console.log(json);
  } catch (error) {
    console.error('Error In Complete Game', error);
  }
};
main();
setInterval(main, interval);
export default main;
