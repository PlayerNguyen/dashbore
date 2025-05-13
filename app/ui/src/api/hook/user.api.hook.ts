import type { PaginationResponse } from "@common/pagination.validation";
import {
  GetUserRequest,
  GetUserResponseEntity,
} from "@common/users.validation";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { z } from "zod";
import userApi from "../user.api";

export function useQueryGetAllUser<
  T = PaginationResponse<z.infer<typeof GetUserResponseEntity>>,
>(args: z.infer<typeof GetUserRequest>, option?: UseQueryOptions<T>) {
  return useQuery<T, Error>({
    ...option,
    queryKey: ["get", "users", args.limit, args.page],
    queryFn: async (context) => {
      return (await userApi.getAll(args, context.signal)) as T;
    },
  });
}
