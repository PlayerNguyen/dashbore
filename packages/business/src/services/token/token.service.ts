import type { User } from "@dashbore/database";
import { HTTPException } from "hono/http-exception";
import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME as string;

export const TokenService = {
  generateToken: async (user: User) => {
    const token = jwt.sign(
      {
        email: user.email,
        id: user.id,
      },
      JWT_SECRET,
      {
        subject: user.id.toString(),
        algorithm: "HS512",
        expiresIn: JWT_EXPIRATION_TIME,
      } as any
    );

    return token;
  },

  verifyToken: async (token: string) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      return decoded as JwtPayload & { id: number; email: string };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new HTTPException(401, {
        message: `Unable to verify token. The token is invalid or expired. ${message}`,
        cause: error,
      });
    }
  },
};
