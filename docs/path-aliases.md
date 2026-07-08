# Path Aliases

| alias | api (`tsconfig.json`) | ui (`vite.config.js` + `tsconfig.json`) |
|---|---|---|
| `@/` | `src/` | `./src/*` |
| `@common/` | `../../packages/common/src/*` | same |
| `@generated/prisma/` | `generated/prisma/*` | — |
| `@prisma/generated/` | — | `../api/generated/prisma/*` |
