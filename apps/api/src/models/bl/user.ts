import { Joke } from './joke.js';

export interface Author {
  id: string;
  name: string;
  joke?: Joke[];
}
