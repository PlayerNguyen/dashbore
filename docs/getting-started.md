# Getting Started

## Runtime & package manager

- **Bun** everywhere (v1.2.9+). Do not use npm/pnpm/yarn.
- Root `package.json` uses **Bun workspaces** (`"workspaces": ["apps/*", "packages/*"]`).

## Monorepo structure

| package | path | stack |
|---|---|---|
| `@dashbore/api` | `apps/api/` | Hono + Prisma (MySQL) + JWT + Redis |
| `@dashbore/ui` | `apps/ui/` | React 19 + Vite + TanStack Router + Mantine UI + Tailwind v4 + Zustand + TanStack Query |
| `@dashbore/common` | `packages/common/` | Shared Zod schemas, re-exported through `@common/index` |

## Installation

```sh
bun install    # single root install — workspaces handle the rest
```

`bun install` auto-runs `postinstall` scripts per workspace (prisma generate, etc). No special ordering needed.
