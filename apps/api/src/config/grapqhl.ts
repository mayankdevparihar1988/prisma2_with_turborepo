import { PlaygroundConfig } from 'apollo-server-express';
import { ROUTER_URLS } from './api.js';

const pathPrefix = ROUTER_URLS.VERSION1 || '/';

const playgroundSettings: PlaygroundConfig = {
  settings: {
    // 'schema.polling.enable': false
  }
};

export const GraphQlOptions = {
  path: `${pathPrefix}graphql`,
  introspection: true,
  playground: playgroundSettings,
  tracing: true
};
export const EVENTS = {
  PROFILE: {
    CHANGED: 'PROFILE_CHANGED'
  },
  GAME: {
    CREATED: 'GAME_CREATED',
    PLAYED: 'GAME_PLAYED',
    CHANGED: 'GAME_CHANGED',
    COMPLETED: 'GAME_COMPLETED'
  },
  TICKET: {
    CHANGED: 'TICKET_CHANGED'
  }
};
