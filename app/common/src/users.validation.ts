import { z } from "zod";
import { CreatePaginationRequest } from "./pagination.validation";
import { createTimestamp } from "./util";

export const GetUserRequest = CreatePaginationRequest({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const GetUserResponseEntity = createTimestamp(
  z.object({
    id: z.number(),
    name: z.string().nullable(),
    email: z.string().email(),
  })
);

export const UsersValidation = {
  GetUserRequest,
  GetUserResponseEntity,
};
