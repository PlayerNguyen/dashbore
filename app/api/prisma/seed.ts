import PermissionService from "@/services/permission/permission.service";
import getPrismaClient from "@/util/prisma.util";

const prisma = getPrismaClient();

/**
 * Create the admin role and set the permission to it.
 * This function is idempotent.
 *
 */
async function createAdminRole() {
  try {
    const permission = await prisma.permission.findUnique({ where: { id: 1 } });
    if (!permission) throw new Error("Permission not found");

    const { id: roleId } = await prisma.role.upsert({
      where: { name: "Admin" },
      update: {},
      create: { name: "Admin" },
    });

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId: permission.id,
        },
      },
      update: {},
      create: { roleId, permissionId: permission.id },
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Create the admin user
 */
async function createAdminUser() {
  // Search the admin role to get it's id
  const adminRole = await prisma.role.findUnique({ where: { name: "Admin" } });
  if (!adminRole) throw new Error("Admin role not found");

  // Create the admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "dashbore@test.com" },
    update: {},
    create: {
      name: "Dashbore Admin",
      email: "dashbore@test.com",
      password: Bun.password.hashSync("dashbore"),
    },
  });

  // Set the admin role to the user
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  console.log("Admin user created");
}

async function createUser() {
  // Don't create user in production
  if (process.env.NODE_ENV === "production") {
    console.log("Skipping user creation in production");
    return;
  }

  const user = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      password: Bun.password.hashSync("user"),
    },
  });

  console.log("User created");
  return user;
}

/**
 * Main function
 */
async function main() {
  await PermissionService.bootstrap();
  await createAdminRole();
  await createAdminUser();
  await createUser();
}

/**
 * Run the seed
 */
try {
  await main();
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
