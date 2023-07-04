import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { dirname, join } from 'node:path';
import { inspect } from 'node:util';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(new URL('.', import.meta.url)));

const pkg = JSON.parse(readFileSync(join(__dirname, '/../../../api/', 'package.json')).toString());

export const API = {
  name: pkg.name,
  version: pkg.version
};

// eslint-disable-next-line no-console
console.info('Package Info: 👉️', inspect(API));

export const ROUTER_URLS = {
  VERSION1: '/api/v1/'
};

export enum ACCESS_ROLES {
  USER = 'user'
}

export const PERSON_ACCOUNT_SUFIX = '@ibsolution.de';
