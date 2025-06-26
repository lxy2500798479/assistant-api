import type { ErrorCodeType } from '../constants/errorCodes';

/**
 * 应用程序的自定义错误基类
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly context?: Record<string, unknown>;

  constructor(errorType: ErrorCodeType, context?: Record<string, unknown>) {
    super(errorType.message); // 设置 error.message
    this.statusCode = errorType.status;
    this.errorCode = errorType.code;
    this.context = context; // 用于日志记录的上下文信息

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// 可以根据需要派生出更具体的错误类
export class NotFoundError extends AppError {}
export class BusinessLogicError extends AppError {}
