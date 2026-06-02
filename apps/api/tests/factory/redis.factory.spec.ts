import RedisFactory from "@/factory/redis.factory";
import { describe, expect, test } from "bun:test";

describe("Redis Factory", () => {
  test("should create a Redis client", async () => {
    const redisClient = RedisFactory.createRedisClient();
    expect(redisClient).toBeDefined();
  });
});
