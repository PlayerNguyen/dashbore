import type { Context } from "hono";

function usePagination(c: Context) {
  const page: number = Number(c.req.query("page") || 1);
  const limit: number = Number(c.req.query("limit") || 10);
  const offset: number = (page - 1) * limit;

  return { page, limit, offset };
}

const PaginationUtil = {
  usePagination,
};

export default PaginationUtil;
