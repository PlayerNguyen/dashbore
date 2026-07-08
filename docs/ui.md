# UI Framework Quirks

- **TanStack Router** — route tree is **auto-generated** by `@tanstack/router-plugin/vite` into `src/routeTree.gen.ts`. Never edit this file; instead edit route files in `src/routes/`. Routes use file-based naming convention.
- **Mantine** — PostCSS config (`postcss.config.cjs`) requires `postcss-preset-mantine` + `postcss-simple-vars` for CSS variable breakpoints.
- **Tailwind CSS v4** — configured via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed in v4).
- **TanStack Query** — global defaults set in `App.tsx` (no refetch on mount/focus/reconnect, `staleTime: Infinity`, `retry: false`). Do not add conflicting overrides without checking.
- Auth token stored in `localStorage` key `"token"` (JSON string). Interceptor in `src/api/axios.ts` attaches `Authorization: Bearer` header.
