import { config as dotEnvConfig } from 'dotenv';
import { ConnectOptions } from 'mongoose';

dotEnvConfig();

export const MONGODB_CONN_CONFIG: ConnectOptions = {
  // useCreateIndex: true
};

export const {
  env: { DB_URI: MONGO_DB_CONN }
} = process;
