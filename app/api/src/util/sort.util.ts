import type { Context } from "hono";
import qs, { type ParsedQs } from "qs";

type SqlSortKey = "asc" | "desc";
export type SortRecordType = Record<string, SqlSortKey>;
export type SortMetadata = SortRecordType | SortRecordType[];

function validateSortValue(sortItem: ParsedQs) {
  const primaryValue = Object.values(sortItem)[0];
  if (primaryValue !== "asc" && primaryValue !== "desc") {
    throw new Error(
      `Invalid sort parameter at object ${JSON.stringify(sortItem)}`
    );
  }
}

/**
 * Generates sort metadata for wrapping into Prisma orderBy. The sort data retrieves from context queries named sort.
 * For example, `sort=a=desc&sort=b=asc` will be converted to `{"a":"desc","b":"asc"}`. This is a helper function for the open api builder.
 * This helper also check the value of the sort parameter and throw an error if it is invalid. The only accepted values are "asc" and "desc".
 *
 * @param c the current context
 * @param defaultOrderBy the default order by object when no sort is passed into the system
 *
 * @returns the sort metadata for wrapping into Prisma object
 * @example
 * ```ts
 * const app = new Hono();
 * app.get('/',
 *  // use sort validation or open api builder
 * (c) => {
 *    const sortMetadata = SortUtil.useSort(c, SortUtil.DefaultSortByCreatedAt);
 *    prisma.users.findMany({ orderBy: sortMetadata })
 *
 * })
 * ```
 *
 */
function useSort(c: Context, defaultOrderBy: SortMetadata): SortMetadata {
  const sort = c.req.queries("sort")!;

  // If no sort is passed into the system
  if (!sort || !sort.length) {
    return defaultOrderBy;
  }

  if (sort.length === 1) {
    const currentString = sort[0]!;
    const value = qs.parse(currentString);
    if (!value) {
      throw new Error("Invalid value in sort parameter");
    }
    // Check if the value is asc or desc
    validateSortValue(value);

    return value as SortRecordType;
  }

  // If there are multiple sort parameters
  const currentSortObjects: SortRecordType[] = [];
  for (const currentString of sort) {
    const value = qs.parse(currentString);
    validateSortValue(value);
    currentSortObjects.push(value as SortRecordType);
  }

  return currentSortObjects;
}

const DefaultSortByCreatedAt: SortMetadata = [
  { id: "desc" },
  { createdAt: "desc" },
];

const SortUtil = { useSort, DefaultSortByCreatedAt };

export default SortUtil;
