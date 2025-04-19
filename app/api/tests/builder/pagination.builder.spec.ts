import PaginationBuilder from "@/builder/pagination/pagination.builder";
import responseFactory from "@/factory/response.factory";
import { describe, expect, it } from "bun:test";

describe("PaginationBuilder", () => {
  it("should build the OpenApi path object", async () => {
    // Arrange
    const data = [1, 2, 3];
    const metadata = { limit: 10, page: 1, total: 3 };
    const response = responseFactory.success(data, {
      metadata: {
        pagination: metadata,
      },
    });
    // Act
    const result = PaginationBuilder.response(data, metadata);
    // Assert
    expect(result).toHaveProperty("data");
    expect(result.data).toEqual([1, 2, 3]);
    expect(result).toHaveProperty("metadata");
    expect(result.metadata.pagination.limit).toBe(10);
    expect(result.metadata.pagination.page).toBe(1);
    expect(result.metadata.pagination.total).toBe(3);
  });
});
