import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface BaseDocument extends mongoose.Document {
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
  updatedBy?: string;
}

export const BaseSchema = {
  createdAt: Schema.Types.Date,
  updatedAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedBy: Schema.Types.String
};
