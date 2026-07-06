// Schema migrations for persisted app data.
//
// Persisted payloads carry a `schemaVersion`. `migrate` reads it and applies
// each step in sequence up to `SCHEMA_VERSION`. Data with no marker is v1.
// Each step MUST be idempotent. No steps exist yet — add one keyed by the old
// version and bump `SCHEMA_VERSION` when the schema changes.

export const SCHEMA_VERSION = 2;

/** Version assumed for persisted data that has no `schemaVersion` marker. */
const INITIAL_VERSION = 1;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

type RawData = Record<string, unknown>;

const str = (value: unknown): string =>
  typeof value === "string" ? value : "";

/**
 * Reshapes flat v1 settings (labourRate, taxPercent, defaultMarkup, …) into the
 * v2 nested groups. Idempotent: already-nested settings pass through untouched.
 */
function nestSettings(input: unknown): RawData {
  if (!isObject(input)) return {};
  // Already migrated — nested groups present.
  if (isObject(input.operating) || isObject(input.pricing)) return input;
  return {
    ...input,
    business: { name: "", address: "", contactName: "", contactNumber: "" },
    operating: {
      labourRate: str(input.labourRate),
      electricityCost: str(input.electricityCost),
    },
    pricing: {
      multiplier: str(input.multiplier),
      taxPercent: str(input.taxPercent),
      advanceThreshold: str(input.advanceThreshold),
      advancePercent: str(input.advancePercent),
    },
    defaults: {
      markup: str(input.defaultMarkup),
      shipping: str(input.defaultShipping),
      processingMinutes: str(input.defaultProcessingMinutes),
    },
  };
}

/** A step keyed by version `n` upgrades data from version `n` to `n + 1`. */
const MIGRATIONS: Record<number, (input: RawData) => RawData> = {
  // v1 → v2: flat settings become nested groups + a business section.
  1: (data) => {
    const quotations = Array.isArray(data.quotations)
      ? data.quotations.map((q) =>
          isObject(q) && "settings" in q
            ? { ...q, settings: nestSettings(q.settings) }
            : q,
        )
      : data.quotations;
    return {
      ...data,
      settings: nestSettings(data.settings),
      quotations,
    };
  },
};

function detectVersion(input: RawData): number {
  return typeof input.schemaVersion === "number"
    ? input.schemaVersion
    : INITIAL_VERSION;
}

/** Upgrades raw parsed JSON to `SCHEMA_VERSION`, running each step in order. */
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
