import {
  EMPTY_CUSTOMER,
  EMPTY_PRICING,
  EMPTY_PROCESSING,
} from "@/config/constants";
import { makePlate } from "@/lib/plates";
import type { Customer, Quotation } from "@/types";

let quotationSeq = 0;

/** Creates a fresh, empty quotation with one starter plate and a unique id. */
export function makeQuotation(): Quotation {
  quotationSeq += 1;
  const now = new Date().toISOString();
  return {
    id: `quote-${Date.now()}-${quotationSeq}`,
    customer: { ...EMPTY_CUSTOMER },
    plates: [makePlate(0)],
    processing: { ...EMPTY_PROCESSING },
    pricing: { ...EMPTY_PRICING },
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
