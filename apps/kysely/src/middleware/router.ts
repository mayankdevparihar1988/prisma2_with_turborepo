import { each, endsWith, toLower } from 'lodash-es';
import { Application } from 'express';
import * as routes from '../routes/index.js';
import { ROUTER_URLS } from '../config/api.js';

const addVersion = (route: string): string => ROUTER_URLS.VERSION1 + route;

const calculateUrl = (name: string): string => {
  const x = toLower(name);
  return endsWith(x, 'route') ? addVersion(x.slice(0, -5)) : addVersion(x);
};

export function bindRoutes(app: Application): void {
  each(routes, (route, name): Application => app.use(calculateUrl(name), route));
}
