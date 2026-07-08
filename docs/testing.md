# Testing

```sh
bun run test       # runs all tests with coverage (root)
bun run test:api   # API only — runs migrate → seed → bun test
bun run test:ui    # UI only — bun test
```

## API test quirks

- Test script: `cross-env NODE_ENV=test bun run migrate && bun run seed && bun test --preload ./tests/preload.ts`
- Requires MySQL + Redis running (`docker compose up -d`)
- Uses `apps/api/.env.test` (connects to `dashbore_test` database)
- Preload (`tests/preload.ts`) bootstraps permissions then logs in test user `dashbore@test.com` / `dashbore`
- Coverage threshold: 60% (`bunfig.toml` in both root and api)
- Test files go in `apps/api/tests/`, they import from `@/` (api) and `@common/`
