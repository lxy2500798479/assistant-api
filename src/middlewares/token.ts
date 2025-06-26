import type { Context, Next } from 'hono';
import { decode } from 'hono/jwt';

import redis from '../client/redis.ts';

import { R } from '@/utils/response.ts';

export const checkToken = async (c: Context, next: Next) => {
  try {
    const tokenToVerify = c.req.header('Authorization') || '';
    if (!tokenToVerify) {
      return R.unauthorized(c, '鉴权码缺失');
    }
    const { payload } = decode(tokenToVerify);
    if (!payload || !payload['jti']) {
      return R.unauthorized(c, '解码失败，请重新登录');
    }

    // 【核心改动】检查 Token 是否在黑名单中
    const jti = payload['jti'] as string;
    const isInDenylist = await redis.get(`denylist:${jti}`);
    if (isInDenylist) {
      return R.unauthorized(c, '会话已过期，请重新登录');
    }

    delete payload['exp'];
    delete payload['jti']; // jti 也不需要透传给后续逻辑
    c.set('user', payload);

    return await next();
  } catch {
    return R.unauthorized(c, '鉴权码解析失败');
  }
};
