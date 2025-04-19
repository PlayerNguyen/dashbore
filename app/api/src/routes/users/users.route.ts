import { createOpenApiPathBuilder } from "@/builder/openapi/openapi.builder";
import PaginationBuilder from "@/builder/pagination/pagination.builder";
import RedisCache from "@/core/cache/redis.cache";
import CorePermissionKey from "@/core/permission/core.permission";
import appFactory from "@/factory/app.factory";
import PaginationUtil from "@/util/pagination.util";
import getPrismaClient from "@/util/prisma.util";
import SortUtil from "@/util/sort.util";
import { UsersValidation } from "@common/users.validation";

/**
 * User route
 */
const userRoute = appFactory
  .createApp()
  .get(
    "/",
    createOpenApiPathBuilder()
      .withPagination(UsersValidation.GetUserResponseEntity)
      .withDescription("Get all users")
      .withPermissions(CorePermissionKey.USERS_READ)
      .withTags("users")
      .buildMiddleware(),
    async (c) => {
      const paginationMetadata = PaginationUtil.usePagination(c);
      const sortMetadata = SortUtil.useSort(c, SortUtil.DefaultSortByCreatedAt);

      const [userCount, users] = await Promise.all([
        RedisCache.getOrSetCacheItem(
          { base: "users", params: { count: "id" } },
          await getPrismaClient().user.count({
            orderBy: sortMetadata,
          })
        ),
        RedisCache.getOrSetCacheItem(
          {
            base: "users",
            params: { ...c.req.query() },
          },
          await getPrismaClient().user.findMany({
            skip: paginationMetadata.offset,
            take: paginationMetadata.limit,
            orderBy: sortMetadata,
          })
        ),
      ]);

      return c.json(
        PaginationBuilder.response(users, {
          ...paginationMetadata,
          total: userCount,
        })
      );
    }
  );

export default userRoute;
