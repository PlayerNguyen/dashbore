import type { ZodSchema } from "zod";

export type OpenApiParameterType = "query" | "path";

export type PaginationSearchRecordType = Record<string, ZodSchema>;

export interface OpenApiParameterBuilder {
  /**
   * Get the name of the parameter (e.g. "userId").
   *
   */
  getName(): string | undefined;

  /**
   * Set the name of the parameter (e.g. "userId").
   * @param name The parameter's name.
   * @example
   * ```
   * createOpenApiParameterBuilder().withName("userId");
   * ```
   */
  withName(name: string): this;

  /**
   * Add a description to explain the purpose of the parameter.
   * @param description The parameter description.
   * @example
   * ```
   * createOpenApiParameterBuilder().withDescription("ID of the user");
   * ```
   */
  withDescription(description: string): this;

  /**
   * Set whether the parameter is required.
   * @param required True if the parameter must be present.
   * @example
   * ```
   * createOpenApiParameterBuilder().withRequired(true);
   * ```
   */
  withRequired(required: boolean): this;

  /**
   * Define where the parameter appears (e.g. "query", "path", "header").
   * @param type The parameter location type.
   * @example
   * ```
   * createOpenApiParameterBuilder().withType("query");
   * ```
   */
  withType(type: OpenApiParameterType): this;

  /**
   * Attach a Zod schema to validate the parameter's value.
   * @param schema A Zod schema defining the parameter's structure.
   * @example
   * ```
   * createOpenApiParameterBuilder().withSchema(z.string());
   * ```
   */
  withSchema(schema: ZodSchema): this;

  /**
   * Inject additional OpenAPI components or metadata.
   * @param components Custom OpenAPI-compliant metadata.
   * @example
   * ```
   * createOpenApiParameterBuilder().withComponents({ example: "abc123" });
   * ```
   */
  withComponents(components: unknown): this;

  /**
   * Finalize and return the built parameter definition.
   * @example
   * ```
   * const param = createOpenApiParameterBuilder()
   *   .withName("userId")
   *   .withType("path")
   *   .withRequired(true)
   *   .withSchema(z.string())
   *   .build();
   * ```
   */
  build(): unknown;
}

export interface OpenApiPathBuilder {
  /**
   * Add a summary to the path.
   * @param summary The summary of the path.
   * @example
   * ```
   * createOpenApiPathBuilder().withSummary("Get a user");
   * ```
   */
  withSummary(summary: string): this;

  /**
   * Add a description to the path.
   * @param description A longer explanation of the path.
   * @example
   * ```
   * createOpenApiPathBuilder().withDescription("Retrieve a user by ID");
   * ```
   */
  withDescription(description: string): this;

  /**
   * Assign tags for grouping endpoints in OpenAPI documentation.
   * @param tags List of tags.
   * @example
   * ```
   * createOpenApiPathBuilder().withTags("User", "Admin");
   * ```
   */
  withTags(...tags: string[]): this;

  /**
   * Define a request body schema using Zod.
   * @param requestBody A Zod schema to validate the request body.
   * @example
   * ```
   * createOpenApiPathBuilder().withValidation(z.object({ name: z.string() }));
   * ```
   */
  withValidation(requestBody: ZodSchema): this;

  /**
   * Add one or more security schemes to this endpoint.
   * @param securitySchemes Names of security schemes.
   * @example
   * ```
   * createOpenApiPathBuilder().withSecurity(["bearerAuth"]);
   * ```
   */
  withSecurity(securitySchemes: string[]): this;

  /**
   * Add path or query parameters using parameter builders.
   * @param params Parameter builders defining name, type, schema, etc.
   * @example
   * ```
   * const param = createOpenApiParameterBuilder()
   *   .withName("userId")
   *   .withType("path")
   *   .withSchema(z.string())
   *   .withRequired(true);
   *
   * createOpenApiPathBuilder().withParams(param);
   * ```
   */
  withParams(...params: OpenApiParameterBuilder[]): this;

  /**
   * Add pagination parameters like `limit` and `page` to this endpoint.
   * @example
   * ```
   * createOpenApiPathBuilder().withPagination();
   * ```
   */
  withPagination(search?: PaginationSearchRecordType): this;

  /**
   * Finalize and return the OpenAPI path definition.
   * @example
   * ```
   * const path = createOpenApiPathBuilder()
   *   .withSummary("List users")
   *   .withPagination()
   *   .build();
   * ```
   */
  build(): any;

  /**
   * Build any associated middleware, such as validators, based on configuration.
   * @example
   * ```
   * const middleware = createOpenApiPathBuilder()
   *   .withValidation(z.object({ id: z.string() }))
   *   .buildMiddleware();
   * ```
   */
  buildMiddleware(): any;
}
