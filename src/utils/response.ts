import type { Context } from 'hono';
import type { ContentfulStatusCode, StatusCode } from 'hono/utils/http-status';

import { SuccessMessage } from '../constants/errorCodes.ts';

/**
 * 最终的 API 响应工具类
 * 旨在提供极其简洁的控制器返回体验
 */
export class R {
  // ===================================================================
  // 成功响应
  // ===================================================================

  /**
   * 响应成功 (200 OK)
   * @param c Hono 上下文
   * @param data 要返回的数据，默认为 null
   * @param msg 成功消息，默认为 '操作成功'
   */
  public static success(c: Context, data: unknown = null, msg = '操作成功') {
    return c.json(
      {
        code: 200,
        msg,
        data,
      },
      200,
    );
  }

  /**
   * 响应创建成功 (201 Created)
   * @param c Hono 上下文
   * @param data 要返回的数据
   * @param msg 成功消息, 默认为 '创建成功'
   */
  public static created(c: Context, data: unknown, msg = SuccessMessage.S002_CREATED_SUCCESS) {
    return c.json(
      {
        code: 201,
        msg,
        data,
      },
      201,
    );
  }

  /**
   * 响应无内容 (204 No Content)
   * @param c Hono 上下文
   */
  public static noContent(c: Context) {
    return c.newResponse(null, 204);
  }

  // ===================================================================
  // 失败响应
  // ===================================================================

  /**
   * 通用失败响应方法
   * @param c Hono 上下文
   * @param msg 错误消息
   * @param statusCode HTTP 状态码，默认为 400
   * @param data 额外的错误信息（可选）
   */
  public static fail(c: Context, msg = '操作失败', statusCode: StatusCode = 400, data: unknown = null) {
    return c.json(
      {
        code: statusCode,
        msg,
        data,
      },
      statusCode as ContentfulStatusCode,
    );
  }

  /**
   * 响应请求参数错误 (400 Bad Request)
   * @param c Hono 上下文
   * @param msg 错误消息，默认为 '请求参数错误'
   * @param data 额外的错误信息（可选）
   */
  public static badRequest(c: Context, msg = '请求参数错误', data: unknown = null) {
    return this.fail(c, msg, 400, data);
  }

  /**
   * 响应未授权 (401 Unauthorized)
   * @description 通常用于需要登录但未登录的场景
   * @param c Hono 上下文
   * @param msg 错误消息，默认为 '身份验证失败，请重新登录'
   */
  public static unauthorized(c: Context, msg = '身份验证失败，请重新登录') {
    return this.fail(c, msg, 401, null);
  }

  /**
   * 响应禁止访问 (403 Forbidden)
   * @description 通常用于已登录但权限不足的场景
   * @param c Hono 上下文
   * @param msg 错误消息，默认为 '权限不足，禁止访问'
   */
  public static forbidden(c: Context, msg = '权限不足，禁止访问') {
    return this.fail(c, msg, 403, null);
  }

  /**
   * 响应未找到 (404 Not Found)
   * @param c Hono 上下文
   * @param msg 错误消息，默认为 '请求的资源未找到'
   */
  public static notFound(c: Context, msg = '请求的资源未找到') {
    return this.fail(c, msg, 404, null);
  }
}
