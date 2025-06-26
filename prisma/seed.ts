import { ChatType, MessageType, PrismaClient, RobotStatus } from '@prisma/client';
import Bun from 'bun';

// 初始化 Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('开始填充种子数据...');

  // 1. 清理旧数据（注意顺序，防止外键约束失败）
  console.log('开始清理旧数据...');
  await prisma.chatRecord.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.robot.deleteMany();
  await prisma.customerLevel.deleteMany();
  console.log('旧数据已清理完毕。');

  // 2. 创建客户等级 (CustomerLevel)
  console.log('正在创建客户等级...');
  const levelBronze = await prisma.customerLevel.create({
    data: { levelName: '青铜会员', sortOrder: 10, description: '基础等级' },
  });
  const levelSilver = await prisma.customerLevel.create({
    data: { levelName: '白银会员', sortOrder: 20, description: '消费满1000元升级' },
  });
  const levelGold = await prisma.customerLevel.create({
    data: { levelName: '黄金会员', sortOrder: 30, description: '消费满5000元升级' },
  });
  const levelBlack = await prisma.customerLevel.create({
    data: { levelName: '黑卡会员', sortOrder: 40, description: '尊享顶级权益' },
  });
  const allLevels = [levelBronze, levelSilver, levelGold, levelBlack];
  console.log('客户等级已创建。');

  // 3. 创建机器人 (Robot)
  console.log('正在创建机器人账号...');
  const robot1 = await prisma.robot.create({
    data: {
      username: 'robot-assistant-01',
      password: await Bun.password.hash('Password_01!'),
      wxid: 'wxid_robot_01',
      nickname: '智能小助',
      avatar: 'https://placehold.co/100x100/A3E635/000000?text=R1',
      status: RobotStatus.ACTIVE,
    },
  });
  const robot2 = await prisma.robot.create({
    data: {
      username: 'robot-support-02',
      password: await Bun.password.hash('Password_02!'),
      wxid: 'wxid_robot_02',
      nickname: '客户关怀',
      avatar: 'https://placehold.co/100x100/FACC15/000000?text=R2',
      status: RobotStatus.INACTIVE,
    },
  });
  const allRobots = [robot1, robot2];
  console.log('机器人账号已创建。');

  // 4. 使用 for 循环批量创建客户 (Customer)
  console.log('正在批量生成客户数据...');
  const customersToCreate = [];
  const surnames = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈'];
  const givenNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

  for (let i = 1; i <= 50; i++) {
    // 随机选择一个等级
    const randomLevel = allLevels[i % allLevels.length];
    // 为每位客户轮流分配一个推荐机器人
    const randomRobot = allRobots[i % allRobots.length];

    const customerData = {
      wxid: `wxid_customer_mock_${i}`,
      nickname: `${surnames[i % surnames.length]}${givenNames[i % givenNames.length]}`,
      phoneNumber: `139${String(i).padStart(8, '0')}`,
      levelId: randomLevel!.id,
      referrerRobotId: randomRobot?.id, // 确保每个客户都有一个机器人ID
    };
    customersToCreate.push(customerData);
  }

  // 使用 createMany 批量插入
  await prisma.customer.createMany({
    data: customersToCreate,
  });
  console.log(`${customersToCreate.length} 位客户信息已创建。`);

  // (可选) 为部分新创建的客户生成聊天记录
  console.log('正在为部分客户生成聊天记录...');
  const createdCustomers = await prisma.customer.findMany(); // 获取所有刚刚创建的客户

  for (const customer of createdCustomers.slice(0, 5)) {
    // 只为前5个客户生成记录
    const privateChatId = `private:${robot1.id}:${customer.id}`;
    await prisma.chatRecord.createMany({
      data: [
        {
          chatId: privateChatId,
          chatType: ChatType.PRIVATE,
          type: MessageType.TEXT,
          content: `您好, ${customer.nickname}! 我是您的专属助理。`,
          senderRobotId: robot1.id,
        },
        {
          chatId: privateChatId,
          chatType: ChatType.PRIVATE,
          type: MessageType.TEXT,
          content: '好的，谢谢你！',
          senderCustomerId: customer.id,
        },
      ],
    });
  }
  console.log('聊天记录已创建。');

  console.log('种子数据填充成功！');
}

// 执行主函数，并确保在完成后断开Prisma Client的连接
main()
  .catch((e) => {
    console.error('填充种子数据时发生错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
