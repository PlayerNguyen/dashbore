import { z } from "zod";

export type RestResponse<T> = {
  success: boolean;
  data: T;
};

const createResponseSchema = <T>(schema: z.ZodSchema, other?: T) => {
  return z.object({
    success: z.boolean().default(true),
    data: schema,
    ...other,
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

const createTimestamp = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  return z.object({
    ...schema.shape,
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
  });
};

export { createErrorResponseSchema, createResponseSchema, createTimestamp };
