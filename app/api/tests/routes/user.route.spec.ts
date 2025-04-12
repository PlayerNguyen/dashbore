import app from "@/app";
import { describe, expect, it } from "bun:test";
import { testClient } from "hono/testing";

/**
 *
 * Test suite for the user route
 */
describe("User Route", () => {
  const client = testClient(app);

  /**
   * Test for the get users route
   */
  it("should return a success response", async () => {
    // Act
    const response = await client.users.$get("/");

    // Assert
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty("success", true);
    expect(json).toHaveProperty("data");
    expect(json.data).toBeInstanceOf(Array);
  });
});
