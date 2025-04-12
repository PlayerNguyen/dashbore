import TokenService from "@/services/token/token.service";
import type { User } from "@generated/prisma";
import { describe, expect, it } from "bun:test";

describe("TokenService", () => {
  it("should generate a token", async () => {
    // Arrange
    const user: User = {
      id: 1,
      email: "test@test.com",
      name: "Test User",
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Act
    const token = await TokenService.generateToken(user);

    // Assert
    expect(token).toBeDefined();
    expect(token).toBeString();
    expect(token.length).toBeGreaterThan(0);
  });

  it("should verify a token", async () => {
    // Arrange
    const user: User = {
      id: 1,
      email: "test@test.com",
      name: "Test User",
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const token = await TokenService.generateToken(user);

    // Act
    const payload = await TokenService.verifyToken(token);

    // Assert
    expect(payload).toBeDefined();
    expect(payload).toHaveProperty("iat");
    expect(payload).toHaveProperty("exp");
    expect(payload).toHaveProperty("email");
    expect(payload).toHaveProperty("id");
    expect(payload.email).toBe(user.email);
    expect(payload.id).toBe(user.id);
    expect(payload.iat).toBeDefined();
    expect(payload.exp).toBeDefined();
  });
});
