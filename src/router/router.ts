import { Hono } from 'hono';
import { poweredBy } from 'hono/powered-by';
import { secureHeaders } from 'hono/secure-headers';

import { counterLogger, payloadLogger } from '../middlewares/logger.ts';
import customerRouter from './customer.ts';
import robotsRouter from './robots.ts';

const app = new Hono();
app.use(secureHeaders());
app.use(poweredBy());

// 根据 .env 里的配置的 method 与 path 进行匹配，并打印请求体
app.use('*', payloadLogger);
app.use('*', counterLogger);

app.route('/v1/robots', robotsRouter);
app.route('/v1/customer', customerRouter);

export default app;
