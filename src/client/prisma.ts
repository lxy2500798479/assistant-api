import { Prisma, PrismaClient } from '@prisma/client';
import Bun from 'bun';

const log: Prisma.LogLevel[] = Bun.env.NODE_ENV === 'local' ? ['query', 'info', 'warn', 'error'] : ['error'];

const prisma = new PrismaClient({ log, errorFormat: Bun.env.NODE_ENV === 'local' ? 'pretty' : 'colorless' });

if (Bun.env.NODE_ENV === 'local') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  prisma.$on('query', (e: Prisma.QueryEvent) => {
    // console.log('Query: ' + e.query);
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

export type { Prisma };
export default prisma;
