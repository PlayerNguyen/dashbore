import app from "@/app";
import TokenService from "@/services/token/token.service";
import type { User } from "@generated/prisma/index";
import { beforeEach, describe, expect, it } from "bun:test";
import { testClient } from "hono/testing";

describe("Auth Route", () => {
  const client = testClient(app);

  /**
   * GET /whoami
   */
  describe("GET /whoami", () => {
    let token: string;
    beforeEach(async () => {
      // Arrange
      const userLoginData = {
        email: "dashbore@test.com",
        password: "dashbore",
      };

      const response = await client.auth.login.$post({
        json: userLoginData,
      });

      token = (await response.json()).data.token;
    });

    it("should return 200 when user is authenticated", async () => {
      // Arrange
      const headers = {
        authorization: `Bearer ${token}`,
      };

      // Act
      const response = await app.fetch(
        new Request("http://localhost:3000/auth/whoami", {
          headers,
        })
      );

      // Assert
      expect(response.status).toBe(200);
    });

    it("should return 401 when user not provided any header", async () => {
      // Arrange
      const headers = {};

      // Act
      const response = await app.fetch(
        new Request("http://localhost:3000/auth/whoami", { headers })
      );

      // Assert
      expect(response.status).toBe(401);
    });

    it("should return 401 when user provided invalid header", async () => {
      // Arrange
      const headers = {
        authorization: "invalid",
      };

      // Act
      const response = await app.fetch(
        new Request("http://localhost:3000/auth/whoami", { headers })
      );

      // Assert
      expect(response.status).toBe(401);
    });

    it("should return 401 when user provided invalid token", async () => {
      // Arrange
      const headers = {
        authorization: "Bearer undefined",
      };

      // Act
      const response = await app.fetch(
        new Request("http://localhost:3000/auth/whoami", { headers })
      );

      // Assert
      expect(response.status).toBe(401);
    });
  });

  /**
   * POST /login
   */
  describe("POST /login", () => {
    it("should login successfully when valid credentials are provided", async () => {
      // Arrange
      const userLoginData = {
        email: "dashbore@test.com",
        password: "dashbore",
      };

      // Act
      const response = await client.auth.login.$post({
        json: userLoginData,
      });

      // Assert
      expect(response.status).toBe(200);
    });

    it("should return 401 when invalid credentials are provided", async () => {
      // Arrange
      const userLoginData = {
        email: "dashbore@test.com",
        password: "dashbore123",
      };

      // Act
      const response = await client.auth.login.$post({
        json: userLoginData,
      });

      // Assert
      expect(response.status).toBe(401);
    });
  });
});

describe("Auth Middleware", () => {
  it("should invalid when user provided a not existing user credentials inside token", async () => {
    // Arrange
    const token = await TokenService.generateToken({ id: -9999 } as User);
    const headers = {
      authorization: `Bearer ${token}`,
    };

    // Act
    const response = await app.fetch(
      new Request("http://localhost:3000/auth/whoami", { headers })
    );

    // Assert
    expect(response.status).toBe(401);
  });
});
