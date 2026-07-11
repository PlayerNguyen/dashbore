import { getPrismaClient } from "@dashbore/database";
import type { Permission } from "@dashbore/database";

class PermissionManager {
  private permissions: Map<string, Permission> = new Map();
  private prisma = getPrismaClient();

  registerPermission(permission: Permission) {
    this.permissions.set(permission.name, permission);
  }

  has(name: string): boolean {
    return this.permissions.has(name);
  }

  get(name: string): Permission | undefined {
    return this.permissions.get(name);
  }

  load(permissions: Permission[]) {
    for (const p of permissions) {
      this.permissions.set(p.name, p);
    }
  }

  all(): Permission[] {
    return Array.from(this.permissions.values());
  }

  async upsertPermission(permission: Permission) {
    const _permission = await this.prisma.permission.upsert({
      where: { name: permission.name },
      update: permission,
      create: permission,
    });

    return _permission;
  }
}

let permissionManager: PermissionManager | undefined;

export function getPermissionManager() {
  if (!permissionManager) {
    permissionManager = new PermissionManager();
  }

  return permissionManager;
}
