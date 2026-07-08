import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client.ts";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const CORE_PERMISSIONS = [
  { id: 1, name: "*", description: "All permissions" },
  { id: 2, name: "users:read", description: "Read users" },
  { id: 3, name: "users:write", description: "Write users" },
  { id: 4, name: "users:delete", description: "Delete users" },
];

async function loadCorePermissions() {
  for (const permission of CORE_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: permission,
      create: permission,
    });
  }
  console.log("[Seed] Core permissions loaded.");
}

async function createAdminRole() {
  const permission = await prisma.permission.findUnique({ where: { id: 1 } });
  if (!permission) throw new Error("Permission not found");

  const { id: roleId } = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin" },
  });

  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId, permissionId: permission.id } },
    update: {},
    create: { roleId, permissionId: permission.id },
  });

  console.log("[Seed] Admin role created.");
}

async function createAdminUser() {
  const adminRole = await prisma.role.findUnique({ where: { name: "Admin" } });
  if (!adminRole) throw new Error("Admin role not found");

  const adminUser = await prisma.user.upsert({
    where: { email: "dashbore@test.com" },
    update: {},
    create: {
      name: "Dashbore Admin",
      email: "dashbore@test.com",
      password: Bun.password.hashSync("dashbore"),
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  console.log("[Seed] Admin user created.");
}

async function createUser() {
  if (process.env.NODE_ENV === "production") {
    console.log("[Seed] Skipping user creation in production");
    return;
  }

  await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      password: Bun.password.hashSync("user"),
    },
  });

  console.log("[Seed] User created.");
}

async function main() {
  await loadCorePermissions();
  await createAdminRole();
  await createAdminUser();
  await createUser();
}

try {
  await main();
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
