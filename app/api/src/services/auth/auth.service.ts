import getPrismaClient from "@/util/prisma.util";
import { HTTPException } from "hono/http-exception";

const AuthService = {
  /**
   * Login to the application
   * @param email - The email of the user
   * @param password - The password of the user
   * @returns The user object
   */
  login: async (email: string, password: string) => {
    const user = await getPrismaClient().user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HTTPException(401, {
        message: "Invalid credentials",
        cause: new Error("Invalid credentials"),
      });
    }

    if (!(await Bun.password.verify(password, user.password))) {
      throw new HTTPException(401, {
        message: "Invalid password",
        cause: new Error("Invalid password"),
      });
    }

    return user;
  },
};

export default AuthService;
