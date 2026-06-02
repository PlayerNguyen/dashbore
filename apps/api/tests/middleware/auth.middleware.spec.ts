import appFactory from "@/factory/app.factory";
import AuthMiddleware from "@/middleware/auth.middleware";
import AuthService from "@/services/auth/auth.service";
import { describe, expect, it } from "bun:test";

describe("AuthMiddleware", () => {
  describe("useStrictAuth", () => {
    it("should return a 401 error if the token is invalid", async () => {
      // Arrange
      const app = appFactory
        .createApp()
        .get("/user", AuthMiddleware.useStrictAuth(["user:read"]), (c) => {
          return c.json({ message: "Hello, world!" });
        });

      // Act
      const response = await app.request("/user", {
        headers: {
          Authorization: "Bearer invalid",
        },
      });

      // Assert
      expect(response.status).toBe(401);
    });

    it("should return a 401 error if user has no permission to access the resource", async () => {
      // Arrange
      const token = await AuthService.login("user@test.com", "user");

      console.log({ token });
      const app = appFactory
        .createApp()
        .get("/user", AuthMiddleware.useStrictAuth(["user:read"]), (c) => {
          return c.json({ message: "Hello, world!" });
        });

      // Act
      const response = await app.request("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      expect(response.status).toBe(401);
    });
  });
  describe("useLightAuth", () => {
    it("should return a 401 error if the token is invalid", async () => {
      // Arrange
      const app = appFactory
        .createApp()
        .get("/user", AuthMiddleware.useLightAuth(), (c) => {
          return c.json({ message: "Hello, world!" });
        });

      // Act
      const response = await app.request("/user", {
        headers: {
          Authorization: "Bearer invalid",
        },
      });

      // Assert
      expect(response.status).toBe(401);
    });
  });
});
