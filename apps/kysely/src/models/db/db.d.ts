import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface _PrismaMigrations {
  id: string;
  checksum: string;
  finished_at: Timestamp | null;
  migration_name: string;
  logs: string | null;
  rolled_back_at: Timestamp | null;
  started_at: Generated<Timestamp>;
  applied_steps_count: Generated<number>;
}

export interface Joke {
  id: string;
  text: string;
  userId: string | null;
}

export interface User {
  id: string;
  name: string;
}

export interface DB {
  _prisma_migrations: _PrismaMigrations;
  Joke: Joke;
  User: User;
}
