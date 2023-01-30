import mongoose from 'mongoose';
import { isEmpty, isNil, map, size, toNumber, uniqBy, values } from 'lodash-es';
import { BaseDocument, BaseSchema } from './baseMongoModel.js';
import { GameTicketContext } from './bl/gameTicketContext.js';
import { PlayerTicket, PlayerTicketSchema } from './playerTicket.js';
import { GameSettings, GameSettingSchema, GameType } from './gameSettings.js';
import { GamePointsForPlayer, WinningTipSchema } from './gameResult.js';
import { EVENT_TIME_DURATION, GAME_SETTINGS } from '../config/gameSettings.js';

const { model, Schema, SchemaTypes } = mongoose;

export const GameDrawSchema = {
  ticket: [{ type: SchemaTypes.String, required: true }],
  superNumber: { type: SchemaTypes.String, required: true },
  date: Date
};

export enum GameStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  INCOMING = 'incoming',
  SCHEDULED = 'scheduled'
}
export interface Game extends BaseDocument {
  name: string;
  gameDate: Date;

  status: GameStatus;
  draw?: GameTicketContext;
  drawDate: Date;
  playerTickets?: PlayerTicket[];
  winningTips?: GamePointsForPlayer[];
  gameSetting?: GameSettings;
}
export const GameSchema = new Schema<Game>({
  name: { type: SchemaTypes.String, required: true, index: true },
  gameDate: {
    type: SchemaTypes.Date,
    required: true,
    default: () => {
      return Date.now();
    }
  },
  status: {
    type: SchemaTypes.String,
    enum: values(GameStatus),
    default: GameStatus.ACTIVE
  },
  draw: { type: GameDrawSchema, required: false },
  drawDate: {
    type: SchemaTypes.Date,
    default: () => {
      return Date.now() + EVENT_TIME_DURATION * 60 * 1000;
    }
  },
  playerTickets: [PlayerTicketSchema],
  winningTips: [WinningTipSchema],
  gameSetting: {
    type: GameSettingSchema,
    require: true,
    default: {
      gameType: GameType.FIVEOFFIFTY,
      ticketLength: GAME_SETTINGS.gameNumbers,
      inputDigitRange: GAME_SETTINGS.maxNumber,
      maxTicketAllowed: GAME_SETTINGS.maxTicketAllowed,
      topupAmount: GAME_SETTINGS.topUpPoints,
      ticketPrice: GAME_SETTINGS.ticketPrice,
      winPoints: {
        superNumber: GAME_SETTINGS.winPoints.superNumber,
        sixMatch: GAME_SETTINGS.winPoints.scala[6],
        fiveMatch: GAME_SETTINGS.winPoints.scala[5],
        fourMatch: GAME_SETTINGS.winPoints.scala[4],
        threeMatch: GAME_SETTINGS.winPoints.scala[3],
        twoMatch: GAME_SETTINGS.winPoints.scala[2],
        oneMatch: GAME_SETTINGS.winPoints.scala[1]
      }
    }
  },
  ...BaseSchema
});

// eslint-disable-next-line func-names
GameSchema.virtual('totalTickets').get(function () {
  const { playerTickets } = this;
  return size(playerTickets);
});

GameSchema.virtual('totalParticipants').get(function () {
  const { playerTickets } = this;
  if (isEmpty(playerTickets) || isNil(playerTickets)) {
    return 0;
  }
  return size(uniqBy(playerTickets, 'player'));
});

GameSchema.virtual('gameTotalWinPoints').get(function () {
  const { winningTips } = this;
  if (isEmpty(winningTips) || isNil(winningTips)) {
    return 0;
  }
  let gameTotalWinPoints = 0;
  console.log('All winningTips are ', winningTips);
  map(winningTips, ({ result }) =>
    map(result, ({ points }) => {
      // eslint-disable-next-line no-return-assign
      return (gameTotalWinPoints += toNumber(points));
    })
  );

  console.log('Total GameTotalWinningPoint', gameTotalWinPoints);

  return gameTotalWinPoints;
});

export const Games = model<Game>('Games', GameSchema);
