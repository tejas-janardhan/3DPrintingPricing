# 3D Printing Pricing

A React + Vite + TypeScript app for calculating 3D print pricing, using Tailwind CSS with shadcn/ui components.

## UI Color Theme

The app uses **shadcn semantic color tokens** with a **Blue** accent palette, and supports **light and dark mode**. The palette is defined once as CSS variables in [index.css](src/index.css) (`:root` for light, `.dark` for dark) and every component consumes the semantic tokens — never hardcoded Tailwind colors like `gray-*`, `bg-white`, or `text-black`.

### Rules
- **Never** use fixed Tailwind palette colors (`gray-*`, `slate-*`, `white`, `black`, `red-400`, …) for surfaces, text, or borders. They break light/dark mode.
- Use semantic tokens instead:
  - **Surfaces**: `bg-background` (page), `bg-card` (cards), `bg-popover`, `bg-muted`, `bg-accent`
  - **Text**: default inherits `text-foreground`; use `text-muted-foreground` for secondary text, `text-primary` for accent, `text-destructive` for errors
  - **Borders**: `border` / `border-border`, `border-input` on inputs; focus rings use `ring` / `border-ring`
  - **Buttons**: use the shadcn `Button` `variant` prop (`outline`, `ghost`, `destructive`, …) rather than color classes
- To change the accent, edit the `--primary` / `--accent` / `--ring` / `--chart-1` variables in [index.css](src/index.css) — nothing else.

### Light/dark mode
- [theme-provider.tsx](src/components/theme-provider.tsx) — holds the theme, toggles the `.dark` class on `<html>`, and persists the choice to `localStorage` (falls back to the OS preference). Wraps the app in [main.tsx](src/main.tsx).
- [themeToggle.tsx](src/components/themeToggle.tsx) — sun/moon icon button, rendered in [nav.tsx](src/components/nav.tsx).
- Use `useTheme()` if a component needs the current theme (e.g. [ui/sonner.tsx](src/components/ui/sonner.tsx)).

When adding new fields, buttons, or cards, reuse the `FieldInput` / `FieldSelect` / `Card` wrappers so the tokens are inherited automatically.
