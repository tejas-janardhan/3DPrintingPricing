// Schema migrations for persisted app data.
//
// Persisted payloads carry a `schemaVersion`. `migrate` reads it and applies
// each migration step in sequence — from the data's current version up to
// `SCHEMA_VERSION` — so upgrading, say, v1 data to v4 runs v1→v2→v3→v4 in order.
// Data with no version marker predates versioning and is treated as v1.
//
// Each step MUST be idempotent, so replaying it (e.g. importing an old backup)
// never corrupts already-migrated data.

export const SCHEMA_VERSION = 3;

/** Version assumed for persisted data that has no `schemaVersion` marker. */
const INITIAL_VERSION = 1;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

type RawData = Record<string, unknown>;

/** A step keyed by version `n` upgrades data from version `n` to `n + 1`. */
const MIGRATIONS: Record<number, (input: RawData) => RawData> = {
  1: migrateV1toV2,
  2: migrateV2toV3,
};

function detectVersion(input: RawData): number {
  return typeof input.schemaVersion === "number"
    ? input.schemaVersion
    : INITIAL_VERSION;
}

/**
 * Upgrades raw parsed JSON to the current `SCHEMA_VERSION` by running each
 * migration step in order, starting from the data's own version. Idempotent:
 * data already at the current version passes through untouched (aside from the
 * version stamp).
 */
export function migrate(input: unknown): unknown {
  if (!isObject(input)) return input;

  let data: RawData = { ...input };
  let version = detectVersion(data);

  while (version < SCHEMA_VERSION) {
    const step = MIGRATIONS[version];
    if (!step) break; // no path forward; stop rather than loop endlessly
    data = step(data);
    version += 1;
  }

  data.schemaVersion = version;
  return data;
}

/**
 * v1 → v2
 * - The single `plate` object became a `plates` array.
 * - `markup` moved from `settings` into `pricing`.
 */
function migrateV1toV2(input: RawData): RawData {
  const next: RawData = { ...input };

  // Legacy single `plate` -> `plates` array (only if not already migrated).
  if (!Array.isArray(next.plates) && isObject(next.plate)) {
    next.plates = [next.plate];
  }
  delete next.plate;

  // Legacy `settings.markup` -> `pricing.markup` (only if not already moved).
  if (isObject(next.settings) && typeof next.settings.markup === "string") {
    const settings = { ...next.settings };
    const markup = settings.markup as string;
    delete settings.markup;
    next.settings = settings;

    const pricing = isObject(next.pricing) ? { ...next.pricing } : {};
    if (typeof pricing.markup !== "string") {
      pricing.markup = markup;
    }
    next.pricing = pricing;
  }

  return next;
}

/**
 * v2 → v3
 * - The single top-level quote (`plates`, `processing`, `pricing`) became a
 *   `quotations` array, each entry pairing a customer with its own quote. The
 *   existing draft is preserved as one initial, customer-less quotation.
 */
function migrateV2toV3(input: RawData): RawData {
  const next: RawData = { ...input };

  // Already migrated: leave the quotations array untouched.
  if (!Array.isArray(next.quotations)) {
    const now = new Date().toISOString();
    next.quotations = [
      {
        id: `quote-${Date.now()}`,
        customer: { name: "", phone: "", address: "" },
        plates: Array.isArray(next.plates) ? next.plates : [],
        processing: isObject(next.processing) ? next.processing : {},
        pricing: isObject(next.pricing) ? next.pricing : {},
        finalPrice: 0,
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  delete next.plates;
  delete next.processing;
  delete next.pricing;

  return next;
}
