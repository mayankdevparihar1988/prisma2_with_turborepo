import { values } from 'lodash-es';
import mongoose from 'mongoose';
import { GAME_SETTINGS } from '../config/gameSettings.js';

const { Schema, SchemaTypes } = mongoose;
export enum GameType {
  FIVEOFFIFTY = 'fiveOfFifty',
  SIXOFFIFTY = 'sixOfFifty'
}

export interface GameSettings {
  gameType: GameType;
  ticketLength: number; // 5 or 6
  inputDigitRange: number;
  maxTicketAllowed: number;
  topupAmount: number;

  ticketPrice: number;
  schedule: {
    drawTime: { hours: number; minutes: number; seconds: number };
  };
  winPoints: {
    superNumber: number;
    sixMatch: number;
    fiveMatch: number;
    fourMatch: number;
    threeMatch: number;
    twoMatch: number;
    oneMatch: number;
  };
}

export const GameSettingSchema = new Schema<GameSettings>({
  gameType: {
    type: SchemaTypes.String,
    enum: values(GameType)
  },

  ticketLength: { type: SchemaTypes.Number },
  inputDigitRange: { type: SchemaTypes.Number },
  maxTicketAllowed: { type: SchemaTypes.Number },
  topupAmount: { type: SchemaTypes.Number },
  ticketPrice: { type: SchemaTypes.Number },
  winPoints: {
    superNumber: { type: SchemaTypes.Number },
    sixMatch: { type: SchemaTypes.Number },
    fiveMatch: { type: SchemaTypes.Number },
    fourMatch: { type: SchemaTypes.Number },
    threeMatch: { type: SchemaTypes.Number },
    twoMatch: { type: SchemaTypes.Number },
    oneMatch: { type: SchemaTypes.Number }
  }
});

// GAME_SETTINGS.winPoints.scala[5]
