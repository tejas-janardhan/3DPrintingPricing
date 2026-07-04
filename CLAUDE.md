# 3D Printing Pricing

A React + Vite + TypeScript app for calculating 3D print pricing, using Tailwind CSS with shadcn/ui components.

## App Structure

Single-page app, client-only — all state lives in `localStorage`, there is no backend.

### Entry & providers
- [main.tsx](src/main.tsx) — mounts the tree, nesting the providers: `ThemeProvider` → `BrowserRouter` → `AppStateProvider` → `App` + `<Toaster />`.
- [App.tsx](src/App.tsx) — wraps everything in [layout/](src/layout/index.tsx) + [nav.tsx](src/components/nav.tsx) and defines the routes; also mounts the `useBackupReminder` hook.

### Routes / pages ([src/pages/](src/pages/))
- `/` → [calculatorPage.tsx](src/pages/calculatorPage.tsx) — the main quote builder: plates, processing, and pricing. Gated behind a "finish settings" alert until global settings are complete.
- `/settings` → [settingsPage.tsx](src/pages/settingsPage.tsx) — global operating rates and per-filament settings.
- `/printer-cost` → [printerCostPage.tsx](src/pages/printerCostPage.tsx) — printer amortization helper (cost/hour from capital + usage).
- `/backup` → [backupPage.tsx](src/pages/backupPage.tsx) — export/import a JSON backup, reset data.
- `*` → redirects to `/`.

### State ([src/store/](src/store/))
- [appStateContext.ts](src/store/appStateContext.ts) — the `AppStateContext` + `useAppState()` hook. Exposes `data` plus setters (`setSettings`, `setPlates`, `setProcessing`, `setPricing`, `setPrinterCost`) and `importData` / `resetData`.
- [AppStateProvider.tsx](src/store/AppStateProvider.tsx) — holds the single `AppData` state object and **autosaves to `localStorage` on every change**.
- [appData.ts](src/store/appData.ts) — `localStorage` persistence (`STORAGE_KEY = "3dpp:app-data"`), `mergeAppData` (coerces/validates unknown JSON into `AppData`), backup serialize/parse, and last-backup fingerprint tracking (`isBackupStale`, `markBackedUp`).
- [migrations.ts](src/store/migrations.ts) — versioned schema migrations. Bump `SCHEMA_VERSION` and add a step keyed by the old version; steps must be idempotent. Currently at v2.

### Domain logic ([src/lib/](src/lib/))
- [pricing.ts](src/lib/pricing.ts) — pure pricing math: `computePlateCost` (per plate) and `computeFinalPricing` (whole quote). `num` / `formatRs` helpers live here.
- [plates.ts](src/lib/plates.ts) — plate helpers (`isPlateComplete`, `defaultPlateName`).
- [settings.ts](src/lib/settings.ts) — settings completeness checks (`isGlobalSettingsComplete`).
- [validators.ts](src/lib/validators.ts) — input validation. [utils.ts](src/lib/utils.ts) — `cn` classname helper.

### Types & config
- [types/index.ts](src/types/index.ts) — all shared types; `AppData` is the root shape: `{ settings, plates[], processing, pricing, printerCost }`.
- [config/constants.ts](src/config/constants.ts) — `EMPTY_*` defaults, filament options, and tunable constants (`MONITORING_RATE`, `SETUP_TIME_MINUTES`, `MAX_PLATES`, `BACKUP_REMINDER_INTERVAL_MS`).

### Components ([src/components/](src/components/))
- Feature cards: [plateCard.tsx](src/components/plateCard.tsx), [platesSection.tsx](src/components/platesSection.tsx), [processingCard.tsx](src/components/processingCard.tsx), [pricingCard.tsx](src/components/pricingCard.tsx), [settingsCard.tsx](src/components/settingsCard.tsx), [printerCostCard.tsx](src/components/printerCostCard.tsx).
- Shared wrappers: [card.tsx](src/components/card.tsx), [form.tsx](src/components/form.tsx), [fieldInput.tsx](src/components/fieldInput.tsx), [fieldSelect.tsx](src/components/fieldSelect.tsx), [nav.tsx](src/components/nav.tsx).
- [ui/](src/components/ui/) — generated shadcn/ui primitives (button, card, input, select, alert, sonner, …). Don't hand-edit unless intentionally customizing a primitive.

### Hooks
- [useBackupReminder.ts](src/hooks/useBackupReminder.ts) — toasts every 30 min when live data differs from the last exported backup.

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
