import { getPrismaClient } from "@dashbore/database";
import { HTTPException } from "hono/http-exception";

export const AuthService = {
  login: async (email: string, password: string) => {
    const user = await getPrismaClient().user.findUnique({
      where: { email },
      omit: { password: false },
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
