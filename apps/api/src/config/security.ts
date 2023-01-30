import { LocalUser as DefaultLocalUser } from '@schamane/small-graphql-mongoose-middleware';
import { config as dotEnvConfig } from 'dotenv';
// import { ACCESS_ROLES } from './api.js';

dotEnvConfig();

/*
const User1 = { id: 'diana.turcoman@ibsolution.de', groups: [ACCESS_ROLES.USER] };
const User2 = { id: 'nazar.kulyk@ibsolution.de', groups: [ACCESS_ROLES.USER] };
const User3 = { id: 'mayank.parihar@ibsolution.de', groups: [ACCESS_ROLES.USER] };
const User4 = { id: 'alexandra.bozocea@ibsolution.de', groups: [ACCESS_ROLES.USER] };
const User5 = { id: 'andreas.delgaldo@ibsolution.de', groups: [ACCESS_ROLES.USER] };
const User6 = { id: 'kevin.ihrig@ibsolution.de', groups: [ACCESS_ROLES.USER] };
*/

export const LocalUser = {
  ...DefaultLocalUser
  // ...User1
};
