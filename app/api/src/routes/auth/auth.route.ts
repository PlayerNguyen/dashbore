import { createOpenApiPathBuilder } from "@/builder/openapi.builder";
import appFactory from "@/factory/app.factory";
import responseFactory from "@/factory/response.factory";
import AuthMiddleware from "@/middleware/auth.middleware";
import AuthService from "@/services/auth/auth.service";
import TokenService from "@/services/token/token.service";
import type { NormalizedUser } from "@/services/user/user.service";
import { zValidator } from "@hono/zod-validator";
import type { z } from "zod";
import AuthValidation from "./validation";

/**
 * Auth route
 */
const authRoute = appFactory
  .createApp()
  .get(
    "/whoami",
    createOpenApiPathBuilder()
      .withSummary("Get the current user information")
      .withDescription("Retrieves the current user information from the token.")
      .withTags("auth")
      .withSecurity(["bearerAuth"])
      .buildMiddleware(),
    AuthMiddleware.useStrictAuth(),
    (c) => {
      const user = c.get("user") as NormalizedUser;
      return c.json(responseFactory.success({ user }), 200);
    }
  )
  .post(
    "/login",
    createOpenApiPathBuilder()
      .withSummary("Login to the application")
      .withDescription(
        "This route is used to login to the application by using password-based authentication."
      )
      .withTags("auth")
      .withValidation(AuthValidation.LoginSchema)
      .buildMiddleware(),
    zValidator("json", AuthValidation.LoginSchema),
    async (c) => {
      const { email, password } = (await c.req.json()) as z.infer<
        typeof AuthValidation.LoginSchema
      >;

      // Login to the application
      const user = await AuthService.login(email, password);

      // Generate a token for the user
      const token = await TokenService.generateToken(user);

      return c.json(responseFactory.success({ token }));
    }
  );

export default authRoute;
