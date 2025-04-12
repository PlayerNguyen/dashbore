import PermissionService from "@/services/permission/permission.service";
import { beforeAll } from "bun:test";
import { gray, green } from "colorette";

async function migrateTestPrisma() {
  console.log(`Migrating test prisma...`);
  // Generate a prisma dev client.
  let { stdout } = Bun.spawnSync(["bunx", "prisma", "generate"], {
    env: { NODE_ENV: "test" },
  });

  console.log(gray(stdout.toString()));

  // Deploy migrations
  console.log(`Deploying migrations...`);
  let { stdout: deployStdout } = Bun.spawnSync(
    ["bunx", "prisma", "migrate", "deploy"],
    {
      env: { NODE_ENV: "test", DATABASE_URL: process.env.DATABASE_URL },
    }
  );

  console.log(gray(deployStdout.toString()));

  // Seed the database
  console.log(`Seeding the database...`);
  let { stdout: seedStdout } = Bun.spawnSync(["bunx", "prisma", "db", "seed"], {
    env: { NODE_ENV: "test", DATABASE_URL: process.env.DATABASE_URL },
  });

  console.log(gray(seedStdout.toString()));
}

beforeAll(async () => {
  console.log(
    green(
      `Testing on ${process.arch} node environment: ${process.env.NODE_ENV}`
    )
  );

  await migrateTestPrisma();
  await PermissionService.bootstrap();
});
