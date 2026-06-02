import RedisFactory from "../../factory/redis.factory";
import type { RedisClient } from "bun";

let defaultRedisClient: RedisClient | undefined;

const DEFAULT_TTL = process.env.REDIS_DEFAULT_TTL || 30 * 1000;

function getRedisClient() {
  return RedisFactory.createRedisClient({ idleTimeout: 3000 });
}

function buildCacheKey(base: string, params: Record<string, any>): string {
  const query = Object.entries(params)
    .sort()
    .map(([key, value]) => `${key}=${value}`)
    .join(":");
  const cacheKey = `${base}:${query}`;
  console.info(`[Cache::QueryName] ${cacheKey}`);
  return cacheKey;
}

export type CacheItem = {
  base: string;
  params: Record<string, any>;
};

async function getOrSetCacheItem<T>(params: CacheItem, value: T, ttl?: number) {
  const cacheKey = buildCacheKey(params.base, params.params);

  console.info(`[Cache] GET ${cacheKey}`);
  const currentCacheValue = await getRedisClient().get(cacheKey);
  if (currentCacheValue) {
    console.info(`[Cache] Available ${cacheKey}`);
    return JSON.parse(currentCacheValue) as T;
  }

  console.info(`[Cache] SET ${cacheKey}`);
  await getRedisClient().set(cacheKey, JSON.stringify(value));
  await getRedisClient().expire(cacheKey, ttl || Number(DEFAULT_TTL));
  return value;
}

async function hasCacheItem(item: CacheItem) {
  const cacheKey = buildCacheKey(item.base, item.params);
  return await getRedisClient().exists(cacheKey);
}

async function invalidateCache(base: string, params?: Record<string, any>) {
  const client = getRedisClient();

  if (params) {
    const key = buildCacheKey(base, params);
    return await client.del(key);
  }

  const pattern = `${base}:*`;
  const keys = await client.keys(pattern);
  if (keys.length === 0) return 0;
  // @ts-ignore
  return await client.del(...keys);
}

const RedisCache = {
  getOrSetCacheItem,
  hasCacheItem,
  invalidateCache,
  getRedisClient,
};

export default RedisCache;
