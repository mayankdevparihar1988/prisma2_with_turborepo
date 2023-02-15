import { Author } from './user.js';

export interface Joke {
  id: string;
  text: string;
  authorId: string;
  Author?: Author;
}
