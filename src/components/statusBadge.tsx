import { STATUS_LABELS } from "@/lib/quotations";
import { cn } from "@/lib/utils";
import type { QuotationStatus } from "@/types";

const STATUS_STYLES: Record<QuotationStatus, string> = {
  quote: "bg-muted text-muted-foreground",
  inProgress: "bg-accent text-accent-foreground",
  sold: "bg-primary text-primary-foreground",
};

/** Small pill showing a quotation's sale status. */
export function StatusBadge({
  status,
  className,
}: {
  status: QuotationStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
