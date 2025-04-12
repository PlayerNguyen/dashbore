import type { User } from "@generated/prisma/index";

export type AppEnvironment = {
  Variables: {
    user: UserAuthPayload | undefined;
  };
};

/**
 * The user light auth payload.
 */
export type UserLightAuthPayload = {
  id: number;
  email: string;
};

/**
 * The user auth payload.
 */
export type UserAuthPayload = UserLightAuthPayload | User;
