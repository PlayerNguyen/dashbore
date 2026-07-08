# Development

## Infrastructure (required)

```sh
docker compose up -d    # MySQL :3306, Redis :6379, Adminer :8080
```

## Dev servers

```sh
bun run dev     # concurrently runs dev-api + dev-ui
bun run dev:api # runs `prisma migrate dev` then starts Hono with --watch (:3000)
bun run dev:ui  # Vite dev server (default :5173)
```

## Environment variables

API `.env` (copy `apps/api/.env.example`):
- `DATABASE_URL=mysql://dashbore:dashbore@localhost:3306/dashbore`
- `JWT_SECRET`, `JWT_EXPIRATION_TIME`, `REDIS_URL`

UI `.env` (copy `apps/ui/.env.example`):
- `VITE_API_URL=http://localhost:3000`
