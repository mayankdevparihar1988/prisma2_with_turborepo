import mongoose from 'mongoose';
import { MONGODB_CONN_CONFIG, MONGO_DB_CONN } from '../config/mongo.js';

export async function connectDb(): Promise<void> {
  try {
    // eslint-disable-next-line no-console
    console.debug(`Start connection to ${MONGO_DB_CONN}`);
    await mongoose.connect(MONGO_DB_CONN, MONGODB_CONN_CONFIG);
    // eslint-disable-next-line no-console
    console.debug(`Connection to ${MONGO_DB_CONN} done`);
  } catch (error) {
    console.error('Error in Connecting Mongo', error);
    throw new Error(error);
  }
}

export async function disconnectDb(): Promise<void> {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error in Connecting Mongo', error);
    throw new Error(error);
  }
}
