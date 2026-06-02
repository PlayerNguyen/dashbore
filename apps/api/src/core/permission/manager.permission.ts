import getPrismaClient from "@/util/prisma.util";
import type { Permission } from "@generated/prisma/index";

class PermissionManager {
  private permissions: Map<string, Permission> = new Map();
  private prisma = getPrismaClient();
  /**
   * Register a new permission
   * @param permission - The permission to register
   */
  registerPermission(permission: Permission) {
    this.permissions.set(permission.name, permission);
  }

  /**
   * Check if a permission exists by name
   */
  has(name: string): boolean {
    return this.permissions.has(name);
  }

  /**
   * Get the permission object by name
   */
  get(name: string): Permission | undefined {
    return this.permissions.get(name);
  }

  /**
   * Bulk load permissions (e.g., from DB at startup)
   */
  load(permissions: Permission[]) {
    for (const p of permissions) {
      this.permissions.set(p.name, p);
    }
  }

  /**
   * Get all registered permissions
   */
  all(): Permission[] {
    return Array.from(this.permissions.values());
  }

  /**
   * Process upsert permission to the database
   */
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
