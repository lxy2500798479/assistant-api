import Bun from 'bun';
import { randomUUID } from 'crypto'; // 导入内置的 crypto 模块
import { sign } from 'hono/jwt';

import { ErrorCode } from '../constants/errorCodes';
import { AppError } from '../errors/custom.error';

/**
 * @description JWT载荷（Payload）中包含的数据结构
 */
interface TokenPayload {
  id: string; // 建议使用字符串类型的ID
  username: string;
}

/**
 * 封装的JWT生成函数
 * @param payloadData - 需要存储在Token中的核心数据，如用户ID和用户名
 * @returns {Promise<string>} 生成的JWT字符串
 */
export const generateToken = async (payloadData: TokenPayload): Promise<string> => {
  // 1. 从环境变量读取过期秒数，默认为24小时
  const expiresInSeconds = parseInt(Bun.env['AUTH_TOKEN_EXPIRE'] || '86400', 10);

  // 2. 计算未来的过期时间点（时间戳，单位为秒）
  const expirationTimestamp = Math.floor(Date.now() / 1000) + expiresInSeconds;

  // 3. 准备完整的JWT载荷
  const payload = {
    ...payloadData,
    exp: expirationTimestamp,
    jti: randomUUID(), // <-- 【新增】为每个Token生成一个唯一的ID
  };

  // 4. 从环境变量获取JWT密钥
  const secret = Bun.env['JWT_SECRET'];
  if (!secret) {
    console.error('JWT_SECRET environment variable is not set!');
    throw new AppError(ErrorCode.G001_UNEXPECTED_ERROR);
  }

  // 5. 签名并生成Token
  return await sign(payload, secret);
};
