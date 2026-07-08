# Setup Biome.js

## Context

The project has zero linting or formatting tooling — no ESLint, no Prettier, no Biome. Adding Biome brings both linting and formatting in a single fast tool, with native Bun support and zero-config setup.

## Current State

- 6-package Bun workspace monorepo (`apps/api`, `apps/ui`, `packages/{business,cache,common,database}`)
- TypeScript `strict` mode as the only code quality measure
- No `lint`/`format` scripts anywhere
- No `.editorconfig`, no `.vscode/settings.json`

## Target State

- `@biomejs/biome` installed as root devDependency
- `biome.json` at root with sensible defaults
- Root scripts: `lint`, `format`, `check`
- All existing code formatted on first run

## Implementation Steps

1. **Install Biome** — `bun add -D -E @biomejs/biome` at root
2. **Generate config** — `bunx --bun @biomejs/biome init` → creates `biome.json`
3. **Tweak `biome.json`** — set `indentStyle: space`, `quoteStyle: single`, `lineWidth: 100`, add `files.ignoreUnknown: true`, ignore generated/prisma and dist dirs
4. **Add root scripts** to root `package.json`:
   - `"lint": "biome lint"`
   - `"lint:fix": "biome lint --write"`
   - `"format": "biome format --write"`
   - `"check": "biome check --write"`
5. **Add `.vscode/settings.json`** recommending Biome extension & setting it as default formatter
6. **Run `bun run check`** — initial format + lint pass across the whole codebase

## Key Considerations

- **Version pinning** — use `-E` to pin Biome version (per Biome docs, pinned versions are important)
- **No `bunfig.toml` change needed** — Biome is standalone
- **Risk:** Initial `biome check --write` will touch many files. Review the diff before committing.
- **CI**: Can add `biome ci` to the GitHub Actions workflow as a follow-up

## Verification Checklist

- [ ] `bun run lint` passes with zero errors
- [ ] `bun run format` formats without errors
- [ ] `bun run check` succeeds
- [ ] `bun run test` still passes after formatting changes
