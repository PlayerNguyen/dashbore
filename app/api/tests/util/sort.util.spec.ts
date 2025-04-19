import SortUtil from "@/util/sort.util";
import { describe, expect, it } from "bun:test";
import type { Context } from "hono";

describe("SortUtil", () => {
  it("should return an object with the correct values", () => {
    // Arrange
    const c = {
      req: {
        queries: (_: string) => ["name=asc", "key=desc"],
      },
    } as unknown as Context;
    // Act
    const result = SortUtil.useSort(c, SortUtil.DefaultSortByCreatedAt);

    // Assert
    expect(result).toBeArray();
    expect(result).toHaveLength(2);
  });

  it("should return an object with the correct values using single value", () => {
    // Arrange
    const c = {
      req: {
        queries: (_: string) => ["name=asc"],
      },
    } as unknown as Context;
    // Act
    const result = SortUtil.useSort(c, SortUtil.DefaultSortByCreatedAt);

    // Assert
    expect(result).toHaveProperty("name", "asc");
  });

  it("should return a default sort with no data in context", () => {
    // Arrange
    const c = {
      req: {
        queries: (_: string) => [],
      },
    } as unknown as Context;
    // Act
    const result = SortUtil.useSort(c, SortUtil.DefaultSortByCreatedAt);
    // Assert
    expect(result).toEqual(SortUtil.DefaultSortByCreatedAt);
  });

  it("should throws if sort is invalid at value", () => {
    // Arrange
    const c = {
      req: {
        queries: (_: string) => ["name=ascx"],
      },
    } as unknown as Context;
    // Act & Assert
    // console.log(SortUtil.useSort(c, SortUtil.DefaultSortByCreatedAt));
    expect(() =>
      SortUtil.useSort(c, SortUtil.DefaultSortByCreatedAt)
    ).toThrowError(/Invalid sort parameter at object.+/);
  });
});
