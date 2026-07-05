import { EMPTY_APP_DATA, EMPTY_CUSTOMER, EMPTY_PLATE, EMPTY_PRICING, EMPTY_PRINTER_COST, EMPTY_PROCESSING, EMPTY_SETTINGS } from "@/config/constants";
import { defaultPlateName } from "@/lib/plates";
import { toast } from "sonner";
import { migrate, SCHEMA_VERSION } from "./migrations";
import type { AppData, Customer, PlateInputs, PricingInputs, PrinterCostInputs, Quotation, Settings } from "@/types";

export type { AppData } from "@/types";

// The persisted payload carries its own `schemaVersion`, so the key is stable
// across schema versions. Older, version-suffixed keys are relocated once.
const STORAGE_KEY = "3dpp:app-data";

// We persist to localStorage rather than IndexedDB on purpose: the payload is a
// handful of small form objects, and localStorage's synchronous reads/writes are
// faster and simpler than IndexedDB's async transactions for data this size.
// IndexedDB only pays off for large or binary datasets.

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * Coerces arbitrary parsed JSON (already at the current schema version) into a
 * valid AppData, filling any missing fields from the empty defaults. Doubles as
 * validation for imported backups. Cross-version upgrades belong in `migrate`.
 */
/** Coerces raw settings into a valid Settings, filling defaults. */
function mergeSettings(input: unknown): Settings {
  const settings = isObject(input) ? input : {};
  const byFilament = isObject(settings.byFilament) ? settings.byFilament : {};
  return {
    ...EMPTY_SETTINGS,
    ...(settings as Partial<Settings>),
    byFilament: {
      pla: {
        ...EMPTY_SETTINGS.byFilament.pla,
        ...(isObject(byFilament.pla) ? byFilament.pla : {}),
      },
      petg: {
        ...EMPTY_SETTINGS.byFilament.petg,
        ...(isObject(byFilament.petg) ? byFilament.petg : {}),
      },
    },
  };
}

/** Coerces one raw plate into a valid PlateInputs, filling defaults. */
function mergePlate(plate: unknown, index: number): PlateInputs {
  const source = isObject(plate) ? plate : {};
  return {
    ...EMPTY_PLATE,
    ...(source as Partial<PlateInputs>),
    id:
      typeof source.id === "string" && source.id
        ? source.id
        : `plate-${index + 1}`,
    name:
      typeof source.name === "string" && source.name
        ? source.name
        : defaultPlateName(index),
  };
}

/** Coerces a raw quotation into a valid Quotation; settings fall back to global. */
function mergeQuotation(
  input: unknown,
  index: number,
  fallbackSettings: Settings,
): Quotation {
  const source = isObject(input) ? input : {};
  const customer = isObject(source.customer) ? source.customer : {};

  const rawPlates = Array.isArray(source.plates) ? source.plates : [];
  const plates = (rawPlates.length ? rawPlates : [EMPTY_PLATE]).map(mergePlate);

  const now = new Date().toISOString();
  return {
    id:
      typeof source.id === "string" && source.id
        ? source.id
        : `quote-${index + 1}`,
    name: typeof source.name === "string" ? source.name : "",
    customer: {
      ...EMPTY_CUSTOMER,
      ...(customer as Partial<Customer>),
    },
    settings: "settings" in source ? mergeSettings(source.settings) : fallbackSettings,
    plates,
    processing: {
      ...EMPTY_PROCESSING,
      ...(isObject(source.processing) ? source.processing : {}),
    },
    pricing: {
      ...EMPTY_PRICING,
      ...(isObject(source.pricing) ? (source.pricing as Partial<PricingInputs>) : {}),
    },
    finalPrice:
      typeof source.finalPrice === "number" && Number.isFinite(source.finalPrice)
        ? source.finalPrice
        : 0,
    createdAt: typeof source.createdAt === "string" ? source.createdAt : now,
    updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : now,
  };
}

export function mergeAppData(input: unknown): AppData {
  if (!isObject(input)) return EMPTY_APP_DATA;

  const settings = mergeSettings(input.settings);
  const rawQuotations = Array.isArray(input.quotations) ? input.quotations : [];

  return {
    settings,
    quotations: rawQuotations.map((q, index) =>
      mergeQuotation(q, index, settings),
    ),
    printerCost: {
      ...EMPTY_PRINTER_COST,
      ...(isObject(input.printerCost)
        ? (input.printerCost as Partial<PrinterCostInputs>)
        : {}),
    },
  };
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // `migrate` is version-gated: a no-op once the stored data is current, and
    // the path that upgrades older-but-current-key data to a newer schema.
    if (raw) return mergeAppData(migrate(JSON.parse(raw)));

    return EMPTY_APP_DATA;
  } catch (error) {
    console.warn("Failed to load saved data; starting fresh.", error);
    // Deferred so the toast fires after the <Toaster /> has mounted (loadAppData
    // runs during the initial render, before the tree is committed).
    setTimeout(() => {
      toast.warning("Couldn't load your saved data", {
        description: "Starting with a fresh set of inputs.",
      });
    }, 0);
    return EMPTY_APP_DATA;
  }
}

/**
 * Stamps the current schema version onto the data so that persisted payloads
 * and exported backups are self-describing — `migrate` reads it to resume from
 * the right version instead of assuming the oldest.
 */
function stampVersion(data: AppData): AppData & { schemaVersion: number } {
  return { ...data, schemaVersion: SCHEMA_VERSION };
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stampVersion(data)));
  } catch (error) {
    // Best-effort autosave: quota/private-mode failures shouldn't break the UI.
    console.error("Failed to save data to localStorage.", error);
  }
}

// --- Last-backup tracking -------------------------------------------------

// Fingerprint of the app data as it stood when the user last exported a backup.
// Compared against the live data to know whether unsaved work is at risk.
const LAST_BACKUP_KEY = "3dpp:last-backup";

/**
 * A stable, content-based fingerprint of the app data (schema version included,
 * export timestamp excluded) so two snapshots with identical inputs compare equal.
 */
function dataFingerprint(data: AppData): string {
  return JSON.stringify(stampVersion(data));
}

/** Records the current data as the last-exported state. Best-effort. */
export function markBackedUp(data: AppData): void {
  try {
    localStorage.setItem(LAST_BACKUP_KEY, dataFingerprint(data));
  } catch (error) {
    console.error("Failed to record last-backup state.", error);
  }
}

/**
 * Whether the live data differs from the last exported backup — i.e. there is
 * unsaved work that would be lost. With no backup ever taken, only non-empty
 * data counts as stale (so a pristine app doesn't nag).
 */
export function isBackupStale(data: AppData): boolean {
  let last: string | null = null;
  try {
    last = localStorage.getItem(LAST_BACKUP_KEY);
  } catch {
    // If we can't read the marker, fall through to the empty-data baseline.
  }
  const baseline = last ?? dataFingerprint(EMPTY_APP_DATA);
  return dataFingerprint(data) !== baseline;
}

// --- Backup import/export -------------------------------------------------

const BACKUP_APP_ID = "3d-printing-pricing";
// Version of the backup *envelope* (the { app, version, exportedAt, data }
// wrapper) — independent of the data's SCHEMA_VERSION, which is carried inside
// `data` itself. Only bump this if the wrapper structure changes.
const BACKUP_VERSION = 1;
const KNOWN_KEYS = ["settings", "quotations", "printerCost"] as const;

export type Backup = {
  app: string;
  version: number;
  exportedAt: string;
  data: AppData;
};

export function serializeBackup(data: AppData): string {
  const backup: Backup = {
    app: BACKUP_APP_ID,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: stampVersion(data),
  };
  return JSON.stringify(backup, null, 2);
}

/**
 * Parses and validates a backup file's text, returning clean AppData.
 * Throws an Error with a user-friendly message on any problem.
 */
export function parseBackup(text: string): AppData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("The file is not valid JSON.");
  }

  if (!isObject(parsed)) {
    throw new Error("The backup file has an unexpected format.");
  }

  if ("app" in parsed && parsed.app !== BACKUP_APP_ID) {
    throw new Error("This backup was created by a different app.");
  }

  // Accept either a wrapped backup ({ app, version, data }) or a raw AppData object.
  const data = isObject(parsed.data) ? parsed.data : parsed;

  if (!KNOWN_KEYS.some((key) => key in data)) {
    throw new Error("The backup file does not contain any pricing data.");
  }

  // Backups may predate the current schema; migrate before merging.
  return mergeAppData(migrate(data));
}
