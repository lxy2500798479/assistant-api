import type { Context } from 'hono';

import { ErrorCode, SuccessMessage } from '../constants/errorCodes.ts';
import { CustomerService } from '../service/customer.service.ts';
import { customerCreateSchema, customerSearchSchema, customerUpdateSchema } from '../types/dto/customers.ts';
import { R } from '../utils/response.ts';

const customerService = new CustomerService();

export class CustomerController {
  public async getCustomers(c: Context) {
    const robotId = c.req.query('robotId');
    const body = await c.req.json();
    const validation = customerSearchSchema.safeParse(body);
    if (!validation.success) {
      const firstErrorMessage = validation.error.issues[0]!.message;
      return R.badRequest(c, firstErrorMessage);
    }
    const customers = await customerService.getCustomers(robotId, validation.data);
    return R.success(c, customers);
  }

  public async getCustomerById(c: Context) {
    const id = c.req.param('id');
    if (!/^\d+$/.test(id)) {
      return R.badRequest(c, ErrorCode.G003_INVALID_ID_FORMAT.message);
    }
    const customer = await customerService.getCustomerById(id);
    return R.success(c, customer);
  }

  public async createCustomer(c: Context) {
    const body = await c.req.json();

    try {
      if (body.levelId) body.levelId = BigInt(body.levelId);
      if (body.referrerRobotId) body.referrerRobotId = BigInt(body.referrerRobotId);
    } catch {
      return R.badRequest(c, ErrorCode.C007_ID_MUST_BE_BIGINT.message);
    }

    const validation = customerCreateSchema.safeParse(body);
    if (!validation.success) {
      return R.badRequest(c, validation.error.issues[0]!.message);
    }

    const newCustomer = await customerService.createCustomer(validation.data);
    return R.created(c, newCustomer);
  }

  public async updateCustomer(c: Context) {
    const id = c.req.param('id');
    if (!/^\d+$/.test(id)) {
      return R.badRequest(c, ErrorCode.G003_INVALID_ID_FORMAT.message);
    }

    const body = await c.req.json();

    try {
      if (body.levelId) body.levelId = BigInt(body.levelId);
    } catch {
      return R.badRequest(c, ErrorCode.C007_ID_MUST_BE_BIGINT.message);
    }

    const validation = customerUpdateSchema.safeParse(body);
    if (!validation.success) {
      return R.badRequest(c, validation.error.issues[0]!.message);
    }

    const updatedCustomer = await customerService.updateCustomer(id, validation.data);
    return R.success(c, updatedCustomer, SuccessMessage.S003_UPDATED_SUCCESS);
  }

  public async deleteCustomer(c: Context) {
    const id = c.req.param('id');
    if (!/^\d+$/.test(id)) {
      return R.badRequest(c, ErrorCode.G003_INVALID_ID_FORMAT.message);
    }
    const result = await customerService.deleteCustomer(id);
    return R.success(c, result, SuccessMessage.S004_DELETED_SUCCESS);
  }
}
