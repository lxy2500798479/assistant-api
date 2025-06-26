export interface ErrorCodeType {
  code: string;
  message: string;
  status: number;
}

export const ErrorCode = {
  // --- 通用错误 G: General ---
  G001_UNEXPECTED_ERROR: { code: 'G001', message: '系统发生意外错误', status: 500 },
  G002_VALIDATION_ERROR: { code: 'G002', message: '参数验证失败', status: 400 },
  G003_INVALID_ID_FORMAT: { code: 'G003', message: '无效的ID格式', status: 400 },

  // --- 认证/用户相关错误 A: Auth/User ---
  A001_USERNAME_REQUIRED: { code: 'A001', message: '用户名不能为空', status: 400 },
  A002_PASSWORD_REQUIRED: { code: 'A002', message: '密码不能为空', status: 400 },
  A003_INVALID_CREDENTIALS: { code: 'A003', message: '用户名或密码错误', status: 401 },
  A004_USER_NOT_FOUND: { code: 'A004', message: '用户不存在', status: 404 },
  A003_NICKNAME_REQUIRED: { code: 'A003', message: '昵称不能为空', status: 400 },
  A004_WXID_REQUIRED: { code: 'A004', message: '微信ID不能为空', status: 400 },
  A005_AVATAR_REQUIRED: { code: 'A005', message: '头像不能为空', status: 400 },

  // --- 客户模块错误 C: Customer ---
  C001_CUSTOMER_NOT_FOUND: { code: 'C001', message: '客户不存在', status: 404 },
  C002_LEVEL_NOT_FOUND: { code: 'C002', message: '指定的客户等级不存在', status: 400 },
  C003_ROBOT_NOT_FOUND: { code: 'C003', message: '指定的推荐机器人不存在', status: 400 },
  C004_WXID_REQUIRED: { code: 'C004', message: '客户微信ID不能为空', status: 400 },
  C005_NICKNAME_REQUIRED: { code: 'C005', message: '客户昵称不能为空', status: 400 },
  C006_LEVEL_ID_REQUIRED: { code: 'C006', message: '客户等级ID不能为空', status: 400 },
  C007_ID_MUST_BE_BIGINT: { code: 'C007', message: 'ID必须是有效的数字ID', status: 400 },
} as const;

export const SuccessMessage = {
  // --- 通用成功提示 S: Success ---
  S001_OPERATION_SUCCESS: '操作成功',
  S002_CREATED_SUCCESS: '创建成功',
  S003_UPDATED_SUCCESS: '更新成功',
  S004_DELETED_SUCCESS: '删除成功',
} as const;
