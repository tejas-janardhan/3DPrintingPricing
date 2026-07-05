import { NavLink, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatRs } from "@/lib/pricing";
import { areSettingsEqual } from "@/lib/settings";
import { quotationTitle } from "@/lib/quotations";
import { useAppState } from "@/store/appStateContext";

export function QuotationsSidebar() {
  const { data, addQuotation } = useAppState();
  const navigate = useNavigate();

  const handleNew = () => {
    const id = addQuotation();
    navigate(`/quote/${id}/edit`);
  };

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-3">
      <Button size="sm" onClick={handleNew} className="w-full">
        <Plus />
        Add quote
      </Button>

      {data.quotations.length === 0 ? (
        <p className="px-1 py-6 text-center text-sm text-muted-foreground">
          No quotations yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {data.quotations.map((quotation) => {
            const outdated = !areSettingsEqual(quotation.settings, data.settings);
            return (
              <li key={quotation.id}>
                <NavLink
                  to={`/quote/${quotation.id}`}
                  className={({ isActive }) =>
                    cn(
                      "flex flex-col gap-1 rounded-lg border p-3 transition-colors",
                      isActive
                        ? "border-ring bg-accent"
                        : "border-border hover:bg-accent/50",
                    )
                  }
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {quotationTitle(quotation)}
                    </span>
                    {outdated && (
                      <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Outdated
                      </span>
                    )}
                  </span>
                  <span className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="truncate">
                      {quotation.customer.phone.trim() || "No phone"}
                    </span>
                    <span className="shrink-0 tabular-nums font-medium text-primary">
                      {formatRs(quotation.finalPrice)}
                    </span>
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
