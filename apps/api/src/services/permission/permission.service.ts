import { CorePermissions } from "@/core/permission/core.permission";
import { getPermissionManager } from "@/core/permission/manager.permission";
import getPrismaClient from "@/util/prisma.util";

/**
 * Load all core permissions into the database.
 */
async function loadCorePermissions() {
  console.log(`[Permission] Loading core permissions...`);
  for (const permission of CorePermissions) {
    await getPermissionManager().upsertPermission(permission);
  }
  console.log(`[Permission] Core permissions loaded.`);
}

/**
 * Load all permissions from the database into memory.
 */
async function loadPermissionsOnStartup() {
  console.log(`[Permission] Loading permissions from the database...`);
  const prisma = getPrismaClient();
  const permissions = await prisma.permission.findMany();
  getPermissionManager().load(permissions);

  console.log(
    `[Permission] Loaded ${
      getPermissionManager().all().length
    } permissions into memory.`
  );
  console.info(
    `[Permission] All permissions: ${getPermissionManager()
      .all()
      .map((permission) => permission.name)
      .join(", ")}`
  );
}

/**
 * Bootstrap the permission service.
 */
async function bootstrap() {
  await loadCorePermissions();
  await loadPermissionsOnStartup();
}

const PermissionService = {
  bootstrap,
};

export default PermissionService;
