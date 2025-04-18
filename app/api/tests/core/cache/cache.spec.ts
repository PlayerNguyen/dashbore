import RedisCache from "@/core/cache/redis.cache";
import { afterEach, describe, expect, test } from "bun:test";

describe("Redis Cache", () => {
  afterEach(async () => {
    await RedisCache.getRedisClient().del("user");
  });
  test("should get or set cache item", async () => {
    // Arrange
    const base = "user";
    const params = { id: 1, name: "John Doe", age: 30 };
    const cacheItem = { base, params, value: "Hello World" };
    const userData = [
      { id: 1, name: "John Doe", age: 30 },
      { id: 2, name: "Jane Doe", age: 25 },
    ];
    // Act
    await RedisCache.getOrSetCacheItem(cacheItem, userData);

    // Assert
    const hasItem = await RedisCache.hasCacheItem(cacheItem);
    expect(hasItem).toBe(true);
  });

  test("should invalidate cache item", async () => {
    const base = "user";
    const params = { id: 1, name: "John Doe", age: 30 };
    const cacheItem = { base, params, value: "Hello World" };
    const userData = [
      { id: 1, name: "John Doe", age: 30 },
      { id: 2, name: "Jane Doe", age: 25 },
    ];

    await RedisCache.getOrSetCacheItem(cacheItem, userData);

    // Corrected: Pass same base + params
    const removed = await RedisCache.invalidateCache(base, params);
    console.log(`${removed} entries removed`);

    const hasItem = await RedisCache.hasCacheItem(cacheItem);
    expect(hasItem).toBe(false);
  });

  test("should get a cache item that already set", async () => {
    // Arrange
    const base = "user";
    const params = { id: 1, name: "John Doe", age: 30 };
    const cacheItem = { base, params, value: "Hello World" };
    const userData = [
      { id: 1, name: "John Doe", age: 30 },
      { id: 2, name: "Jane Doe", age: 25 },
    ];
    // Act
    await RedisCache.getOrSetCacheItem(cacheItem, userData);
    const cachedData = await RedisCache.getOrSetCacheItem(cacheItem, userData);

    // Assertion
    expect(cachedData).toBeArrayOfSize(2);
  });
});
