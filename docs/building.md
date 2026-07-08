# Building

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
