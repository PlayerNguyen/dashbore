import type {
  NormalizedUser,
  UserWithRoles,
} from "../services/user/user.service";

async function normalizeUser(user: UserWithRoles): Promise<NormalizedUser> {
  const userRoles = user.roles;
  const userRolesSet = userRoles.map((role) => role.role.name);

  const userPermissions = userRoles.flatMap((role) =>
    role.role.permissions.map((permission) => permission.permission.name)
  );

  return {
    ...user,
    permissions: userPermissions,
    roles: userRolesSet,
  };
}

export const UserUtil = {
  normalizeUser,
};
