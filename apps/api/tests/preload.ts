import PermissionService from "@/services/permission/permission.service";
import { beforeAll } from "bun:test";
import { green } from "colorette";
import TestAuthUtil from "./util/testAuth";

beforeAll(async () => {
  console.log(
    green(
      `Testing on ${process.arch} node environment: ${process.env.NODE_ENV}`
    )
  );

  // await migrateTestPrisma();
  await PermissionService.bootstrap();
  await TestAuthUtil.login();
});
