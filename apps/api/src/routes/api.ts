import os from 'os';
// import passport from 'passport';
// import { get } from 'lodash';
import express, { Application } from 'express';
// import { rateLimitMiddleWare } from '../middleware/ratelimit';
import { sayHello } from '@my_repo/common';
import Typicode from '@my_repo/httpsdk';
import { API } from '../config/api.js';
import { CURRENT_AUTH_STRATEGY } from '../middleware/security.js';
// import { jsonResponse } from '../middleware/middleware';

const app: Application = express();
/**
 * API Generic Api
 * http method
 * Get info
 * sends back current instance and api version
 * @return <object> with properties for instance and version
 */
app.get('/info', async (req, res): Promise<void> => {
  const client = new Typicode({ apiKey: '1234' });

  const posts = await client.getPosts();
  console.log('POSTS are ', posts);
  sayHello('Mayank');
  res.send({ instance: os.hostname(), headers: req.headers, CURRENT_AUTH_STRATEGY, ...API });
});

/*
app.get('/me', passport.authenticate(CURRENT_AUTH_STRATEGY, { session: false }), rateLimitMiddleWare('/api/me'), (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authInfo = req.authInfo as any;
  res.send({
    msg: 'me',
    headers: req.headers,
    user: req.user,
    isOpenId: JSON.stringify(authInfo?.checkLocalScope('openid')),
    isUser: JSON.stringify(authInfo?.checkLocalScope('User')),
    isAdmin: JSON.stringify(authInfo?.checkLocalScope('Admin')),
    scope: JSON.stringify(authInfo?.getAttribute('xs.system.attributes')),
    authInfo: JSON.stringify(req.authInfo),
    tokenInfo: JSON.stringify(get(req, 'tokenInfo')),
    clientId: authInfo?.getClientId(),
    ip: req.ip,
    xforwardfor: req.headers['x-forward-for']
  });
});
*/
export const ApiRoute: Application = app;
