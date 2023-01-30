import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;
export interface GamePoints {
  points: number;
  msg: string;
}

export const GamePointsSchema = new Schema({
  points: { type: SchemaTypes.Number },
  msg: { type: SchemaTypes.String, required: true }
});
