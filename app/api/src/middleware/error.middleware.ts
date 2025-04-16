import responseFactory from "@/factory/response.factory";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

/**
 * Use the error handling middleware to handle errors for the application.
 * @returns The error handling middleware
 */
const useErrorHandling = () => (err: Error, c: Context) => {
  if (Bun.env.NODE_ENV === "test") {
    console.warn(`[Error::Testing] ${err.message}`);
  } else {
    console.error(err);
  }

  const status = err instanceof HTTPException ? err.status : 500;

  return c.json(responseFactory.error(err), status);
};

const useNotFound = () => (c: Context) => {
  return c.json(responseFactory.error(new Error("Not Found")), 404);
};

const ErrorMiddleware = {
  useErrorHandling,
  useNotFound,
};

export default ErrorMiddleware;
