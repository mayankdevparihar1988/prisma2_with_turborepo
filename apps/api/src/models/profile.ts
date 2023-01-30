import mongoose from 'mongoose';
import { BaseDocument, BaseSchema } from './baseMongoModel.js';

const { model, Schema, SchemaTypes } = mongoose;

export interface ProfileInput {
  firstName: string;
  lastName: string;
}

export interface Profile extends BaseDocument, ProfileInput {
  email: string;
  wallet: number;
  // gameHistory?: ObjectId[]; // List of all gameId's where userTipped

  gamesPlayed?: number;

  winningPoints?: number;
}
export const ProfileSchema = new Schema<Profile>({
  firstName: { type: SchemaTypes.String, required: true },
  lastName: { type: SchemaTypes.String, required: true },
  email: { type: SchemaTypes.String, required: true, index: true, unique: true },
  wallet: { type: SchemaTypes.Number, required: true, default: 0 },
  gamesPlayed: { type: SchemaTypes.Number, default: 0 },
  winningPoints: { type: SchemaTypes.Number, default: 0 },
  /*
  gameHistory: [
    {
      type: SchemaTypes.String
    }
  ],
  */
  ...BaseSchema
});
export const Profiles = model<Profile>('Profiles', ProfileSchema);
