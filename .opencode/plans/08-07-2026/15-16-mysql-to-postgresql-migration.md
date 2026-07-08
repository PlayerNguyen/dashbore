# Plan: Migrate MySQL to PostgreSQL

## Context

The Dashbore application currently uses **MySQL 8** as its primary database. The goal is to migrate to **PostgreSQL** to leverage its advanced features (JSONB, native arrays, better full-text search, UUID type) and align with modern application standards.

---

## Current State

| Component | Current |
|---|---|
| Database | MySQL 8 |
| ORM | Prisma 7.0.0 |
| Driver Adapter | `@prisma/adapter-mariadb` |
| Connection | `mysql://dashbore:dashbore@localhost:3306/dashbore` |
| Docker Image | `mysql:8` |
| Admin UI | `adminer:latest` |

---

## Target State

| Component | Target |
|---|---|
| Database | PostgreSQL 17 |
| ORM | Prisma 7.0.0 |
| Driver Adapter | `@prisma/adapter-pg` (or native `pg` support) |
| Connection | `postgresql://dashbore:dashbore@localhost:5432/dashbore` |
| Docker Image | `postgres:17` |
| Admin UI | `adminer:latest` (or `dpage/pgadmin4`) |

---

## Implementation Steps

### Step 1: Docker Infrastructure

**File: `docker-compose.yml`**

Replace MySQL service with PostgreSQL:

```yaml
db:
  image: postgres:17
  container_name: dashbore-postgres
  restart: unless-stopped
  ports:
    - "5432:5432"
  environment:
    POSTGRES_USER: dashbore
    POSTGRES_PASSWORD: dashbore
    POSTGRES_DB: dashbore
  volumes:
    - .config/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    - .data/postgres:/var/lib/postgresql/data
  networks:
    - dashbore-network
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U dashbore -d dashbore"]
    interval: 10s
    timeout: 5s
    retries: 5
```

Remove or update the `adminer` service to work with PostgreSQL.

---

### Step 2: PostgreSQL Init Script

**New File: `.config/postgres/init.sql`**

Replace the MySQL init script with PostgreSQL:

```sql
-- Create test database
CREATE DATABASE dashbore_test;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE dashbore TO dashbore;
GRANT ALL PRIVILEGES ON DATABASE dashbore_test TO dashbore;
```

**Delete: `.config/mysql/init.sql`**

---

### Step 3: Prisma Schema

**File: `packages/database/prisma/schema.prisma`**

Change the provider:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "mysql"
  url      = env("DATABASE_URL")
}
```

The rest of the schema remains the same—Prisma handles type mapping automatically.

---

### Step 4: Package Dependencies

**File: `packages/database/package.json`**

```json
{
  "dependencies": {
    "@prisma/adapter-pg": "^7.0.0",
    "@prisma/client": "^7.0.0"
  },
  "devDependencies": {
    "prisma": "^7.0.0"
  }
}
```

Remove `@prisma/adapter-mariadb` and add `@prisma/adapter-pg`.

Run: `bun install`

---

### Step 5: Prisma Client Configuration

**File: `packages/database/src/index.ts`**

Update the driver adapter import:

```typescript
import { PrismaClient } from '../generated';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
```

---

### Step 6: Environment Variables

**Files to update:**

| File | Old | New |
|---|---|---|
| `apps/api/.env.example` | `mysql://dashbore:dashbore@localhost:3306/dashbore` | `postgresql://dashbore:dashbore@localhost:5432/dashbore` |
| `apps/api/.env.test` | `mysql://dashbore:dashbore@localhost:3306/dashbore_test` | `postgresql://dashbore:dashbore@localhost:5432/dashbore_test` |
| `packages/database/prisma.config.ts` | `mysql://dashbore:dashbore@localhost:3306/dashbore` | `postgresql://dashbore:dashbore@localhost:5432/dashbore` |

---

### Step 7: CI/CD Pipeline

**File: `.github/workflows/bun-test.yml`**

Replace MySQL service with PostgreSQL:

```yaml
services:
  postgres:
    image: postgres:17
    env:
      POSTGRES_USER: dashbore
      POSTGRES_PASSWORD: dashbore
      POSTGRES_DB: dashbore_test
    ports:
      - 5432:5432
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

Update the `DATABASE_URL` in the test environment to use PostgreSQL.

---

### Step 8: Reset Migrations

Since Prisma doesn't support cross-provider migrations:

1. Delete `packages/database/prisma/migrations/` folder
2. Delete `packages/database/prisma/migration_lock.toml`
3. Run `bun run migrate` to create fresh PostgreSQL migrations
4. Verify migrations are generated with `provider = "postgresql"` in lock file

---

### Step 9: Seed Script Verification

**File: `packages/database/prisma/seed.ts`**

The seed script uses Prisma Client API and should work as-is. Verify:
- `Bun.password.hashSync()` works (no DB dependency)
- All upsert operations complete successfully

---

### Step 10: Testing

1. Start PostgreSQL: `docker compose up db`
2. Run migrations: `bun run migrate`
3. Seed database: `bun run seed`
4. Run API tests: `bun run test --filter dashbore-api`
5. Verify all CRUD operations work
6. Check Adminer/PGAdmin connectivity

---

## Key Differences: MySQL → PostgreSQL

| Feature | MySQL | PostgreSQL |
|---|---|---|
| Boolean | `TINYINT(1)` | `BOOLEAN` |
| UUID | `CHAR(36)` | `UUID` |
| JSON | `JSON`/`JSONB` | `JSONB` |
| Arrays | Not supported | Native arrays |
| Full-text | `FULLTEXT` index | `tsvector` + `GIN` |
| Serial/Auto-increment | `AUTO_INCREMENT` | `SERIAL`/`GENERATED` |
| case-sensitive | Yes | Yes (by default) |

---

## Rollback Plan

If issues arise:
1. Revert `docker-compose.yml` to MySQL
2. Revert Prisma schema provider to `mysql`
3. Restore `@prisma/adapter-mariadb` dependency
4. Restore MySQL migrations from git history
5. Update environment variables back to MySQL

---

## Verification Checklist

- [ ] Docker PostgreSQL starts successfully
- [ ] PostgreSQL init script creates `dashbore_test` database
- [ ] Prisma schema compiles with `provider = "postgresql"`
- [ ] `bun run generate` produces Prisma Client
- [ ] `bun run migrate` creates tables in PostgreSQL
- [ ] `bun run seed` populates data successfully
- [ ] API starts and connects to PostgreSQL
- [ ] Authentication flow works (login, register)
- [ ] Permission system loads from DB
- [ ] Redis caching still works (independent of DB)
- [ ] All API tests pass
- [ ] CI pipeline runs with PostgreSQL
