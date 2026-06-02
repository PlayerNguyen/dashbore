import { z } from "zod";
import { createResponseSchema } from "./util";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const LoginResponseSchema = createResponseSchema(
  z.object({
    token: z.string(),
  })
);

const AuthValidation = {
  LoginSchema,
  LoginResponseSchema,
};

export { AuthValidation };
