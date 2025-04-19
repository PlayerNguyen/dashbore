import {
  createOpenApiParameterBuilder,
  createOpenApiPathBuilder,
} from "@/builder/openapi/openapi.builder";
import { describe, expect, it } from "bun:test";
import { z } from "zod";

describe("OpenApiPathBuilder", () => {
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
    expect(path).toHaveProperty("summary", "Get user");
    expect(path).toHaveProperty("description", "Get user by id");
    expect(path).toHaveProperty("tags", ["user", "admin"]);
    expect(path).toHaveProperty("requestBody");

    expect(path.requestBody).toHaveProperty("content");
    expect(
      path.requestBody.content["application/json"].schema.properties.id.type
    ).toEqual("string");
    expect(
      path.requestBody.content["application/json"].schema.required
    ).toEqual(["id"]);
    expect(path.requestBody.content["application/json"].schema.type).toEqual(
      "object"
    );
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
    expect(returnObject).toHaveProperty("description", "pagination routes");
    expect(returnObject).toHaveProperty("requestBody", undefined);
    expect(returnObject).toHaveProperty("summary", undefined);
    expect(returnObject).toHaveProperty("tags", undefined);
    expect(returnObject).toHaveProperty("permissions", undefined);

    expect(returnObject).toHaveProperty("parameters");
    expect(returnObject.parameters).toHaveLength(2);
    expect(returnObject.parameters[0]).toHaveProperty("components", undefined);
    expect(returnObject.parameters[0]).toHaveProperty("name", "page");
    expect(returnObject.parameters[0]).toHaveProperty("in", "query");
    expect(returnObject.parameters[0]).toHaveProperty(
      "description",
      "The current page number"
    );
    expect(returnObject.parameters[0]).toHaveProperty("required", false);
    expect(returnObject.parameters[0].schema).toHaveProperty("type", "number");
    expect(returnObject.parameters[0].schema).toHaveProperty("minimum", 1);

    expect(returnObject.parameters[1]).toHaveProperty("components", undefined);
    expect(returnObject.parameters[1]).toHaveProperty("name", "limit");
    expect(returnObject.parameters[1]).toHaveProperty("in", "query");
    expect(returnObject.parameters[1]).toHaveProperty(
      "description",
      "The number of items to return per page"
    );
    expect(returnObject.parameters[1]).toHaveProperty("required", false);
    expect(returnObject.parameters[1].schema).toHaveProperty("type", "number");
    expect(returnObject.parameters[1].schema).toHaveProperty("minimum", 1);
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
    expect(resp).toHaveProperty("parameters");
    expect(resp.parameters.length).toBe(2);
    expect(resp.parameters[0].name).toBe("page");
    expect(resp.parameters[0].in).toBe("query");
    expect(resp.parameters[1].name).toBe("limit");
    expect(resp.parameters[1].in).toBe("query");
    expect(resp.parameters[0].description).toBe(
      "The current page number. The value must be a positive number and default to 1."
    );
    expect(resp.parameters[1].description).toBe(
      "How many records to return. The value must be a positive number and default is 10."
    );
    expect(resp.parameters[0].required).toBe(false);
    expect(resp.parameters[1].required).toBe(false);
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
