import { User } from './user.js';

export interface Joke {
  id: string;
  text: string;
  userId?: string;
  User?: User;
}
