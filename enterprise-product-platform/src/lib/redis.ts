import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true
});

/**
 * 分布式滑动窗口 API 限流器 (防止恶意刷单与询价接口滥用)
 */
export async function checkRateLimit(ip: string, limit = 30, windowSeconds = 60): Promise<boolean> {
  const key = `ratelimit:${ip}`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  return current <= limit;
}
