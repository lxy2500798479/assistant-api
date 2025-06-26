import { z } from 'zod';

import { ErrorCode } from '../../constants/errorCodes.ts';

// 创建客户的 Schema
export const customerCreateSchema = z.object({
  wxid: z.string().min(1, { message: ErrorCode.C004_WXID_REQUIRED.message }),
  nickname: z.string().min(1, { message: ErrorCode.C005_NICKNAME_REQUIRED.message }),
  phoneNumber: z.string().optional(),

  // [FIXED] levelId 类型从 bigint 改为 number (Int)
  levelId: z.number().int({ message: '客户等级ID必须是整数' }),

  // referrerRobotId 关联的是 Robot.id (BigInt)，所以这里保持 z.bigint()
  referrerRobotId: z.bigint().optional(),
});

// 更新客户的 Schema
export const customerUpdateSchema = z
  .object({
    nickname: z.string().min(1, { message: ErrorCode.C005_NICKNAME_REQUIRED.message }).optional(),
    phoneNumber: z.string().optional(),

    // [FIXED] levelId 类型从 bigint 改为 number (Int)
    levelId: z.number().int({ message: '客户等级ID必须是整数' }).optional(),
  })
  .strip();

export const customerSearchSchema = z.object({
  nickname: z.string().optional(),
  phoneNumber: z.string().optional(),
  levelId: z.number().int().optional(),
  current: z.number().optional(),
  pageSize: z.number().optional(),
});

// 从 Schema 推断出 TypeScript 类型
export type CustomerCreateDto = z.infer<typeof customerCreateSchema>;
export type CustomerUpdateDto = z.infer<typeof customerUpdateSchema>;

export type CustomerSearchDto = z.infer<typeof customerSearchSchema>;
