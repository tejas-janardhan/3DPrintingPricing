import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatRs } from "@/lib/pricing";

export function PriceRow({
  label,
  value,
  strong,
  info,
}: {
  label: string;
  value: number;
  strong?: boolean;
  /** Tooltip text shown via an info icon next to the label. */
  info?: string;
}) {
  return (
    <div
      className={
        strong
          ? "flex items-center justify-between gap-8 text-base font-semibold"
          : "flex items-center justify-between gap-8 text-sm text-muted-foreground"
      }
    >
      <span className="flex items-center gap-1.5">
        {label}
        {info && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={info}
                className="text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                <Info className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{info}</TooltipContent>
          </Tooltip>
        )}
      </span>
      <span className="tabular-nums">{formatRs(value)}</span>
    </div>
  );
}
