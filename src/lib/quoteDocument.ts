import { formatRs, num, plateQuantity } from "@/lib/pricing";
import { quotationTitle } from "@/lib/quotations";
import { FILAMENT_TYPE_OPTIONS } from "@/config/constants";
import type { Quotation } from "@/types";

const filamentLabel = (value: string) =>
  FILAMENT_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? "—";

/** Formats a quote's createdAt as a readable date. */
const quoteDate = (quotation: Quotation) =>
  new Date(quotation.createdAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/**
 * Customer-facing per-plate prices. The taxed/marked-up total minus shipping is
 * distributed across plates in proportion to each plate's cost share, so the
 * plate prices plus shipping add back up to the final price. No tax/markup is
 * exposed.
 */
export function plateAllocations(quotation: Quotation): {
  shipping: number;
  base: number;
  perPlate: number[];
} {
  const shipping = num(quotation.pricing.shipping);
  const base = Math.max(
    0,
    quotation.finalPricing.finalPriceIncShipping - shipping,
  );
  const lineCosts = quotation.plates.map(
    (plate, index) =>
      (quotation.plateCosts[index]?.plateCost ?? 0) * plateQuantity(plate),
  );
  const total = lineCosts.reduce((sum, cost) => sum + cost, 0);

  let perPlate: number[];
  if (total > 0) {
    perPlate = lineCosts.map((cost) => Math.round((base * cost) / total));
  } else {
    // No cost basis to proportion by — split evenly.
    const each = quotation.plates.length
      ? Math.round(base / quotation.plates.length)
      : 0;
    perPlate = quotation.plates.map(() => each);
  }
  // Push any rounding drift onto the last plate so the parts sum to `base`.
  if (perPlate.length) {
    const drift = base - perPlate.reduce((sum, value) => sum + value, 0);
    perPlate[perPlate.length - 1] += drift;
  }
  return { shipping, base, perPlate };
}

// Palette (RGB), mirroring the app's blue accent.
const BLUE: [number, number, number] = [37, 99, 235];
const DARK: [number, number, number] = [26, 26, 26];
const MUTED: [number, number, number] = [107, 114, 128];

const slugify = (value: string) =>
  value
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "quote";

export type QuotePdfOptions = {
  /** Include the per-plate filament/time/weight details column. */
  includeDetails?: boolean;
};

/** Builds and downloads a stylish, customer-facing PDF quotation. */
export async function openQuotePdf(
  quotation: Quotation,
  options: QuotePdfOptions = {},
): Promise<boolean> {
  const { includeDetails = false } = options;
  try {
    // Lazy-loaded so jsPDF stays out of the initial bundle.
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 48;
    const rightX = pageW - margin;
    const { finalPricing } = quotation;
    const { shipping, base, perPlate } = plateAllocations(quotation);
    let y = margin + 4;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...BLUE);
    doc.text("QUOTATION", margin, y);

    doc.setFontSize(22);
    doc.setTextColor(...DARK);
    y += 22;
    doc.text(quotationTitle(quotation), margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...MUTED);
    doc.text(quoteDate(quotation), rightX, y, { align: "right" });

    y += 12;
    doc.setDrawColor(...BLUE);
    doc.setLineWidth(2);
    doc.line(margin, y, rightX, y);
    y += 26;

    // Customer
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...DARK);
    doc.text(quotation.customer.name.trim() || "—", margin, y);
    const contact = [
      quotation.customer.phone.trim(),
      quotation.customer.address.trim(),
    ]
      .filter(Boolean)
      .join("  ·  ");
    if (contact) {
      y += 15;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...MUTED);
      doc.text(contact, margin, y);
    }
    y += 24;

    // Plate line items (customer-facing prices)
    const head = includeDetails
      ? [["Item", "Details", "Qty", "Amount"]]
      : [["Item", "Qty", "Amount"]];
    const body = quotation.plates.map((plate, index) => {
      const qty = plateQuantity(plate);
      const amount = formatRs(perPlate[index] ?? 0);
      if (!includeDetails) return [plate.name, String(qty), amount];
      const hours = plate.printTimeHours.trim() || "0";
      const minutes = plate.printTimeMinutes.trim() || "0";
      const weight = plate.printWeight.trim() || "0";
      return [
        plate.name,
        `${filamentLabel(plate.filamentType)} · ${hours}h ${minutes}m · ${weight} g`,
        String(qty),
        amount,
      ];
    });
    const columnStyles: Record<
      number,
      {
        fontStyle?: "bold";
        halign?: "right";
        textColor?: [number, number, number];
        fontSize?: number;
      }
    > = includeDetails
      ? {
          0: { fontStyle: "bold" },
          1: { textColor: MUTED, fontSize: 9 },
          2: { halign: "right" },
          3: { halign: "right", fontStyle: "bold" },
        }
      : {
          0: { fontStyle: "bold" },
          1: { halign: "right" },
          2: { halign: "right", fontStyle: "bold" },
        };

    autoTable(doc, {
      startY: y,
      head,
      body,
      theme: "plain",
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: BLUE,
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
        cellPadding: { top: 6, bottom: 6, left: 8, right: 8 },
      },
      bodyStyles: {
        fontSize: 10,
        textColor: DARK,
        cellPadding: { top: 8, bottom: 8, left: 8, right: 8 },
        lineColor: [240, 240, 240],
        lineWidth: { bottom: 1, top: 0, left: 0, right: 0 },
      },
      columnStyles,
    });

    // Totals
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } })
      .lastAutoTable.finalY;
    let ty = finalY + 28;
    const labelX = rightX - 240;

    const totalRow = (label: string, value: string, strong = false) => {
      doc.setFont("helvetica", strong ? "bold" : "normal");
      doc.setFontSize(strong ? 14 : 10);
      doc.setTextColor(...(strong ? DARK : MUTED));
      doc.text(label, labelX, ty);
      doc.setTextColor(...(strong ? BLUE : DARK));
      doc.text(value, rightX, ty, { align: "right" });
      ty += strong ? 4 : 18;
    };

    totalRow("Subtotal", formatRs(base));
    totalRow("Shipping & handling", formatRs(shipping));
    ty += 8;
    doc.setDrawColor(...DARK);
    doc.setLineWidth(1.5);
    doc.line(labelX, ty, rightX, ty);
    ty += 20;
    totalRow("Total", formatRs(finalPricing.finalPriceIncShipping), true);

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}  ·  Prices in INR`,
      pageW / 2,
      doc.internal.pageSize.getHeight() - 36,
      { align: "center" },
    );

    doc.save(`quotation-${slugify(quotationTitle(quotation))}.pdf`);
    return true;
  } catch {
    return false;
  }
}
