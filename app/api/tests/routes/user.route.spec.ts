import app from "@/app";
import { describe, expect, it } from "bun:test";
import { testClient } from "hono/testing";
import TestContext from "tests/test.context.spec";

/**
 *
 * Test suite for the user route
 */
describe("User Route", () => {
  const client = testClient(app);

  /**
   * Test for the get users route
   */
  it("should reject if user not logged in", async () => {
    // Act
    const response = await client.users.$get("/");

    // Assert
    expect(response.status).toBe(401);
  });

  /**
   * Test for the get users route
   */
  it("should return a list of users", async () => {
    // Arrange
    console.log(TestContext.getTestContext());
    const token = TestContext.getTestContext().getToken();
    // Act
    const response = await client.users.$get("/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const responseJson = await response.json();
    // Assert
    expect(response.status).toBe(200);
    expect(responseJson.data).toBeArray();
    expect(responseJson.data.length).toBeGreaterThan(0);
    expect(responseJson).toHaveProperty("metadata");
  });
});
