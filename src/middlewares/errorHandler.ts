import type { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';

import { ErrorCode } from '../constants/errorCodes.ts';
import { AppError } from '../errors/custom.error.ts';
import { R } from '../utils/response.ts';

export const errorHandler = (error: Error, c: Context) => {
  if (error instanceof AppError) {
    console.warn(`[业务异常] >> 错误码: ${error.errorCode}, 状态码: ${error.statusCode}, 信息: ${error.message}`);

    // ✅ 最终修正 (TS2345): 使用 'as any' 类型断言强制绕过严格的类型检查
    // "@ts-expect-error
    c.status(error.statusCode as StatusCode);

    return R.fail(c, error.message, error.statusCode as StatusCode, error.context);
  }

  // 专门处理JSON解析错误
  // 检查是否是JSON解析错误
  if (error.message.includes('JSON') || error.message.includes('parse') || error.message.includes('position')) {
    console.warn(`[JSON解析异常] >> ${error.message}`);
    // "@ts-expect-error
    c.status(400 as StatusCode);
    return R.fail(c, '请求体JSON格式错误，请检查JSON语法', 400, null);
  }

  // 对于未知错误
  console.error('[系统异常] >> 发生未处理的错误:', error);
  const unexpectedError = ErrorCode.G001_UNEXPECTED_ERROR;

  // "@ts-expect-error
  c.status(unexpectedError.status as StatusCode);

  return R.fail(c, unexpectedError.message, unexpectedError.status, null);
};
