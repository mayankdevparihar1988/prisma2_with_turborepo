import { JokeDao } from '../../db/joke/joke.js';
import { Joke } from '../../models/bl/joke.js';

export class JokeBl {
  // eslint-disable-next-line class-methods-use-this
  public async getList(top?: number, skip?: number): Promise<Joke[]> {
    let jokes: Joke[];
    try {
      const jokeDao = new JokeDao();
      jokes = await jokeDao.getlist();
      console.log('Jokes retireved in bl ', jokes);
    } catch (error) {
      console.error(error);
      throw error;
    }
    return jokes;
  }
}
