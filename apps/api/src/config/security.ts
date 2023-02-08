import { toNumber } from 'lodash-es';
import { ACCESS_ROLES } from './api.js';

const User = { id: 'user@local.sec', groups: [ACCESS_ROLES.USER] };

export const LocalUser = {
  ...User
};

export const ApiAccessScope = ['apiaccess'];

export const HTTP_HEADER_SIGNATURE = 'data-signature';

export const HTTP_HEADER_TIMESTAMP = 'data-timestamp';

export const { HTTP_SIGNATURE_SECRET = 'providesecret' } = process.env;

export const HTTP_TIMESTAMP_SPAN = toNumber(process.env.HTTP_TIMESTAMP_SPAN) || 60; // sek
