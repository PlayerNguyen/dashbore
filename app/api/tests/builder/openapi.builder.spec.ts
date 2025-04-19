import {
  createOpenApiParameterBuilder,
  createOpenApiPathBuilder,
} from "@/builder/openapi/openapi.builder";
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
    const builder = createOpenApiPathBuilder()
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

  it("should build the OpenApi path with params", () => {
    // Arrange
    const builder = createOpenApiPathBuilder()
      .withDescription("pagination routes")
      .withParams(
        createOpenApiParameterBuilder()
          .withName("page")
          .withType("query")
          .withDescription("The current page number")
          .withRequired(false)
          .withSchema(z.number().min(1)),
        createOpenApiParameterBuilder()
          .withName("limit")
          .withType("query")
          .withDescription("The number of items to return per page")
          .withRequired(false)
          .withSchema(z.number().min(1))
      );

    // Act
    const returnObject = builder.build();
    console.log(returnObject);
    // Assertion
    expect(returnObject).toEqual({
      description: "pagination routes",
      requestBody: undefined,
      summary: undefined,
      tags: undefined,
      params: [
        {
          components: undefined,
          name: "page",
          in: "query" as const,
          description: "The current page number",
          required: false,
          schema: {
            type: "number",
            minimum: 1,
          },
        },
        {
          components: undefined,
          name: "limit",
          in: "query" as const,
          description: "The number of items to return per page",
          required: false,
          schema: {
            type: "number",
            minimum: 1,
          },
        },
      ],
    });
  });

  /**
   * Pagination
   */

  it("should build the OpenApi path with pagination", () => {
    // Arrange
    const builder = createOpenApiPathBuilder().withPagination();

    // Act
    const resp = builder.build();
    // Assertion
    expect(resp).toHaveProperty("params");
    expect(resp.params.length).toBe(2);
    expect(resp.params[0].name).toBe("page");
    expect(resp.params[0].in).toBe("query");
    expect(resp.params[1].name).toBe("limit");
    expect(resp.params[1].in).toBe("query");
    expect(resp.params[0].description).toBe(
      "The current page number. The value must be a positive number and default to 1."
    );
    expect(resp.params[1].description).toBe(
      "How many records to return. The value must be a positive number and default is 10."
    );
    expect(resp.params[0].required).toBe(false);
    expect(resp.params[1].required).toBe(false);
  });
});

describe("OpenApiParameterBuilder", () => {
  it("should build the OpenApi parameter object with constructor", () => {
    // Arrange
    const builder = createOpenApiParameterBuilder()
      .withName("id")
      .withDescription("User ID")
      .withRequired(true)
      .withType("query")
      .withSchema(z.string().min(2).max(5).regex(/[0-9]/));

    // Act
    const path = builder.build();

    // Assertion
    expect(path).toEqual({
      description: "User ID",
      name: "id",
      required: true,
      in: "query",
      components: undefined,
      schema: {
        type: "string",
        minLength: 2,
        maxLength: 5,
        pattern: "[0-9]",
      },
    });
  });
});
