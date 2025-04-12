import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const AuthValidation = {
  LoginSchema,
};

export default AuthValidation;
