import CorePermissionKey from "@/core/permission/core.permission";
import getPrismaClient from "@/util/prisma.util";
import type {
  Permission,
  Prisma,
  Role,
  RolePermission,
  User,
  UserRole,
} from "@generated/prisma";
import { HTTPException } from "hono/http-exception";

/**
 * The user with roles and permissions when
 * fetching using Prisma.
 */
export type UserWithRoles = User & {
  roles: (UserRole & {
    role: Role & {
      permissions: (RolePermission & { permission: Permission })[];
    };
  })[];
};

/**
 * The normalized user with permissions and roles.
 */
export type NormalizedUser = User & {
  permissions: string[];
  roles: string[];
};

/**
 * Normalize the user with roles and permissions.
 *
 * @param user - The user with roles and permissions
 * @returns The normalized user
 */
async function normalizeUser(user: UserWithRoles): Promise<NormalizedUser> {
  const userRoles = user.roles;
  // Flatten the roles with roleName to the set
  const userRolesSet = userRoles.map((role) => role.role.name);

  // Flatten the permissions
  const userPermissions = userRoles.flatMap((role) =>
    role.role.permissions.map((permission) => permission.permission.name)
  );

  return {
    ...user,
    permissions: userPermissions,
    roles: userRolesSet,
  };
}

/**
 * User service
 */
const UserService = {
  /**
   * Get the user by id.
   *
   * @param id - The id of the user
   * @param omit - The fields to omit from the user object
   * @returns The user object
   */
  getUserById: async (id: number, omit?: Prisma.UserSelect) => {
    const user = await getPrismaClient().user.findUnique({
      where: {
        id,
      },
      omit: omit,
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new HTTPException(404, {
        message: `User with id ${id} not found.`,
      });
    }

    return await normalizeUser(user);
  },

  /**
   * Check if the user has the permissions.
   *
   * @param user - The user object to check permissions for
   * @param permissions - The permissions to check as an array of strings
   * @returns True if the user has the permissions or if the user has all permissions, false otherwise
   */
  checkUserPermissions: async (user: NormalizedUser, permissions: string[]) => {
    // Turn normalized permissions into a set
    const userPermissionsSet = new Set(user.permissions);

    if (userPermissionsSet.has(CorePermissionKey.ALL)) {
      return true;
    }

    // Match to all other permissions
    const hasPermission = permissions.some((permission) =>
      userPermissionsSet.has(permission)
    );

    return hasPermission;
  },
};
export default UserService;
