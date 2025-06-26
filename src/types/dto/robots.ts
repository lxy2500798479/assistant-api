import { z } from 'zod';

import { ErrorCode } from '../../constants/errorCodes.ts';

export const robotsLoginSchema = z.object({
  username: z.string().min(1, { message: ErrorCode.A001_USERNAME_REQUIRED.message }),
  password: z.string().min(1, { message: ErrorCode.A002_PASSWORD_REQUIRED.message }),
});

export const robotsRegisterSchema = z.object({
  username: z.string().min(1, { message: ErrorCode.A001_USERNAME_REQUIRED.message }),
  password: z.string().min(1, { message: ErrorCode.A002_PASSWORD_REQUIRED.message }),
  nickname: z.string().min(1, { message: ErrorCode.A003_NICKNAME_REQUIRED.message }),
  wxid: z.string().min(1, { message: ErrorCode.A004_WXID_REQUIRED.message }),
  avatar: z.string().min(1, { message: ErrorCode.A005_AVATAR_REQUIRED.message }),
});

export type RobotsRegisterDto = z.infer<typeof robotsRegisterSchema>;

// 为了清晰，我将类型导出命名为 Schema
export type RobotsLoginDto = z.infer<typeof robotsLoginSchema>;
