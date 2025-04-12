import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import type { ZodSchema } from "zod";

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
class OpenApiPathBuilder {
  private summary?: string;
  private description?: string;
  private tags?: string[];
  private requestBody?: unknown;
  private security?: string[];

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

  public build() {
    const path: any = {
      summary: this.summary,
      description: this.description,
      tags: this.tags,
      requestBody: this.requestBody,
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

function createOpenApiPathBuilder() {
  return new OpenApiPathBuilder();
}

export { createOpenApiPathBuilder, OpenApiPathBuilder };
