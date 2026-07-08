# Dashbore

A monorepo dashboard application built with Bun, Hono, React, and PostgreSQL — featuring JWT authentication, role-based access control (RBAC), Redis caching, and auto-generated OpenAPI documentation.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | [Bun](https://bun.sh) v1.2.9+ |
| Backend | [Hono](https://hono.dev) |
| Frontend | [React 19](https://react.dev) + [Vite](https://vitejs.dev) |
| Database | [PostgreSQL 17](https://www.postgresql.org) via [Prisma](https://www.prisma.io) |
| Cache | [Redis 7](https://redis.io) via Bun native client |
| UI Library | [Mantine UI](https://mantine.dev) v7 |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 |
| Routing | [TanStack Router](https://tanstack.com/router) |
| State | [Zustand](https://zustand-demo.pmnd.rs) + [TanStack React Query](https://tanstack.com/query) |
| Validation | [Zod](https://zod.dev) |
| Auth | JWT (HS512) via `jsonwebtoken` + `Bun.password` (bcrypt) |
| Monorepo | Bun workspaces |

## Project Structure

```
dashbore/
├── apps/
│   ├── api/                  # Hono REST API
│   │   └── src/
│   │       ├── builder/      # OpenAPI & pagination builders
│   │       ├── factory/      # App factory & response helpers
│   │       ├── middleware/    # Auth, error, OpenAPI middleware
│   │       ├── routes/       # Auth & user routes
│   │       └── util/         # Pagination & Prisma utilities
│   └── ui/                   # React SPA
│       └── src/
│           ├── api/          # Axios client & API hooks
│           ├── components/   # Shared UI components
│           ├── pages/        # Login & dashboard pages
│           ├── routes/       # TanStack Router file-based routes
│           ├── store/        # Zustand auth store
│           └── theme/        # Mantine theme config
├── packages/
│   ├── business/             # Auth, token, user & permission services
│   ├── cache/                # Redis caching layer
│   ├── common/               # Shared Zod schemas & REST types
│   └── database/             # Prisma client, schema & migrations
└── docker-compose.yml        # PostgreSQL, Redis & Adminer
```

## Features

- **JWT Authentication** — Email/password login with HS512-signed tokens
- **Role-Based Access Control** — Granular permissions (`users:read`, `users:write`, `users:delete`) with light and strict auth middleware
- **Redis Caching** — Generic get-or-set cache with configurable TTL and pattern-based invalidation
- **OpenAPI / Swagger** — Auto-generated API documentation at `/swagger`
- **Paginated Endpoints** — Standardized pagination for list queries
- **Mantine UI** — Modern component library with dark theme, Inter font
- **Responsive Dashboard** — AppShell layout with sidebar navigation
- **Zod Validation** — Shared request/response schemas between API and UI

## Prerequisites

- [Bun](https://bun.sh) v1.2.9+
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose

## Getting Started

1. **Install dependencies**

   ```sh
   bun install
   ```

2. **Start infrastructure** (PostgreSQL, Redis, Adminer)

   ```sh
   docker compose up -d
   ```

3. **Configure environment variables**

   ```sh
   cp apps/api/.env.example apps/api/.env
   cp apps/ui/.env.example apps/ui/.env
   ```

4. **Run migrations and seed the database**

   ```sh
   bun run migrate
   bun run seed
   ```

5. **Start development servers**

   ```sh
   bun run dev
   ```

6. **Access the application**

   | Service | URL |
   |---|---|
   | UI | http://localhost:5173 |
   | API | http://localhost:3000 |
   | Swagger UI | http://localhost:3000/swagger |
   | Adminer | http://localhost:8080 |

### Default Credentials

| User | Email | Password |
|---|---|---|
| Admin | `dashbore@test.com` | `dashbore` |
| User | `user@test.com` | `user` |

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start API + UI dev servers concurrently |
| `bun run build` | Build API + UI for production |
| `bun run test` | Run API + UI test suites |
| `bun run migrate` | Run Prisma migrations |
| `bun run seed` | Seed the database |
| `bun run generate` | Generate Prisma client |

## Environment Variables

### API (`apps/api/.env`)

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | — | PostgreSQL connection string |
| `JWT_SECRET` | — | JWT signing secret |
| `JWT_EXPIRATION_TIME` | `1h` | Token expiration |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| `REDIS_DEFAULT_TTL` | `30000` | Default cache TTL (ms) |
| `PORT` | `3000` | API server port |

### UI (`apps/ui/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (default: `http://localhost:3000`) |

## Testing

Tests use Bun's built-in test runner with a 60% coverage threshold.

```sh
bun run test        # Run all tests
bun run test:api    # API tests only
bun run test:ui     # UI tests only
```

## CI

GitHub Actions (`.github/workflows/bun-test.yml`) runs on push/PR to `master`:
- Spins up PostgreSQL 17 + Redis 7 services
- Installs dependencies, runs migrations, seeds, and tests

## License

MIT
