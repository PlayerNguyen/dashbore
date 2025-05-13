import type { PaginationResponse } from "@common/pagination.validation";
import {
  GetUserRequest,
  GetUserResponseEntity,
} from "@common/users.validation";
import { z } from "zod";
import axiosInstance from "./axios";
/**
 * Auth API
 */
const userApi = {
  /**
   * Retrieves all users from the database.
   *
   * @returns All users
   */
  getAll: async (
    params: z.infer<typeof GetUserRequest>,
    signal?: AbortSignal
  ) => {
    const response = await axiosInstance.get("/users", {
      signal,
      params,
    });

    return response.data as PaginationResponse<
      z.infer<typeof GetUserResponseEntity>
    >;
  },
};

export default userApi;
