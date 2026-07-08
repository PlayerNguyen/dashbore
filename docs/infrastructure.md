# Infrastructure

## CI

CI workflow (`.github/workflows/bun-test.yml`) mirrors local test flow: MySQL + Redis services → `bun install` → `bun run migrate` → `bun run seed` → `bun run test`.

## Docker Compose

`docker-compose.yml` includes:
- MySQL (`:3306`)
- Redis (`:6379`)
- Adminer (`:8080`) for DB inspection

MySQL init SQL: `.config/mysql/init.sql`.

Data volumes: `.data/redis-data`, `.data/mysql` (both in `.gitignore`).
