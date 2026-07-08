import { CorePermissionKey } from "../../core/permission/core.permission";
import { getPrismaClient } from "@dashbore/database";
import type {
  Permission,
  Prisma,
  Role,
  RolePermission,
  User,
  UserRole,
} from "@dashbore/database";

export type UserWithRoles = User & {
  roles: (UserRole & {
    role: Role & {
      permissions: (RolePermission & { permission: Permission })[];
    };
  })[];
};

export type NormalizedUser = User & { 
  permissions: string[];
  roles: string[];
};

export const UserService = {
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

    return await user;
  },

  checkUserPermissions: async (user: NormalizedUser, permissions: string[]) => {
    const userPermissionsSet = new Set(user.permissions);

    if (userPermissionsSet.has(CorePermissionKey.ALL)) {
      return true;
    }

    const hasPermission = permissions.some((permission) =>
      userPermissionsSet.has(permission)
    );

    return hasPermission;
  },
};
