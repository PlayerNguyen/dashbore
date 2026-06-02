import { AuthValidation } from "@common/index";
import type { RestResponse } from "@common/util";
import type { User } from "@prisma/generated/client";
import { z } from "zod";
import axiosInstance from "./axios";

/**
 * Auth API
 */
const authApi = {
  /**
   * Login into the application via email and password.
   *
   * @param data - Login data
   * @returns Login response
   */
  login: async (data: z.infer<typeof AuthValidation.LoginSchema>) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data as z.infer<typeof AuthValidation.LoginResponseSchema>;
  },

  whoami: async () => {
    const response = await axiosInstance.get("/auth/whoami");
    return response.data as RestResponse<{ user: User }>;
  },
};

export default authApi;
