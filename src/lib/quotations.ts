import {
  EMPTY_CUSTOMER,
  EMPTY_PRICING,
  EMPTY_PROCESSING,
} from "@/config/constants";
import { makePlate } from "@/lib/plates";
import { cloneSettings } from "@/lib/settings";
import type { Customer, PlateInputs, Quotation, Settings } from "@/types";

let quotationSeq = 0;

function newQuotationId(): string {
  quotationSeq += 1;
  return `quote-${Date.now()}-${quotationSeq}`;
}

/** Fresh empty quotation with one starter plate and a snapshot of `settings`. */
export function makeQuotation(settings: Settings): Quotation {
  const now = new Date().toISOString();
  return {
    id: newQuotationId(),
    customer: { ...EMPTY_CUSTOMER },
    settings: cloneSettings(settings),
    plates: [makePlate(0)],
    processing: { ...EMPTY_PROCESSING },
    pricing: { ...EMPTY_PRICING },
    finalPrice: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/** Copies a quotation under new `settings`, with regenerated ids. */
export function duplicateQuotation(
  source: Quotation,
  settings: Settings,
): Quotation {
  const now = new Date().toISOString();
  const id = newQuotationId();
  const plates: PlateInputs[] = source.plates.map((plate, index) => ({
    ...plate,
    id: `${id}-plate-${index + 1}`,
  }));
  return {
    id,
    customer: { ...source.customer },
    settings: cloneSettings(settings),
    plates,
    processing: { ...source.processing },
    pricing: { ...source.pricing },
    finalPrice: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * A quotation's customer is complete once it has a name and a phone number.
 * Address is optional.
 */
export function isCustomerComplete(customer: Customer): boolean {
  return customer.name.trim() !== "" && customer.phone.trim() !== "";
}

/** Display title for a quotation: the customer's name, or a fallback. */
export function quotationTitle(quotation: Quotation): string {
  return quotation.customer.name.trim() || "Untitled quotation";
}
