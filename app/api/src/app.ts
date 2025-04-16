import appFactory from "./factory/app.factory";
import useOpenApi from "./middleware/openapi.middleware";

import PermissionService from "./services/permission/permission.service";

import authRoute from "./routes/auth/auth.route";
import userRoute from "./routes/users/users.route";

import { swaggerUI as useSwagger } from "@hono/swagger-ui";
import { cors as useCors } from "hono/cors";
import { logger as useLogger } from "hono/logger";
import ErrorMiddleware from "./middleware/error.middleware";

/**
 * Load all permissions into memory at startup. Any permission that is not in the database will be upsert to the database first, then
 * loaded into memory.
 */
await PermissionService.bootstrap();

/**
 * Register the application instance.
 */
const app = appFactory
  .createApp()
  .use(useLogger())
  .use(
    useCors({
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      maxAge: 600,
    })
  )
  .route("/users", userRoute)
  .route("/auth", authRoute);

/**
 * Use the openAPI middleware to generate the OpenAPI specification for the application
 * Use the swagger UI middleware to generate the swagger UI for the application
 */
app
  .get("/openapi", useOpenApi(app))
  .get("/swagger", useSwagger({ url: "/openapi" }));

/**
 * Use the error handling middleware to handle errors for the application
 */
app.onError(ErrorMiddleware.useErrorHandling());
app.notFound(ErrorMiddleware.useNotFound());

export default app;
