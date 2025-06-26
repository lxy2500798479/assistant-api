import Bun from 'bun';
import Redis from 'ioredis';

const redis = new Redis(Bun.env['REDIS_URL']!);

export default redis;
