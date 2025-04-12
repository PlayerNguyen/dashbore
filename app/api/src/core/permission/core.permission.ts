import type { Permission } from "@generated/prisma";

/**
 * Core permission keys that are used in the application
 */
enum CorePermissionKey {
  ALL = "*",
  USERS_READ = "users:read",
  USERS_WRITE = "users:write",
  USERS_DELETE = "users:delete",
}

/**
 * Core permission properties that are used in the application
 */
const CorePermissionProperties: Record<CorePermissionKey, Permission> = {
  [CorePermissionKey.ALL]: {
    id: 1,
    name: CorePermissionKey.ALL,
    description: "All permissions",
  },
  [CorePermissionKey.USERS_READ]: {
    id: 2,
    name: CorePermissionKey.USERS_READ,
    description: "Read users",
  },
  [CorePermissionKey.USERS_WRITE]: {
    id: 3,
    name: CorePermissionKey.USERS_WRITE,
    description: "Write users",
  },
  [CorePermissionKey.USERS_DELETE]: {
    id: 4,
    name: CorePermissionKey.USERS_DELETE,
    description: "Delete users",
  },
};

export default CorePermissionKey;

export const CorePermissions = Object.values(CorePermissionProperties);
