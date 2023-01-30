import { config as dotEnvConfig } from 'dotenv';
import { toNumber } from 'lodash-es';
import type { GameSettings } from '../models/bl/gameSettings.js';

dotEnvConfig();

const {
  env: { EVENT_TIME_DURATION: timeDuration = '15', PROFILE_INIT_WALLET: wallet = 50 }
} = process;

export const EVENT_TIME_DURATION = toNumber(timeDuration);
export const PROFILE_INIT_WALLET = toNumber(wallet);

export const GAME_SETTINGS: GameSettings = {
  alphaNum: 2,
  gameNumbers: 5,
  maxNumber: 19,
  nameAlphabet: 'ABCDEFGHIJKLMNOPQRSTUVW',
  numberAlphabet: '0123456789',
  topUpPoints: 10,
  maxTicketAllowed: 5,
  ticketPrice: 10,
  schedule: {
    drawTime: { hours: 10, minutes: 0, seconds: 0 }
  },
  winPoints: {
    superNumber: 100,
    scala: [0, 10, 20, 50, 100, 1000, 3000]
  }
};
