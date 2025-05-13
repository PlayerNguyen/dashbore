import { z, ZodSchema } from "zod";
import { type RestResponse } from "./util";

export const CreatePaginationRequest = (
  optional?: Record<string, ZodSchema>
) => {
  return z.object({
    limit: z.number().default(10),
    page: z.number().default(1),
    ...optional,
  });
};

export type PaginationMetadataType = {
  limit: number;
  page: number;
  total: number;
};

export type PaginationResponse<T> = RestResponse<T[]> & {
  metadata: { pagination: PaginationMetadataType };
};

export type PaginationRequest<TChildren extends Record<string, ZodSchema>> = {
  limit?: number;
  page?: number;
} & TChildren;
