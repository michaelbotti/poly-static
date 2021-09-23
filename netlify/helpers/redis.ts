import Redis from 'ioredis';

let redisClient: Redis.Redis;
export const getRedis = (): Redis.Redis => {
    if (!redisClient) {
        redisClient = new Redis({
            host: process.env.REDIS_URI,
            port: parseInt(process.env.REDIS_PORT as string),
            password: process.env.REDIS_PASSWORD,
        });
    }

    return redisClient;
}