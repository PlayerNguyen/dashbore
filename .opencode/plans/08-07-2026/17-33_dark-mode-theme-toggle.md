# Dark Mode / Theme Toggle

## Context

Dark mode is a core UX expectation. The app should default to dark and let users toggle light/dark from the sidebar footer dropdown — but this depends on the sidebar footer (issues #15/#18) existing first.

## Current State

- `MantineProvider` in `App.tsx:36` has no `colorScheme` prop — defaults to **light** mode
- No `useMantineColorScheme` usage anywhere
- No theme toggle or persistence mechanism
- Only one hardcoded dark token: `bg={"dark.1"}` on `<AppShell.Main>`

## Target State

- Default color scheme: **dark**
- Persisted theme choice in `localStorage` (key: `"theme"`)
- Sidebar footer dropdown (from #18) gets a **"Theme"** sub-item with **Dark** / **Light** options (or a toggle)
- Toggle updates `MantineProvider` color scheme instantly
- All Mantine components auto-adapt; any hardcoded colors reviewed

## Implementation Steps

### Step 1: Update `App.tsx` — set default to dark

Add `defaultColorScheme="dark"` to `MantineProvider`. This makes the app load in dark mode by default.

```tsx
<MantineProvider theme={theme} defaultColorScheme="dark">
```

### Step 2: Create `useThemeStore` (or use `localStorage` directly)

Mantine's `useMantineColorScheme` + `localStorage` handles persistence out of the box if we set `colorScheme` in provider. Actually Mantine v7 uses `localStorage` key `"mantine-color-scheme-value"` by default. We just need to wire the toggle.

If we want a custom key, a small zustand store or a simple wrapper hook:
- Read initial value from `localStorage.getItem("theme")` (fallback `"dark"`)
- On toggle, write to `localStorage` + call `setColorScheme()`

### Step 3: Add Theme toggle to `AppNavbarFooter` (post-#15/#18)

In the footer dropdown (cogwell menu), add between **Settings** and **Logout**:
- **"Theme"** with right-section showing current mode icon (`Sun`/`Moon`)
- Clicking toggles between `"light"` and `"dark"`

### Step 4: Review hardcoded colors for adaptability

Check files for hardcoded color tokens that might not adapt:
- `DasboardLayout/index.tsx:24` — `bg={"dark.1"}` — should use theme-aware token or just remove (Mantine `AppShell.Main` defaults are fine)

## Key Considerations

| Consideration | Detail |
|---|---|
| **Dependency on #15/#18** | This cannot be merged until the sidebar footer exists. Mark the issue as "depends on #15, #18" or queue it. |
| **Mantine auto-adaptation** | Mantine v7 components adapt automatically via CSS variables when `colorScheme` changes. No per-component changes needed. |
| **Tailwind dark mode** | Tailwind v4 uses `@media (prefers-color-scheme: dark)` by default. With Mantine driving the theme, we may want to sync them or rely solely on Mantine. Low risk. |
| **Persistence** | Mantine v7 stores `colorScheme` in `localStorage` key `"mantine-color-scheme-value"` automatically when `defaultColorScheme` is set. |
| **Third-party components** | `react-hot-toast` and `Toaster` — check if they respect dark mode. May need `toastOptions` for dark styling. |

## Verification Checklist

- [ ] App loads in dark mode by default
- [ ] Toggling in sidebar dropdown switches to light instantly
- [ ] Choice persists across page reloads
- [ ] All Mantine components render correctly in both modes
- [ ] Sidebar footer layout isn't broken by the extra menu item
- [ ] `react-hot-toast` toasts are readable in both modes
