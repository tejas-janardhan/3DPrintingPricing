# 3D Printing Pricing

A React + Vite + TypeScript app for calculating 3D print pricing, using Tailwind CSS with shadcn/ui components.

**Keep code comments terse — a single short line where one is needed; avoid multi-line block comments unless truly necessary.**

## App Structure

Single-page app, client-only — all state lives in `localStorage`, there is no backend.

### Entry & providers
- [main.tsx](src/main.tsx) — mounts the tree, nesting the providers: `ThemeProvider` → `BrowserRouter` → `AppStateProvider` → `App` + `<Toaster />`.
- [App.tsx](src/App.tsx) — wraps everything in [layout/](src/layout/index.tsx) + [nav.tsx](src/components/nav.tsx) and defines the routes; also mounts the `useBackupReminder` hook.

### Routes / pages ([src/pages/](src/pages/))
The quotations section is a two-pane layout: [quotationsLayout.tsx](src/pages/quotationsLayout.tsx) renders a persistent left sidebar ([quotationsSidebar.tsx](src/components/quotationsSidebar.tsx) — quote list + "Add quote") beside a routed `<Outlet />`. Its child routes:
- `/` → [quotationsEmpty.tsx](src/pages/quotationsEmpty.tsx) — placeholder prompting you to pick or create a quotation.
- `/quote/:id` → [quoteDetailPage.tsx](src/pages/quoteDetailPage.tsx) — read-only summary card (customer, plate costs, pricing breakdown) with **Edit**, **Delete** (shadcn `AlertDialog` confirm), and — when the quote is outdated — **Duplicate** instead of Edit.
- `/quote/:id/edit` → [quoteFormPage.tsx](src/pages/quoteFormPage.tsx) — the quote builder (customer details, plates, processing, pricing). Autosaves on every edit; prices against the quotation's own `settings` snapshot. Redirects to the detail view if the quote is outdated (locked). Sections gate behind a "finish settings" alert until global settings are complete.
- `/settings` → [settingsPage.tsx](src/pages/settingsPage.tsx) — global operating rates and per-filament settings.

A quotation is **outdated/locked** when its `settings` snapshot differs from the current global settings ([`areSettingsEqual`](src/lib/settings.ts)) — it can't be edited, only viewed or duplicated (a copy under current settings, via `duplicateQuotation`).
- `/printer-cost` → [printerCostPage.tsx](src/pages/printerCostPage.tsx) — printer amortization helper (cost/hour from capital + usage).
- `/backup` → [backupPage.tsx](src/pages/backupPage.tsx) — export/import a JSON backup, reset data.
- `*` → redirects to `/`.

### State ([src/store/](src/store/))
- [appStateContext.ts](src/store/appStateContext.ts) — the `AppStateContext` + `useAppState()` hook. Exposes `data`, global setters (`setSettings`, `setPrinterCost`), quotation CRUD (`addQuotation` → new id, `duplicateQuotation(id)` → new id, `updateQuotation(id, patch)`, `deleteQuotation`), and `importData` / `resetData`.
- [AppStateProvider.tsx](src/store/AppStateProvider.tsx) — holds the single `AppData` state object and **autosaves to `localStorage` on every change**. `add`/`duplicate`/`updateQuotation` recompute each quotation's `finalPrice` snapshot from that quotation's own `settings`.
- [appData.ts](src/store/appData.ts) — `localStorage` persistence (`STORAGE_KEY = "3dpp:app-data"`), `mergeAppData` (coerces/validates unknown JSON into `AppData`, including each quotation's settings snapshot), backup serialize/parse, and last-backup fingerprint tracking (`isBackupStale`, `markBackedUp`).
- [migrations.ts](src/store/migrations.ts) — versioned schema migrations. Bump `SCHEMA_VERSION` and add a step keyed by the old version; steps must be idempotent. Currently at v1 with no steps (the `quotations` shape is the baseline).

### Domain logic ([src/lib/](src/lib/))
- [pricing.ts](src/lib/pricing.ts) — pure pricing math: `computePlateCost` (per plate) and `computeFinalPricing` (whole quote). `num` / `formatRs` helpers live here.
- [plates.ts](src/lib/plates.ts) — plate helpers (`isPlateComplete`, `defaultPlateName`, `makePlate`).
- [quotations.ts](src/lib/quotations.ts) — quotation helpers (`makeQuotation`, `duplicateQuotation`, `isCustomerComplete`, `quotationTitle`).
- [settings.ts](src/lib/settings.ts) — settings completeness checks (`isGlobalSettingsComplete`) plus `cloneSettings` / `areSettingsEqual` (snapshot compare).
- [validators.ts](src/lib/validators.ts) — input validation. [utils.ts](src/lib/utils.ts) — `cn` classname helper.

### Types & config
- [types/index.ts](src/types/index.ts) — all shared types; `AppData` is the root shape: `{ settings, quotations[], printerCost }`. A `Quotation` is `{ id, customer, settings, plates[], processing, pricing, finalPrice, createdAt, updatedAt }` (`settings` is a per-quote snapshot); `Customer` is `{ name, phone, address }` (address optional).
- [config/constants.ts](src/config/constants.ts) — `EMPTY_*` defaults, filament options, and tunable constants (`MONITORING_RATE`, `SETUP_TIME_MINUTES`, `MAX_PLATES`, `BACKUP_REMINDER_INTERVAL_MS`).

### Components ([src/components/](src/components/))
- Feature cards: [plateCard.tsx](src/components/plateCard.tsx), [platesSection.tsx](src/components/platesSection.tsx), [processingCard.tsx](src/components/processingCard.tsx), [pricingCard.tsx](src/components/pricingCard.tsx), [settingsCard.tsx](src/components/settingsCard.tsx), [printerCostCard.tsx](src/components/printerCostCard.tsx).
- Feature fields: [customerFields.tsx](src/components/customerFields.tsx) (name/phone/address for a quotation).
- Quotations UI: [quotationsSidebar.tsx](src/components/quotationsSidebar.tsx) (list + add), [quoteNotFound.tsx](src/components/quoteNotFound.tsx) (shared 404 card).
- Shared wrappers: [card.tsx](src/components/card.tsx), [form.tsx](src/components/form.tsx), [fieldInput.tsx](src/components/fieldInput.tsx), [fieldSelect.tsx](src/components/fieldSelect.tsx), [nav.tsx](src/components/nav.tsx).
- [ui/](src/components/ui/) — generated shadcn/ui primitives (button, card, input, select, alert, alert-dialog, sonner, …). Don't hand-edit unless intentionally customizing a primitive. (`button` was customized to support `asChild` via radix `Slot`.)

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
