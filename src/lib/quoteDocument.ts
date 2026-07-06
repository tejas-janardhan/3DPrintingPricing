import { formatRs, num, plateQuantity } from "@/lib/pricing";
import { quotationTitle } from "@/lib/quotations";
import { registerQuoteFont } from "@/lib/quoteFont";
import { FILAMENT_TYPE_OPTIONS } from "@/config/constants";
import type { Quotation } from "@/types";

// jsPDF font family registered by registerQuoteFont; falls back to helvetica.
const FONT = "Poppins";

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

// Palette (RGB), mirroring the app's blue accent. Dual-tone: a primary blue
// paired with a deep navy and soft tints for bands, panels and striping.
const BLUE: [number, number, number] = [37, 99, 235];
const BLUE_DARK: [number, number, number] = [30, 58, 138];
const BLUE_LIGHT: [number, number, number] = [191, 219, 254];
const BLUE_50: [number, number, number] = [239, 246, 255];
const WHITE: [number, number, number] = [255, 255, 255];
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
    registerQuoteFont(doc);
    doc.setFont(FONT, "normal");
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 48;
    const rightX = pageW - margin;
    const { finalPricing } = quotation;
    const { shipping, base, perPlate } = plateAllocations(quotation);

    // Draws small, letter-spaced uppercase labels (eyebrows). Right alignment
    // is done manually because jsPDF's align ignores char spacing, which would
    // push the label past the margin and misalign it with other right edges.
    const charSpace = 1.6;
    const eyebrow = (
      text: string,
      x: number,
      yy: number,
      color: [number, number, number],
      align: "left" | "right" = "left",
    ) => {
      doc.setFont(FONT, "bold");
      doc.setFontSize(8);
      doc.setTextColor(...color);
      doc.setCharSpace(charSpace);
      const spacedWidth =
        doc.getTextWidth(text) + charSpace * (text.length - 1);
      doc.text(text, align === "right" ? x - spacedWidth : x, yy);
      doc.setCharSpace(0);
    };

    // Full-bleed header band with a lighter accent stripe beneath it.
    const bandH = 116;
    doc.setFillColor(...BLUE_DARK);
    doc.rect(0, 0, pageW, bandH, "F");
    doc.setFillColor(...BLUE);
    doc.rect(0, bandH, pageW, 5, "F");

    eyebrow("QUOTATION", margin, 48, BLUE_LIGHT);
    doc.setFont(FONT, "bold");
    doc.setFontSize(22);
    doc.setTextColor(...WHITE);
    doc.text(quotationTitle(quotation), margin, 78, {
      maxWidth: pageW - margin * 2 - 130,
    });

    eyebrow("DATE", rightX, 48, BLUE_LIGHT, "right");
    doc.setFont(FONT, "normal");
    doc.setFontSize(11);
    doc.setTextColor(...WHITE);
    doc.text(quoteDate(quotation), rightX, 64, { align: "right" });

    const blockTop = bandH + 5 + 42;
    let y = blockTop;

    // Customer ("Billed to")
    eyebrow("BILLED TO", margin, y, MUTED);
    y += 17;
    doc.setFont(FONT, "bold");
    doc.setFontSize(13);
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
      doc.setFont(FONT, "normal");
      doc.setFontSize(10);
      doc.setTextColor(...MUTED);
      doc.text(contact, margin, y);
    }

    // Business ("From") — right-aligned, from the global business settings.
    const { business } = quotation.settings;
    if (business.name.trim() || business.address.trim()) {
      let by = blockTop;
      eyebrow("FROM", rightX, by, MUTED, "right");
      by += 17;
      doc.setFont(FONT, "bold");
      doc.setFontSize(13);
      doc.setTextColor(...DARK);
      doc.text(business.name.trim() || "—", rightX, by, { align: "right" });
      const businessLines = [
        business.address.trim(),
        [business.contactName.trim(), business.contactNumber.trim()]
          .filter(Boolean)
          .join("  ·  "),
      ].filter(Boolean);
      doc.setFont(FONT, "normal");
      doc.setFontSize(10);
      doc.setTextColor(...MUTED);
      for (const line of businessLines) {
        by += 15;
        doc.text(line, rightX, by, { align: "right", maxWidth: 240 });
      }
      y = Math.max(y, by);
    }
    y += 30;

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
          3: { halign: "right", fontStyle: "bold", textColor: BLUE_DARK },
        }
      : {
          0: { fontStyle: "bold" },
          1: { halign: "right" },
          2: { halign: "right", fontStyle: "bold", textColor: BLUE_DARK },
        };

    eyebrow("ITEMS", margin, y, BLUE);
    autoTable(doc, {
      startY: y + 10,
      head,
      body,
      theme: "plain",
      styles: { font: FONT },
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: BLUE,
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
        cellPadding: { top: 8, bottom: 8, left: 10, right: 10 },
      },
      bodyStyles: {
        fontSize: 10,
        textColor: DARK,
        cellPadding: { top: 9, bottom: 9, left: 10, right: 10 },
        lineColor: BLUE_LIGHT,
        lineWidth: { bottom: 0.5, top: 0, left: 0.5, right: 0.5 },
      },
      alternateRowStyles: { fillColor: BLUE_50 },
      columnStyles,
    });

    // Totals panel (right-aligned)
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } })
      .lastAutoTable.finalY;
    const panelW = 250;
    const panelX = rightX - panelW;
    const padX = 16;
    let ty = finalY + 34;

    // A single label/value line within the panel.
    const totalRow = (label: string, value: string) => {
      doc.setFont(FONT, "normal");
      doc.setFontSize(10);
      doc.setTextColor(...MUTED);
      doc.text(label, panelX + padX, ty);
      doc.setTextColor(...DARK);
      doc.text(value, rightX - padX, ty, { align: "right" });
      ty += 20;
    };

    totalRow("Subtotal", formatRs(base));
    totalRow("Shipping & handling", formatRs(shipping));

    // Hero total box
    ty += 4;
    const boxH = 44;
    doc.setFillColor(...BLUE_DARK);
    doc.roundedRect(panelX, ty, panelW, boxH, 8, 8, "F");
    const boxMid = ty + boxH / 2 + 5;
    doc.setFont(FONT, "bold");
    doc.setFontSize(11);
    doc.setTextColor(...WHITE);
    doc.text("Total", panelX + padX, boxMid);
    doc.setFontSize(15);
    doc.text(formatRs(finalPricing.finalPriceIncShipping), rightX - padX, boxMid, {
      align: "right",
    });
    ty += boxH;

    // Advance card, only when one is due.
    if (finalPricing.advance > 0) {
      const advancePct = quotation.settings.pricing.advancePercent.trim() || "0";
      const balance = finalPricing.finalPriceIncShipping - finalPricing.advance;
      ty += 14;
      const cardH = 58;
      doc.setFillColor(...BLUE_50);
      doc.roundedRect(panelX, ty, panelW, cardH, 8, 8, "F");
      doc.setFillColor(...BLUE);
      doc.rect(panelX, ty + 8, 3, cardH - 16, "F");

      let ry = ty + 24;
      doc.setFont(FONT, "normal");
      doc.setFontSize(10);
      doc.setTextColor(...MUTED);
      doc.text(`Advance (${advancePct}%)`, panelX + padX, ry);
      doc.setTextColor(...DARK);
      doc.text(formatRs(finalPricing.advance), rightX - padX, ry, {
        align: "right",
      });
      ry += 22;
      doc.setFont(FONT, "bold");
      doc.setTextColor(...BLUE_DARK);
      doc.text("Balance due on delivery", panelX + padX, ry);
      doc.text(formatRs(balance), rightX - padX, ry, { align: "right" });
      ty += cardH;
    }

    // Footer
    const footY = pageH - 52;
    doc.setDrawColor(...BLUE_LIGHT);
    doc.setLineWidth(1);
    doc.line(margin, footY, rightX, footY);
    doc.setFont(FONT, "bold");
    doc.setFontSize(10);
    doc.setTextColor(...BLUE);
    doc.text("Thank you for your business!", margin, footY + 20);
    doc.setFont(FONT, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}  ·  Prices in INR`,
      rightX,
      footY + 20,
      { align: "right" },
    );

    doc.save(`quotation-${slugify(quotationTitle(quotation))}.pdf`);
    return true;
  } catch {
    return false;
  }
}
