import { RedisClient } from "bun";
import semver from "semver";

const REDIS_URL = process.env.REDIS_URL || "";
/**
 * Create a new instance of redis. Please consider not to create too many redis client.
 * If bun version is lower than 1.2.9, it will throw an error.
 * Bun version is higher than 1.2.9, it will return a new redis client.
 *
 * @returns a new redis client
 */
const createRedisClient = (options?: Bun.RedisOptions) => {
  if (semver.satisfies(Bun.version, "<1.2.9")) {
    throw new Error(
      "Bun version is lower than 1.2.9, please upgrade Bun to use Redis"
    );
  }

  return new RedisClient(REDIS_URL, options);
};

/**
 * The main redis factory.
 */
const RedisFactory = {
  createRedisClient,
};

export default RedisFactory;
