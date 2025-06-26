import Bun from 'bun';
import type { Context, Next } from 'hono';
import { decode } from 'hono/jwt';

import redis from '../client/redis.ts';

export const payloadLogger = async (c: Context, next: Next) => {
  const paths = Bun.env['PRINT_LOG_PATH']?.split('|') || [];
  for (const path of paths) {
    const [left, right] = path.split(':');
    const method = c.req.method;
    if (left === method && right === c.req.path) {
      let payload = {};
      if (method === 'GET') {
        payload = c.req.query();
      } else if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
        payload = await c.req.json();
      }
      console.log('<-- payload', JSON.stringify(payload));
    }
  }
  return await next();
};

export const counterLogger = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization') || '';
  // 提取实际的 token（移除 "Bearer " 前缀）
  const tokenToVerify = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  if (tokenToVerify && tokenToVerify.split('.').length === 3) {
    try {
      const result = decode(tokenToVerify);
      if (result?.payload) {
        await redis.pipeline().incr('visit_counter').incr(`visit_counter:${result.payload['name']}`).exec();
      }
    } catch (error) {
      // 捕获解码错误但不中断请求
      console.error('Token decode error in counterLogger:', error);
    }
  }
  return await next();
};
