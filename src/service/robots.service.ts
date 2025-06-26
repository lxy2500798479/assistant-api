import Bun from 'bun';
import { decode } from 'hono/jwt';

import prisma from '../client/prisma.ts';
import { ErrorCode } from '../constants/errorCodes.ts';
import { AppError } from '../errors/custom.error.ts';
import type { RobotsLoginDto, RobotsRegisterDto } from '../types/dto/robots.ts';
import type { RobotLoginVo } from '../types/vo/robots.ts';
import { generateToken } from '../utils/jwt.ts';

import redis from '@/client/redis.ts';

export class RobotsService {
  public async getRobots() {
    return prisma.robot.findMany();
  }

  public async createRobot(createDto: RobotsRegisterDto) {
    const { username, password } = createDto;

    const hashedPassword = await Bun.password.hash(password);

    const newRobot = await prisma.robot.create({
      data: {
        username: username,
        password: hashedPassword,
        nickname: createDto.nickname,
        avatar: createDto.avatar,
        wxid: createDto.wxid,
      },
      omit: {
        password: true,
      },
    });

    return {
      ...newRobot,
      id: newRobot.id.toString(),
    };
  }

  public async LoginRobot(loginDto: RobotsLoginDto): Promise<RobotLoginVo> {
    const { username, password } = loginDto;

    const robot = await prisma.robot.findUnique({
      where: { username },
    });

    if (!robot) {
      throw new AppError(ErrorCode.A004_USER_NOT_FOUND);
    }

    const isPasswordValid = await Bun.password.verify(password, robot.password);

    if (!isPasswordValid) {
      throw new AppError(ErrorCode.A003_INVALID_CREDENTIALS);
    }

    const token = await generateToken({
      id: robot.id.toString(),
      username: robot.username,
    });

    return {
      token,
      robotInfo: {
        id: robot.id,
        username: robot.username,
        nickname: robot.nickname,
        avatar: robot.avatar,
        status: robot.status,
      },
    };
  }

  public async logoutRobot(token: string): Promise<void> {
    const { payload } = decode(token);
    if (!payload || !payload['jti'] || !payload['exp']) {
      // Token 格式不正确，直接返回
      return;
    }

    const jti = payload['jti'] as string;
    const exp = payload['exp'] as number;
    const now = Math.floor(Date.now() / 1000);
    const remainingTime = exp - now;

    console.log(`[Logout] JTI: ${jti}`);
    console.log(`[Logout] Token 剩余有效期: ${remainingTime} 秒`);

    if (remainingTime > 0) {
      await redis.set(`denylist:${jti}`, '1', 'EX', remainingTime);
    }
  }
}
