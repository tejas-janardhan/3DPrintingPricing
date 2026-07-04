import {
  EMPTY_PLATE,
  EMPTY_PRICING,
  EMPTY_PROCESSING,
  EMPTY_SETTINGS,
  type PlateInputs,
  type PricingInputs,
  type ProcessingInputs,
  type Settings,
} from "@/lib/pricing";

export type AppData = {
  settings: Settings;
  plate: PlateInputs;
  processing: ProcessingInputs;
  pricing: PricingInputs;
};

export const EMPTY_APP_DATA: AppData = {
  settings: EMPTY_SETTINGS,
  plate: EMPTY_PLATE,
  processing: EMPTY_PROCESSING,
  pricing: EMPTY_PRICING,
};

const STORAGE_KEY = "3dpp:app-data:v1";

// We persist to localStorage rather than IndexedDB on purpose: the payload is a
// handful of small form objects, and localStorage's synchronous reads/writes are
// faster and simpler than IndexedDB's async transactions for data this size.
// IndexedDB only pays off for large or binary datasets.

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * Coerces arbitrary parsed JSON into a valid AppData, filling any missing
 * fields from the empty defaults. Doubles as validation for imported backups.
 */
export function mergeAppData(input: unknown): AppData {
  if (!isObject(input)) return EMPTY_APP_DATA;

  const settings = isObject(input.settings) ? input.settings : {};
  const byFilament = isObject(settings.byFilament) ? settings.byFilament : {};

  return {
    settings: {
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
    },
    plate: { ...EMPTY_PLATE, ...(isObject(input.plate) ? input.plate : {}) },
    processing: {
      ...EMPTY_PROCESSING,
      ...(isObject(input.processing) ? input.processing : {}),
    },
    pricing: {
      ...EMPTY_PRICING,
      ...(isObject(input.pricing) ? input.pricing : {}),
    },
  };
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_APP_DATA;
    return mergeAppData(JSON.parse(raw));
  } catch (error) {
    console.warn("Failed to load saved data; starting fresh.", error);
    return EMPTY_APP_DATA;
  }
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    // Best-effort autosave: quota/private-mode failures shouldn't break the UI.
    console.error("Failed to save data to localStorage.", error);
  }
}

// --- Backup import/export -------------------------------------------------

const BACKUP_APP_ID = "3d-printing-pricing";
const BACKUP_VERSION = 1;
const KNOWN_KEYS = ["settings", "plate", "processing", "pricing"] as const;

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
    data,
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

  return mergeAppData(data);
}
