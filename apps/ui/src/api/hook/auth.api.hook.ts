import { AuthValidation, CommonErrorResponse } from "@common/index";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { z } from "zod";
import authApi from "../auth.api";

/**
 * Login into the application via email and password.
 *
 * @example
 * const { mutate: login, isPending } = useLogin();
 * login({ email: "test@test.com", password: "password" });
 */
export const useAuthLogin = () =>
  useMutation<
    z.infer<typeof AuthValidation.LoginResponseSchema>,
    AxiosError<z.infer<typeof CommonErrorResponse>>,
    z.infer<typeof AuthValidation.LoginSchema>
  >({
    mutationFn: authApi.login,
    mutationKey: ["auth", "login"],
  });

export const useAuthWhoAmIQuery = (enabled?: boolean) =>
  useQuery({
    queryKey: ["auth", "whoami"],
    queryFn: authApi.whoami,
    enabled,
  });
