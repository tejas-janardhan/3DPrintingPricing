import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/statusBadge";
import { cn } from "@/lib/utils";
import { formatRs } from "@/lib/pricing";
import { areSettingsEqual } from "@/lib/settings";
import { quotationTitle, STATUS_LABELS } from "@/lib/quotations";
import { search } from "@/lib/search";
import { useAppState } from "@/store/appStateContext";
import type { QuotationStatus } from "@/types";

type StatusFilter = QuotationStatus | "all";

const STATUS_FILTERS: StatusFilter[] = ["all", "quote", "inProgress", "sold"];

export function QuotationsSidebar({ showAdd = true }: { showAdd?: boolean }) {
  const { data, addQuotation } = useAppState();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const handleNew = () => {
    const id = addQuotation();
    navigate(`/quote/${id}/edit`);
  };

  const sortedQuotations = [...data.quotations].sort((a, b) => {
    const aOutdated = !areSettingsEqual(a.settings, data.settings);
    const bOutdated = !areSettingsEqual(b.settings, data.settings);
    if (aOutdated !== bOutdated) return aOutdated ? 1 : -1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  const filteredQuotations = sortedQuotations.filter(
    (quotation) =>
      statusFilter === "all" || quotation.status === statusFilter,
  );

  const titleMatches = search(filteredQuotations, query, quotationTitle);
  const titleIds = new Set(titleMatches.map((q) => q.id));
  const nameMatches = search(
    filteredQuotations,
    query,
    (quotation) => quotation.customer.name,
  ).filter((quotation) => !titleIds.has(quotation.id));

  const hasMatches = titleMatches.length > 0 || nameMatches.length > 0;

  const renderItem = (quotation: (typeof data.quotations)[number]) => {
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
            <span className="flex shrink-0 items-center gap-1">
              {quotation.status !== "quote" && (
                <StatusBadge status={quotation.status} />
              )}
              {outdated && quotation.status !== "sold" && (
                <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Outdated
                </span>
              )}
            </span>
          </span>
          <span className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="truncate">
              {quotation.customer.phone.trim() || "No phone"}
            </span>
            <span className="shrink-0 tabular-nums font-medium text-primary">
              {formatRs(quotation.finalPricing.finalPriceIncShipping)}
            </span>
          </span>
        </NavLink>
      </li>
    );
  };

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-3">
      {showAdd && (
        <Button size="sm" onClick={handleNew} className="w-fit">
          <Plus />
          Add quote
        </Button>
      )}

      {data.quotations.length > 0 && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search quotations"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {data.quotations.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                statusFilter === filter
                  ? "border-ring bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:bg-accent/50",
              )}
            >
              {filter === "all" ? "All" : STATUS_LABELS[filter]}
            </button>
          ))}
        </div>
      )}

      {data.quotations.length === 0 ? (
        <p className="px-1 py-6 text-center text-sm text-muted-foreground">
          No quotations yet.
        </p>
      ) : !hasMatches ? (
        <p className="px-1 py-6 text-center text-sm text-muted-foreground">
          {query.trim()
            ? `No matches for “${query.trim()}”.`
            : "No quotations with this status."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {titleMatches.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {titleMatches.map(renderItem)}
            </ul>
          )}

          {nameMatches.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Name matches
              </p>
              <ul className="flex flex-col gap-1.5">
                {nameMatches.map(renderItem)}
              </ul>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
