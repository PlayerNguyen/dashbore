# API Framework Quirks

- Uses `hono/factory` with `createFactory<AppEnvironment>()` typed factory pattern.
- OpenAPI spec auto-generated via `hono-openapi` builder pattern (`createOpenApiPathBuilder()`).
- Swagger UI at `GET /swagger`, OpenAPI spec at `GET /openapi`.
- Auth middleware has two modes: `useLightAuth()` (JWT verify only) and `useStrictAuth(permissions?)` (fetches user from DB, checks permissions).
- Permissions loaded on startup via `PermissionService.bootstrap()` (upserts any missing into DB).
- Redis caching used via `RedisCache.getOrSetCacheItem`.
