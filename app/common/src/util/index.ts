import { z } from "zod";

export type RestResponse<T> = {
  success: boolean;
  data: T;
};

const createResponseSchema = (schema: z.ZodSchema) => {
  return z.object({
    success: z.boolean().default(true),
    data: schema,
  });
};

const createErrorResponseSchema = (schema?: z.ZodSchema) => {
  return z.object({
    success: z.boolean().default(false),
    error: z.object({
      message: z.string(),
      cause: z.string().optional(),
    }),
    data: (schema && schema.optional()) || z.any(),
  });
};

export { createErrorResponseSchema, createResponseSchema };
