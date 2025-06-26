import { RobotStatus } from '@prisma/client'; // <-- 从这里导入

/**
 * @description 登录成功后返回的机器人信息，不包含敏感数据
 */
export interface RobotInfoVo {
  id: bigint;
  username: string;
  nickname: string | null;
  avatar: string | null;
  status: RobotStatus;
}

/**
 * @description 机器人登录成功后的响应体结构
 */
export interface RobotLoginVo {
  token: string;
  robotInfo: RobotInfoVo;
}
