# Dashbore — AGENTS.md

## Runtime & package manager

- **Bun** everywhere (v1.2.9+). Do not use npm/pnpm/yarn.
- Root `package.json` uses **Bun workspaces** (`"workspaces": ["apps/*", "packages/*"]`).

## Monorepo structure

| package | path | stack |
|---|---|---|
| `dashbore-api` | `apps/api/` | Hono + Prisma (MySQL) + JWT + Redis |
| `dashbore-ui` | `apps/ui/` | React 19 + Vite + TanStack Router + Mantine UI + Tailwind v4 + Zustand + TanStack Query |
| `dashbore-common` | `packages/common/` | Shared Zod schemas, re-exported through `@common/index` |

## Installation

```sh
bun install    # single root install — workspaces handle the rest
```

`bun install` auto-runs `postinstall` scripts per workspace (prisma generate, etc). No special ordering needed.

## Development

### Infrastructure (required)
```sh
docker compose up -d    # MySQL :3306, Redis :6379, Adminer :8080
```

### Dev servers
```sh
bun run dev     # concurrently runs dev-api + dev-ui
bun run dev:api # runs `prisma migrate dev` then starts Hono with --watch (:3000)
bun run dev:ui  # Vite dev server (default :5173)
```

API `.env` (copy `apps/api/.env.example`):
- `DATABASE_URL=mysql://dashbore:dashbore@localhost:3306/dashbore`
- `JWT_SECRET`, `JWT_EXPIRATION_TIME`, `REDIS_URL`

UI `.env` (copy `apps/ui/.env.example`):
- `VITE_API_URL=http://localhost:3000`

### Testing

```sh
bun run test       # runs all tests with coverage (root)
bun run test:api   # API only — runs migrate → seed → bun test
bun run test:ui    # UI only — bun test
```

**API test quirks:**
- Test script: `cross-env NODE_ENV=test bun run migrate && bun run seed && bun test --preload ./tests/preload.ts`
- Requires MySQL + Redis running (`docker compose up -d`)
- Uses `apps/api/.env.test` (connects to `dashbore_test` database)
- Preload (`tests/preload.ts`) bootstraps permissions then logs in test user `dashbore@test.com` / `dashbore`
- Coverage threshold: 60% (`bunfig.toml` in both root and api)
- Test files go in `apps/api/tests/`, they import from `@/` (api) and `@common/`

### Build

```sh
bun run build         # concurrently builds api + ui
bun run build:api     # bun build → dist/index.js (bun target)
bun run build:ui      # vite build
```

Or target a single workspace:
```sh
bun run --filter=dashbore-api dev
bun run --filter=dashbore-ui test
```

## Path aliases

| alias | api (`tsconfig.json`) | ui (`vite.config.js` + `tsconfig.json`) |
|---|---|---|
| `@/` | `src/` | `./src/*` |
| `@common/` | `../../packages/common/src/*` | same |
| `@generated/prisma/` | `generated/prisma/*` | — |
| `@prisma/generated/` | — | `../api/generated/prisma/*` |

## UI framework quirks

- **TanStack Router** — route tree is **auto-generated** by `@tanstack/router-plugin/vite` into `src/routeTree.gen.ts`. Never edit this file; instead edit route files in `src/routes/`. Routes use file-based naming convention.
- **Mantine** — PostCSS config (`postcss.config.cjs`) requires `postcss-preset-mantine` + `postcss-simple-vars` for CSS variable breakpoints.
- **Tailwind CSS v4** — configured via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed in v4).
- **TanStack Query** — global defaults set in `App.tsx` (no refetch on mount/focus/reconnect, `staleTime: Infinity`, `retry: false`). Do not add conflicting overrides without checking.
- Auth token stored in `localStorage` key `"token"` (JSON string). Interceptor in `src/api/axios.ts` attaches `Authorization: Bearer` header.

## API framework quirks

- Uses `hono/factory` with `createFactory<AppEnvironment>()` typed factory pattern.
- OpenAPI spec auto-generated via `hono-openapi` builder pattern (`createOpenApiPathBuilder()`).
- Swagger UI at `GET /swagger`, OpenAPI spec at `GET /openapi`.
- Auth middleware has two modes: `useLightAuth()` (JWT verify only) and `useStrictAuth(permissions?)` (fetches user from DB, checks permissions).
- Permissions loaded on startup via `PermissionService.bootstrap()` (upserts any missing into DB).
- Redis caching used via `RedisCache.getOrSetCacheItem`.

## Infrastructure (CI / docker-compose)

- CI workflow (`.github/workflows/bun-test.yml`) mirrors local test flow: MySQL + Redis services → `bun install` → `bun run migrate` → `bun run seed` → `bun run test`.
- `docker-compose.yml` also includes Adminer (`:8080`) for DB inspection.
- MySQL init SQL: `.config/mysql/init.sql`.
- Data volumes: `.data/redis-data`, `.data/mysql` (both in `.gitignore`).
