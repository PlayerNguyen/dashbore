import { z } from "zod";
import { CreatePaginationRequest } from "./pagination.validation";
import { createTimestamp } from "./util";

const GetUserRequest = CreatePaginationRequest({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

const GetUserResponseEntity = createTimestamp(
  z.object({
    id: z.number(),
    username: z.string(),
    name: z.string().nullable(),
    email: z.string().email(),
    role: z.enum(["admin", "user"]),
  })
);

export const UsersValidation = {
  GetUserRequest,
  GetUserResponseEntity,
};
