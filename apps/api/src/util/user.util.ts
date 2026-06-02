import type {
  NormalizedUser,
  UserWithRoles,
} from "@/services/user/user.service";

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

const UserUtil = {
  normalizeUser,
};

export default UserUtil;
