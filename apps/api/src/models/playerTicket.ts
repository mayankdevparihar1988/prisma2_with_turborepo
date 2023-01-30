import mongoose from 'mongoose';
import { GameTicketContext } from './bl/gameTicketContext.js';

const { Schema, SchemaTypes } = mongoose;
export interface PlayerTicket extends GameTicketContext {
  id: string;
  player: string;
}

export const PlayerTicketSchema = new Schema({
  id: { type: SchemaTypes.String, require: true },
  player: { type: SchemaTypes.String, require: true },
  ticket: [{ type: SchemaTypes.String, required: true }],
  superNumber: { type: SchemaTypes.String, required: true },
  date: Date
});
