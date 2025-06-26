import type { Context } from 'hono';

import { RobotsService } from '../service/robots.service.ts';
import { robotsLoginSchema, robotsRegisterSchema } from '../types/dto/robots.ts';
import { R } from '../utils/response.ts';

const robotsService = new RobotsService();

export class RobotsController {
  public async getRobots(c: Context) {
    const result = await robotsService.getRobots();

    return R.success(c, result);
  }

  public async loginRobot(c: Context) {
    const body = await c.req.json();

    const validation = robotsLoginSchema.safeParse(body);
    if (!validation.success) {
      const firstErrorMessage = validation.error.issues[0]!.message;

      return R.badRequest(c, firstErrorMessage);
    }
    const result = await robotsService.LoginRobot(body);
    return R.success(c, result);
  }

  public async registerRobot(c: Context) {
    const body = await c.req.json();

    const validation = robotsRegisterSchema.safeParse(body);
    if (!validation.success) {
      const firstErrorMessage = validation.error.issues[0]!.message;
      return R.badRequest(c, firstErrorMessage);
    }
    const result = await robotsService.createRobot(body);
    return R.success(c, result);
  }

  public async logoutRobot(c: Context) {
    // 从请求头中获取完整的 'Bearer <token>'
    const authHeader = c.req.header('Authorization') || '';

    if (authHeader) {
      await robotsService.logoutRobot(authHeader);
    }

    return R.success(c, null, '您已成功退出登录');
  }
}
