import Redis, { RedisOptions } from 'ioredis';

export function createRedisInstance() {
  try {
    const url = new URL(process.env.REDIS_URL || 'redis://localhost:6379')

    const options: RedisOptions = {
      host: url.hostname,
      port: Number(url.port),
      db: Number(url.pathname?.substr(1)) || 0,
      password: url.password,
      lazyConnect: true,
      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 0,
      retryStrategy: (times: number) => {
        if (times > 3) {
          throw new Error(`[Redis] Could not connect after ${times} attempts`);
        }

        return Math.min(times * 200, 1000);
      },
    };

    const redis = new Redis(options);

    redis.on('error', (error: unknown) => {
      console.warn('[Redis] Error connecting', error);
    });

    return redis;
  } catch (e) {
    throw new Error(`[Redis] Could not create a Redis instance`);
  }
}