import {
  createOpenApiPathBuilder,
  OpenApiPathBuilder,
} from "@/builder/openapi.builder";
import { describe, expect, it } from "bun:test";
import { z } from "zod";

describe("OpenApiPathBuilder", () => {
  it("should build the OpenApi path object", () => {
    // Arrange
    const builder = createOpenApiPathBuilder();

    // Act
    const path = builder.build();

    // Assert
    expect(path).toEqual({
      summary: undefined,
      description: undefined,
      tags: undefined,
      requestBody: undefined,
    });
  });

  it("should build the OpenApi path object with summary", () => {
    // Arrange
    const builder = createOpenApiPathBuilder();

    // Act
    const path = builder.withSummary("Get user").build();

    // Assert
    expect(path).toEqual({
      summary: "Get user",
      description: undefined,
      tags: undefined,
      requestBody: undefined,
    });
  });

  it("should build the OpenApi path object with description", () => {
    // Arrange
    const builder = createOpenApiPathBuilder();

    // Act
    const path = builder.withDescription("Get user by id").build();

    // Assert
    expect(path).toEqual({
      summary: undefined,
      description: "Get user by id",
      tags: undefined,
      requestBody: undefined,
    });
  });

  it("should build the OpenApi path object with tags", () => {
    // Arrange
    const builder = createOpenApiPathBuilder();

    // Act
    const path = builder.withTags("user", "admin").build();

    // Assert
    expect(path).toEqual({
      summary: undefined,
      description: undefined,
      tags: ["user", "admin"],
      requestBody: undefined,
    });
  });

  it("should build the OpenApi path object with validation", () => {
    // Arrange
    const builder = createOpenApiPathBuilder();
    const validationSchema = z.object({
      id: z.string(),
    });

    // Act
    const path = builder.withValidation(validationSchema).build();

    // Assert
    expect(path).toEqual({
      summary: undefined,
      description: undefined,
      tags: undefined,
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
              },
              required: ["id"],
            },
          },
        },
      },
    });
  });

  it("should build the OpenApi path object with constructor", () => {
    // Arrange
    const builder = new OpenApiPathBuilder()
      .withSummary("Get user")
      .withDescription("Get user by id")
      .withTags("user", "admin")
      .withValidation(z.object({ id: z.string() }));

    // Act
    const path = builder.build();

    // Assert
    expect(path).toEqual({
      summary: "Get user",
      description: "Get user by id",
      tags: ["user", "admin"],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
              },
              required: ["id"],
            },
          },
        },
      },
    });
  });
});
