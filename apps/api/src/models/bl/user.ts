import { Joke } from './joke.js';

export interface User {
  id: string;
  name: string;
  Joke?: Joke;
}
