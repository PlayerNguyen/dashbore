import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { z, type ZodSchema } from "zod";
import { createSchema } from "zod-openapi";
import type {
  OpenApiParameterBuilder,
  OpenApiParameterType,
  OpenApiPathBuilder,
  PaginationSearchRecordType,
} from "./types";

class OpenApiParameterBuilderImpl implements OpenApiParameterBuilder {
  private name?: string;
  private type?: OpenApiParameterType;
  private required?: boolean = false;
  private schema?: ZodSchema;
  private description?: string;

  constructor() {}

  getName(): string | undefined {
    return this.name;
  }

  withComponents(components: unknown): this {
    throw new Error("Method not implemented.");
  }

  withDescription(description: string): this {
    this.description = description;
    return this;
  }

  withName(name: string): this {
    this.name = name;
    return this;
  }
  withType(type: OpenApiParameterType): this {
    this.type = type;
    return this;
  }
  withRequired(required: boolean): this {
    this.required = required;
    return this;
  }
  withSchema(schema: ZodSchema): this {
    this.schema = schema;
    return this;
  }

  build(): object {
    if (this.schema === undefined) {
      throw new Error("Schema is required for OpenApiParameterBuilder");
    }

    return {
      name: this.name,
      in: this.type,
      description: this.description,
      required: this.required,
      ...createSchema(this.schema),
    };
  }
}

/**
 * OpenApiPathBuilder is a builder for the OpenApi path.
 * It is used to build the OpenApi path object.
 * @example
 * const path = createOpenApiPathBuilder()
 *   .withSummary("Get user")
 *   .withDescription("Get user by id")
 *   .withTags("user")
 *   .withValidation(z.object({ id: z.string() }))
 *   .withSecurity(["BearerAuth"]) // Specify security scheme
 *   .build();
 *
 * const app = createApp().post("/user", path, (c) => { ... });
 */
class OpenApiPathBuilderImpl implements OpenApiPathBuilder {
  private summary?: string;
  private description?: string;
  private tags?: string[];
  private requestBody?: unknown;
  private security?: string[];
  private params?: OpenApiParameterBuilder[];

  public withSummary(summary: string) {
    this.summary = summary;
    return this;
  }

  public withDescription(description: string) {
    this.description = description;
    return this;
  }

  public withTags(...tags: string[]) {
    this.tags = tags;
    return this;
  }

  public withValidation(requestBody: ZodSchema) {
    this.requestBody = {
      content: {
        "application/json": resolver(requestBody).builder(),
      },
    };
    return this;
  }

  public withSecurity(securitySchemes: string[]) {
    this.security = securitySchemes;
    return this;
  }

  public withParams(...params: OpenApiParameterBuilder[]) {
    this.params = params;
    return this;
  }

  public withPagination(search?: PaginationSearchRecordType) {
    // Add default pagination like `page` or `limit` if not provided in params
    this.params = this.params || [];
    if (!this.params.some((param) => param.getName() === "page")) {
      this.params.push(
        createOpenApiParameterBuilder()
          .withName("page")
          .withType("query")
          .withDescription("The current page number. The value must be a positive number and default to 1.")
          .withRequired(false)
          .withSchema(z.number().min(1).default(1))
      );
    }
    if (!this.params.some((param) => param.getName() === "limit")) {
      this.params.push(
        createOpenApiParameterBuilder()
          .withName("limit")
          .withDescription("How many records to return. The value must be a positive number and default is 10.")
          .withRequired(false)
          .withRequired(false)
          .withType("query")
          .withSchema(z.number())
      );
    }

    // If available the search record type is added to the params
    if (search) {
      this.params.push(
        createOpenApiParameterBuilder()
          .withName("search")
          .withType("query")
          .withDescription("Search query")
          .withRequired(false)
          .withSchema(z.object(search))
      );
    }

    return this;
  }

  public build() {
    const path: any = {
      summary: this.summary,
      description: this.description,
      tags: this.tags,
      requestBody: this.requestBody,
      params: this.params
        ? this.params.map((param) => param.build())
        : undefined,
    };

    if (this.security) {
      path.security = this.security.map((scheme) => ({ [scheme]: [] }));
    }

    return path;
  }

  public buildMiddleware() {
    return describeRoute(this.build());
  }
}

/**
 * Create a new instance of the OpenAPI path builder.
 *
 * This builder allows you to incrementally define an OpenAPI-compliant path
 * object, including summary, description, parameters, validation, and more.
 *
 * @returns An instance of `OpenApiPathBuilder`.
 *
 * @example
 * ```
 * const pathBuilder = createOpenApiPathBuilder()
 *   .withSummary("Get User")
 *   .withDescription("Fetch a user by ID")
 *   .withTags("User")
 *   .withParams(
 *     createOpenApiParameterBuilder()
 *       .withName("id")
 *       .withType("path")
 *       .withRequired(true)
 *       .withSchema(z.string())
 *   )
 *   .build();
 * ```
 */
function createOpenApiPathBuilder() {
  return new OpenApiPathBuilderImpl();
}

/**
 * Create a new instance of the OpenAPI parameter builder.
 *
 * This builder is used to define individual parameters (e.g. query or path params)
 * for OpenAPI path definitions, including their name, location, schema, and metadata.
 *
 * @returns An instance of `OpenApiParameterBuilder`.
 *
 * @example
 * ```
 * const paramBuilder = createOpenApiParameterBuilder()
 *   .withName("limit")
 *   .withType("query")
 *   .withRequired(false)
 *   .withSchema(z.number().min(1).max(100));
 * ```
 */
function createOpenApiParameterBuilder() {
  return new OpenApiParameterBuilderImpl();
}

export { createOpenApiParameterBuilder, createOpenApiPathBuilder };
