# TODO — Upcoming Features

## Quotation Groups
A group of related quotations for one customer, used to present multiple options (e.g. different materials, quality levels, or quantities) side by side.

- [ ] New `QuotationGroup` type: `{ id, name, customer, quotationIds[], createdAt, updatedAt }` in [types/index.ts](src/types/index.ts); add `groups[]` to `AppData` and bump `SCHEMA_VERSION` with a migration in [migrations.ts](src/store/migrations.ts).
- [ ] Customer details live on the group; member quotations share it (decide: move `customer` off `Quotation` for grouped quotes, or keep in sync on edit).
- [ ] Store/context: group CRUD in `AppStateProvider` (`addGroup`, `updateGroup`, `deleteGroup`, `addQuotationToGroup`, `removeQuotationFromGroup`).
- [ ] "Add option" inside a group — creates a new quotation pre-filled with the group's customer; also allow duplicating an existing option into the group as a starting point.
- [ ] Sidebar: show groups as collapsible sections with their quotations nested under them; ungrouped quotes listed as today.
- [ ] Group detail page: comparison view of all options (name, plate count, final price, status) with links to each quote.
- [ ] Status interaction: marking one option **sold** should prompt what to do with sibling options (e.g. leave as quotes / archive).
- [ ] Outdated/locked behavior: duplicating an outdated option keeps the copy in the same group.
- [ ] Backup/import: include groups in serialize/parse in [appData.ts](src/store/appData.ts) and `mergeAppData` coercion; deleting a quotation removes it from its group, deleting a group keeps or deletes members (confirm dialog).

## Other Upcoming Features
- [ ] Archive quotations instead of deleting (hide from sidebar by default).
- [ ] Per-quote notes field for internal remarks.
- [ ] Filament presets management: add/edit custom filament types beyond the built-in options.
- [ ] Multi-printer support in the printer cost helper, with per-plate printer selection.
