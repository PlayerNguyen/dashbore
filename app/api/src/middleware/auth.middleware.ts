import TokenService from "@/services/token/token.service";
import UserService from "@/services/user/user.service";
import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

/**
 * Get the user auth from the token via the header authorization.
 *
 * @param c - The context object
 * @returns The user auth payload
 * @throws HTTPException if the token is invalid or missing.
 */
async function getUserAuthFromToken(c: Context) {
  // Check the header authorization
  const authorization = c.req.header("Authorization");

  if (!authorization) {
    throw new HTTPException(401, {
      message: "Unauthorized due to missing authorization header.",
    });
  }

  // Verify the token
  const splittedToken = authorization.split(" ");

  if (splittedToken.length < 2) {
    throw new HTTPException(401, {
      message:
        "Unauthorized due to invalid authorization header. Please using the Bearer <token>",
    });
  }

  const token = splittedToken[1];
  if (!token) {
    throw new HTTPException(401, {
      message: "Unauthorized due to missing token.",
    });
  }

  const payload = await TokenService.verifyToken(token);

  return payload;
}

const AuthMiddleware = {
  /**
   * Use the light authentication middleware to authenticate the user.
   * The light authentication will not fetch the user from the database.
   * It will only verify the token and set the user in the context.
   *
   *
   * @param c - The context object
   * @param next - The next middleware function
   */
  useLightAuth: () => async (c: Context, next: Next) => {
    const payload = await getUserAuthFromToken(c);
    c.set("user", payload);

    await next();
  },

  /**
   * Use the strict authentication middleware to authenticate the user.
   * The strict authentication will fetch the user from the database.
   *
   * @param permissions - The permissions to check for the user to access the route.
   *
   * @example
   * ```ts
   * const app = createApp().get("/user", AuthMiddleware.useStrictAuth(["user:read"]), (c) => {
   *   return c.json({ message: "Hello, world!" });
   * });
   * ```
   */
  useStrictAuth: (permissions?: string[]) => async (c: Context, next: Next) => {
    const payload = await getUserAuthFromToken(c);

    // Select the user without the password
    const user = await UserService.getUserById(payload.id, {
      password: true,
    });

    if (!user) {
      throw new HTTPException(401, {
        message: "Unauthorized due to invalid token.",
      });
    }

    if (permissions) {
      const hasPermission = await UserService.checkUserPermissions(
        user,
        permissions
      );
      if (!hasPermission) {
        throw new HTTPException(401, {
          message: "Unauthorized due to missing permissions.",
        });
      }
    }

    // Set the user in the context and pass it to the next middleware
    c.set("user", user);
    await next();
  },
};

export default AuthMiddleware;
