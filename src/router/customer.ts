import { Hono } from 'hono';

import { checkToken } from '../middlewares/token.ts'; // 导入Token中间件

import { CustomerController } from '@/controller/customers.controller.ts'; // 建议使用相对路径

const router = new Hono();
const customerController = new CustomerController();

// 对所有 /customers 路径下的接口启用 Token 验证
router.use('*', checkToken);

// 1. 获取所有客户列表
router.post('/', customerController.getCustomers);

// 2. 创建新客户
router.post('/', customerController.createCustomer);

// 3. 获取单个客户
router.get('/:id', customerController.getCustomerById);

// 4. 更新客户信息
router.put('/:id', customerController.updateCustomer);

// 5. 删除客户
router.delete('/:id', customerController.deleteCustomer);

export default router;
