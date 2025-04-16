import { z } from "zod";
import { createErrorResponseSchema } from "./util";

export const CommonErrorResponse = createErrorResponseSchema(z.undefined());
