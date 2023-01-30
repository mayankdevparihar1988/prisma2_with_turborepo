import cors from 'cors';
import helmet from 'helmet';
import { Application, RequestHandler } from 'express';
import passport from 'passport';
import type { Strategy as PassportStrategy } from 'passport';
import { ForwardAuthStrategy } from 'passport-forward-auth';
import { config as dotEnvConfig } from 'dotenv';
import { MockStrategy, User } from '@schamane/small-graphql-mongoose-middleware';
import { LocalUser } from '../config/security.js';

dotEnvConfig();

export const isLocalEnv: boolean = process.env.ISLOCALENV === 'local';
export const CURRENT_AUTH_STRATEGY = isLocalEnv ? 'mock' : 'forward-auth';

const authHeaders = ['x-forwarded-user'];

const createLocalStrategy = (): PassportStrategy => {
  return new MockStrategy((userId: string, password: string, done: (a: unknown, b: User) => void): void => {
    done(null, LocalUser);
  });
};

const createStrategy = (): PassportStrategy =>
  new ForwardAuthStrategy({ authHeaders }, (verifyHeaders, done) => {
    // console.info('got HEADERS:', verifyHeaders);
    const id = verifyHeaders[authHeaders[0]];
    // const groups = verifyHeaders[authHeaders[1]];
    const user = { id, groups: ['user'] };
    return !user || !user.id ? done(null) : done(null, user);
  });

export function initCors(app: Application): void {
  app.use(cors());
}

export function initHelmet(app: Application): void {
  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
}

export const initBasicSecurity = (): RequestHandler => {
  if (isLocalEnv) {
    // eslint-disable-next-line no-console
    console.info('*** Local Environment, Security Settings will be completely ignored! ***');
  }

  const stragegy = isLocalEnv ? createLocalStrategy() : createStrategy();

  passport.use(stragegy);
  return passport.initialize();
};

// eslint-disable-next-line no-console
console.info('DO INIT security');
