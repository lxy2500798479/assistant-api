import type { Prisma } from '@prisma/client'; // [FIXED] Import Prisma types

import prisma from '../client/prisma.ts';
import { ErrorCode } from '../constants/errorCodes.ts';
import { AppError } from '../errors/custom.error.ts';

import type { CustomerCreateDto, CustomerSearchDto, CustomerUpdateDto } from '@/types/dto/customers.ts';

export class CustomerService {
  public async getCustomers(robotId?: string, params: CustomerSearchDto = {}) {
    // 1. 从前端参数中解析出所有可能的查询条件和分页信息
    const { current = 1, pageSize = 10, nickname, phoneNumber, levelId } = params;
    console.log('params', params);

    // 2. 动态构建 Prisma 的查询条件 (where clause)
    const where = {
      // 基础条件：robotId (如果提供了)
      ...(robotId && { referrerRobotId: BigInt(robotId) }),

      // 动态查询条件：
      // 按昵称模糊查询
      ...(nickname && { nickname: { contains: nickname } }),
      // 按电话号码模糊查询
      ...(phoneNumber && { phoneNumber: { contains: phoneNumber } }),
      // 按会员等级ID精确查询
      ...(levelId && { levelId: Number(levelId) }),
    };

    // 3. 计算分页参数
    const skip = (current - 1) * pageSize;
    const take = pageSize;

    // 4. 使用 Prisma 事务，同时查询总数和分页后的数据列表
    const [total, data] = await prisma.$transaction([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        include: {
          level: true,
          referrer: { select: { id: true, nickname: true } },
        },
        orderBy: { registrationDate: 'desc' },
        skip,
        take,
      }),
    ]);

    // 5. 返回 ProTable 期望的格式
    return {
      list: data,
      total,
    };
  }

  public async getCustomerById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        level: true,
        referrer: { select: { id: true, nickname: true } },
      },
    });
    if (!customer) {
      throw new AppError(ErrorCode.C001_CUSTOMER_NOT_FOUND);
    }
    return customer;
  }

  public async createCustomer(createDto: CustomerCreateDto) {
    const { levelId, referrerRobotId, ...restOfDto } = createDto;

    const levelExists = await prisma.customerLevel.findUnique({ where: { id: levelId } });
    if (!levelExists) {
      throw new AppError(ErrorCode.C002_LEVEL_NOT_FOUND);
    }

    if (referrerRobotId) {
      const robotExists = await prisma.robot.findUnique({ where: { id: referrerRobotId } });
      if (!robotExists) {
        throw new AppError(ErrorCode.C003_ROBOT_NOT_FOUND);
      }
    }

    const dataForPrisma: Prisma.CustomerCreateInput = {
      ...restOfDto,
      level: {
        connect: { id: levelId },
      },
      ...(referrerRobotId && {
        referrer: {
          connect: { id: referrerRobotId },
        },
      }),
    };

    return prisma.customer.create({ data: dataForPrisma });
  }

  public async updateCustomer(id: string, updateDto: CustomerUpdateDto) {
    await this.getCustomerById(id);
    const { levelId, ...restOfDto } = updateDto;

    const dataForPrisma: Prisma.CustomerUpdateInput = { ...restOfDto };

    if (levelId) {
      const levelExists = await prisma.customerLevel.findUnique({ where: { id: levelId } });
      if (!levelExists) {
        throw new AppError(ErrorCode.C002_LEVEL_NOT_FOUND);
      }
      dataForPrisma.level = {
        connect: { id: levelId },
      };
    }

    return prisma.customer.update({
      where: { id },
      data: dataForPrisma,
      include: { level: true },
    });
  }

  public async deleteCustomer(id: string): Promise<{ id: string }> {
    await this.getCustomerById(id);
    await prisma.customer.delete({ where: { id } });
    return { id };
  }
}
