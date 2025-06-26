import Bun from 'bun';
import type { Context, Next } from 'hono';

export const checkAccess = async (c: Context, next: Next) => {
  const accessToken = c.req.header('Access-Token');
  const accessKeys = Bun.env['OUTER_ACCESS_KEY']?.split('|') || [];
  for (const key of accessKeys) {
    const [, value] = key.split(':');
    // console.log('value===', value);
    // console.log('accessToken===', accessToken);
    // console.log('value === accessToken===', value === accessToken);
    if (value === accessToken) {
      return await next();
    }
  }
  return c.json({ msg: 'Unauthorized' }, 403);
};
