# 3D Printing Pricing

A React + Vite + TypeScript app for calculating 3D print pricing, using Tailwind CSS with shadcn/ui components.

## UI Color Theme

The app uses a **dark card / light text** theme. Cards sit on a dark surface, and all foreground content (titles, labels, input text, descriptions, borders, placeholders, and buttons) is near-white.

Use these conventions on any new UI so it stays consistent:

- **Card surface**: `bg-gray-800` (see [card.tsx](src/components/card.tsx))
- **Foreground text** (titles, labels, input/select text, descriptions): `text-gray-50`
- **Borders** (inputs, select triggers): `border-gray-50`
- **Placeholders**: `placeholder:text-gray-50` for inputs, `data-placeholder:text-gray-50` for select triggers
- **Buttons** (e.g. Edit/Done action): `text-gray-50`

These overrides are applied via `className` on the shadcn base components (which use `cn`/`tailwind-merge`, so the override wins over the component defaults such as `border-input` and `text-muted-foreground`).

### Where it's applied
- [card.tsx](src/components/card.tsx) — `bg-gray-800` surface, `text-gray-50` title
- [fieldInput.tsx](src/components/fieldInput.tsx) — `text-gray-50` on the field, `border-gray-50 placeholder:text-gray-50` on the input, `text-gray-50` description
- [fieldSelect.tsx](src/components/fieldSelect.tsx) — `text-gray-50` on the field, `border-gray-50 data-placeholder:text-gray-50` on the trigger, `text-gray-50` description
- [App.tsx](src/App.tsx) — Edit/Done button uses `text-gray-50`

When adding new fields, buttons, or cards, reuse the `FieldInput` / `FieldSelect` / `Card` wrappers so the theme is inherited automatically.
