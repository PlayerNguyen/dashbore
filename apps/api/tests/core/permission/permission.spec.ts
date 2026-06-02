import { CorePermissions } from "@/core/permission/core.permission";
import { getPermissionManager } from "@/core/permission/manager.permission";
import getPrismaClient from "@/util/prisma.util";
import { describe, expect, it } from "bun:test";

describe("Permission", () => {
  it("should be able to load core permissions", async () => {
    // Arrange
    const prisma = getPrismaClient();
    const permissions = await prisma.permission.findMany();

    // Act
    const corePermissions = CorePermissions.map(
      (permission) => permission.name
    );

    // Assert
    expect(permissions).toHaveLength(corePermissions.length);
  });
});

describe("Permission Manager", () => {
  it("should all permissions be loaded into the memory when the application starts", async () => {
    // Arrange
    const pm = getPermissionManager();

    // Assert
    expect(pm.all()).toHaveLength(CorePermissions.length);
  });

  it("should be able to register a new permission", async () => {
    // Arrange
    const pm = getPermissionManager();

    // Act
    pm.registerPermission({
      id: 1,
      name: "test",
      description: "test",
    });

    // Assert
    expect(pm.all()).toHaveLength(CorePermissions.length + 1);
  });

  it("should be able to check if a permission exists", async () => {
    // Arrange
    const pm = getPermissionManager();

    // Act
    const exists = pm.has("test");

    // Assert
    expect(exists).toBe(true);
  });

  it("should be able to get a permission by name", async () => {
    // Arrange
    const pm = getPermissionManager();

    // Act
    const permission = pm.get("test");

    // Assert
    expect(permission).toBeDefined();
  });
});
