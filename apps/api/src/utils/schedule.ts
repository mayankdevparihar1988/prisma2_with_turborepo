import { nextFriday, set } from 'date-fns';
import { GAME_SETTINGS } from '../config/gameSettings.js';

const {
  schedule: { drawTime }
} = GAME_SETTINGS;

export const scheduleNextFriday = (): Date => set(nextFriday(new Date()), drawTime);
