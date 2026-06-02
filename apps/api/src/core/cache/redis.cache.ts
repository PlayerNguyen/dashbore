import RedisFactory from "@/factory/redis.factory";
import type { RedisClient } from "bun";

let defaultRedisClient: RedisClient | undefined;
/**
 * Default TTL should be 30 seconds
 */
const DEFAULT_TTL = process.env.REDIS_DEFAULT_TTL || 30 * 1000;

/**
 * A single object of redis application.
 *
 * @returns the redis client for application
 */
function getRedisClient() {
  return RedisFactory.createRedisClient({ idleTimeout: 3000 });
}

/**
 * Builds a cache key by combining the base key and query parameters.
 *
 * @param {string} base The base key for the cache key, typically a namespace.
 * @param {Record<string, any>} params The query parameters to include in the cache key.
 *
 * @returns {string} The constructed cache key.
 *
 * @example
 * ```
 * const baseKey = "user";
 * const params = { id: 1, name: "John Doe", age: 30 };
 * const cacheKey = buildCacheKey(baseKey, params);
 * console.log(cacheKey); // Output: "user:id=1&name=John+Doe&age=30"
 * ```
 */
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

/**
 * Retrieves or sets a cache item in Redis.
 *
 * @param params - An object containing the base URL and parameters for the cache key.
 * @param value - The data to be stored in the cache item.
 * @param ttl - The time-to-live (in seconds) for the cache item. Defaults to 1000.
 *
 * @returns The cached value.
 */
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

  // Match all keys starting with `${base}:`
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
