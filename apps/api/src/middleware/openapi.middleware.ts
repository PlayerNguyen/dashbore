import type { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";

/**
 * Use the openAPISpecs middleware to generate the OpenAPI specification for the application
 * @param app - The Hono application instance
 * @returns The OpenAPI specification
 */
const useOpenApi = (app: Hono<any>) =>
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Dashbore API",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Dashbore API Local Server",
        },
      ],
    },
  });

export default useOpenApi;
