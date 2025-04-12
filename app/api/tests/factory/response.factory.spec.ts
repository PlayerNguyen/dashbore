import responseFactory from "@/factory/response.factory";
import { describe, expect, it } from "bun:test";

/**
 * Test suite for the response factory
 */
describe("Response Factory", () => {
  /**
   * Test for success
   */
  describe("testSuccess", () => {
    it("when called with a string, then it should create a success response", () => {
      // Arrange
      const message = "Hello, world!";
      const data = { message };

      // Act
      const response = responseFactory.success(data);

      // Assert
      expect(response).toEqual({
        success: true,
        data,
      });
    });
  });

  /**
   * Test for error
   */
  describe("testError", () => {
    it("when called with an error object, then it should create an error response", () => {
      // Arrange
      const error: Error = new Error("Example error");

      // Act
      const response = responseFactory.error(error, {
        message: "Hello, world!",
      });

      // Assert
      expect(response).toEqual({
        success: false,
        data: { message: "Hello, world!" },
        error: { message: "Example error", stack: error.stack },
      });
    });
  });
});
