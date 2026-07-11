import { RedisClient } from "bun";
import semver from "semver";

const REDIS_URL = process.env.REDIS_URL || "";

const createRedisClient = (options?: Bun.RedisOptions) => {
  if (semver.satisfies(Bun.version, "<1.2.9")) {
    throw new Error(
      "Bun version is lower than 1.2.9, please upgrade Bun to use Redis"
    );
  }

  return new RedisClient(REDIS_URL, options);
};

export const RedisFactory = {
  createRedisClient,
};
