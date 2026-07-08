# Sidebar: Config-driven, Searchable, Compact Mode & Footer Dropdown

## Context

Refactor the sidebar from hard-coded inline links into a configurable, searchable, compact-mode-enabled component with a footer dropdown. This makes the sidebar data-driven, scalable, and feature-complete.

## Current State

- Nav link data is **hard-coded inline** in `AppNavbar.tsx` (lines 26–66)
- `AppNavbarLink` type is defined locally in the same file
- Search input renders but **doesn't actually filter** — `searchValue` is unused in the render logic
- No compact/icon-only mode exists
- No footer/settings dropdown exists
- Sidebar width is fixed at 200px
- Header is an empty fragment
- No `src/configs/` directory or `configureSidebar.tsx` file exists

## Target State

New file structure:
```
apps/ui/src/
├── configs/
│   └── configureSidebar.tsx    ← sidebar item config (JS object array)
├── types/
│   └── sidebar.ts              ← shared types extracted from AppNavbar
└── pages/DasboardLayout/components/
    ├── AppNavbar.tsx            ← refactored (reads config, renders)
    ├── AppNavbarFooter.tsx      ← NEW: cogwell button + dropdown menu
    └── AppNavbarLinkGroup.tsx   ← NEW: recursive link renderer
```

Key behaviors:
- **Config file** (`configureSidebar.tsx`) exports `const sidebarItems: AppNavbarLink[] = [...]`
- **Search** filters items by label text and `keywords[]`, also filters inside expanded nested groups
- **Compact mode** — a toggle (button in footer or header) reduces navbar width to ~60px, hides labels, shows only icons; hover on icon reveals tooltip label
- **Nested sub-items** — already supported via recursive rendering, just extracted
- **Footer** — `<AppShell.Section>` with a divider, then a cogwell icon button; clicking opens a `Menu` dropdown (Mantine `Menu`) with items for Settings, Keyboard shortcuts, and Logout

## Implementation Steps

### Step 1: Create shared types `src/types/sidebar.ts`

Extract the `AppNavbarLink` type from `AppNavbar.tsx` into a dedicated type file. Add optional `icon` field at the top level (separate from `navLinkProps`) for compact mode rendering.

### Step 2: Create `src/configs/configureSidebar.tsx`

Move the hard-coded nav link array into this file. Export as `sidebarItems`. Use `@/types/sidebar` types. Add keywords for search support. This is the single source of truth for nav structure.

### Step 3: Create `AppNavbarFooter.tsx`

- Renders Mantine `AppShell.Section` at the bottom of the navbar
- Contains a `Divider` then a centered cogwell `ActionIcon`
- Click opens a `Menu` dropdown with items:
  - **Settings** → `/dashboard/settings` (or placeholder)
  - **Logout** → calls `useAuthStore.setAuthenticated(false)` + clears localStorage
- Accepts `compact` prop to adjust styling

### Step 4: Create `AppNavbarLinkGroup.tsx`

Recursive link rendering extracted from `AppNavbar.tsx`. Props: `links`, `searchValue`, `location`, `compact`. In compact mode, renders only the icon with a `Tooltip` for the label. Uses `useMemo` for performance.

### Step 5: Refactor `AppNavbar.tsx`

- Import `sidebarItems` from `@/configs/configureSidebar`
- Import `AppNavbarLinkGroup` and `AppNavbarFooter`
- Accept `compact` and `onToggleCompact` props (or manage state via lifting state up from layout)
- Implement actual search filtering: filter `sidebarItems` based on `searchValue` matching `navLinkProps.label` text or `keywords[]`
- Conditionally render compact or full mode
- Use `AppShell.Section` with `grow` for the links area and `AppShell.Section` for the footer

### Step 6: Update `DasboardLayout/index.tsx`

- Add `compact` state (useState, default false)
- Pass `compact` and `onToggleCompact` to `AppNavbar`
- Adjust `navbar.width` dynamically: `compact ? 60 : 200`

### Step 7: Create `/dashboard/settings` route (optional placeholder)

If the Settings link should navigate somewhere, add a stub route file. Otherwise link to `#` or just close the menu.

## Key Considerations

| Consideration | Detail |
|---|---|
| **Mantine `NavLink` in compact mode** | Mantine `NavLink` can show icon-only if `label` is hidden. Use `Tooltip` to show label on hover. For sub-items in compact mode, consider showing a flyout/popover instead of inline children. |
| **Search + compact interaction** | In compact mode, search can be a small icon button that expands into a popover, or simply hidden. Default: search is hidden in compact mode. |
| **State management** | Keep it simple — `useState` in `DashboardLayout` is enough. Only promote to zustand if header also needs access to compact state. |
| **Active route highlighting** | Still works via `location.pathname === link.url`. In compact mode, active state shows on the icon wrapper. |
| **Footer dropdown** | Use Mantine `Menu` with `position="right-start"` so it opens to the right of the cogwell. |
| **Logout** | Should also clear any cached queries (use `queryClient.clear()`) — already configured globally in `App.tsx`. |

## Verification Checklist

- [ ] `bun run --filter=dashbore-ui dev` starts without errors
- [ ] Sidebar renders nav items from `configureSidebar.tsx`
- [ ] Search filters items (and nested children) correctly
- [ ] Compact mode toggles — navbar shrinks, icons only, tooltips work
- [ ] Footer cogwell opens dropdown with Settings + Logout
- [ ] Logout clears auth state and redirects to login
- [ ] Nested sub-items expand/collapse in full mode
- [ ] Active link highlighting works in both modes
