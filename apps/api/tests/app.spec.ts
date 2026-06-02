import app from "@/app";
import { describe, expect, it } from "bun:test";

describe("App", () => {
  it("should have openapi endpoint", async () => {
    // Arrange & Act
    const response = await app.fetch(
      new Request("http://localhost:3000/openapi")
    );

    // Assert
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty("openapi");
    expect(json).toHaveProperty("info");
    expect(json).toHaveProperty("servers");
    expect(json).toHaveProperty("paths");
  });

  it("should have swagger endpoint", async () => {
    // Arrange & Act
    const response = await app.fetch(
      new Request("http://localhost:3000/swagger")
    );

    // Assert
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
  });
});
