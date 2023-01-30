import { map, toNumber } from 'lodash-es';
import mongoose from 'mongoose';

import { GamePoints, GamePointsSchema } from './bl/gamePoints.js';

const { Schema, SchemaTypes } = mongoose;
export interface GamePointsForPlayer {
  player: string;
  result: GamePoints[];
}

export interface WinningTip extends GamePointsForPlayer {
  date: Date;
}
export const WinningTipSchema = new Schema({
  player: { type: SchemaTypes.String, required: true },
  result: [GamePointsSchema],
  date: Date
  // totalPoints
});
WinningTipSchema.virtual('totalPoints').get(function () {
  const { result } = this;
  console.log('The result is ', result);
  let totalPoints = 0;

  map(result, ({ points }) => {
    // eslint-disable-next-line no-return-assign
    return (totalPoints += toNumber(points));
  });

  console.log('TotalPoints ', totalPoints);

  return totalPoints;
});
