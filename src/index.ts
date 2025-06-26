import Bun from 'bun';
import { type Context, Hono } from 'hono';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { timeout } from 'hono/timeout';

import { errorHandler } from './middlewares/errorHandler.ts';
import apiRouter from './router/router';

// @ts-expect-error Augmenting BigInt.prototype for native JSON.stringify support.
(BigInt.prototype as unknown).toJSON = function () {
  // @ts-expect-error 'this' is inferred as 'unknown' but is a BigInt at runtime.
  return this.toString();
};
const app = new Hono();

app.use('*', etag(), logger());
app.use('*', prettyJSON());
app.use('*', cors());
app.use('*', timeout(20 * 1000));
app.use(secureHeaders());

app.get('/', (c) => {
  return c.json({ msg: 'Welcome To Bun.js API!' });
});

app.route('/api', apiRouter);
app.onError(errorHandler);
app.notFound((c: Context) => c.json({ msg: 'Not Found' }, 404));

export default { port: Bun.env['PORT'] || 3000, fetch: app.fetch };
