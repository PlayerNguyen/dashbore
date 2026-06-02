import responseFactory from "@/factory/response.factory";
import type { PaginationMetadataType } from "@common/pagination.validation";

/**
 *
 * @param data the data to be returned
 * @param paginationMetadata the pagination metadata
 * @returns the response object
 * @example
 * ```ts
 * const data = [1, 2, 3];
 * const metadata = { limit: 10, page: 1, total: 3 };
 *
 * const response = responseFactory.success(data, metadata); // { data: [1, 2, 3], metadata: { pagination: { limit: 10, page: 1, total: 3 } } }

 * ```
 *
 */
function response<T>(data: T[], paginationMetadata: PaginationMetadataType) {
  return responseFactory.success(data, {
    metadata: {
      pagination: paginationMetadata,
    },
  });
}

const PaginationBuilder = {
  response,
};

export default PaginationBuilder;
