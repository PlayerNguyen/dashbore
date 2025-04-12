import type { ErrorResponse, SuccessResponse } from "@/types/http.types";

/**
 * Create a response object with a success status and data.
 * @param success - Whether the request was successful
 * @param data - The data to be returned
 * @param others - Other properties to be returned in the response (not data)
 * @returns A response object
 */
function createResponse<T>(success: boolean, data?: T, others?: any) {
  return {
    success,
    data,
    ...others,
  };
}

/**
 * Factory for creating response objects.
 */
const responseFactory = {
  /**
   * Create a success response object with data.
   * @param data - The data to be returned
   * @param others - Other properties to be returned in the response (not data)
   * @returns A response object
   */
  success: <T, TOther = {}>(data: T, others?: TOther) =>
    createResponse(true, data, others) as SuccessResponse<T, TOther>,
  /**
   * Create an error response object with a message and data.
   * @param err - The error object to be returned
   * @param data - The data to be returned
   * @returns A response object
   */
  error: <T>(err: Error, data?: T) =>
    createResponse(false, data, {
      error: { message: err.message, stack: err.stack },
    }) as ErrorResponse<T>,
};

export default responseFactory;
