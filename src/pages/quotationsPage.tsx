import { Link, useNavigate } from "react-router-dom";
import { FileText, Phone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRs } from "@/lib/pricing";
import { quotationTitle } from "@/lib/quotations";
import { useAppState } from "@/store/appStateContext";

export function QuotationsPage() {
  const { data, addQuotation, deleteQuotation } = useAppState();
  const navigate = useNavigate();

  const quotations = data.quotations;

  const handleNew = () => {
    const id = addQuotation();
    navigate(`/quote/${id}`);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete the quotation for "${title}"?`)) {
      deleteQuotation(id);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <Card>
      <CardHeader className="border-b pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Quotations
        </CardTitle>
        <CardDescription>
          Create and manage quotes for your customers.
        </CardDescription>
        <CardAction>
          <Button size="sm" onClick={handleNew}>
            <Plus />
            New quotation
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {quotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
            <span className="flex size-11 items-center justify-center rounded-full border border-dashed border-current text-muted-foreground">
              <FileText className="size-5" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-base font-medium text-foreground">
                No quotations yet
              </p>
              <p className="text-sm text-muted-foreground">
                Create your first quotation to get started.
              </p>
            </div>
            <Button size="sm" onClick={handleNew} className="mt-1">
              <Plus />
              New quotation
            </Button>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {quotations.map((quotation) => (
              <li key={quotation.id}>
                <div className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-ring">
                  <Link
                    to={`/quote/${quotation.id}`}
                    className="flex min-w-0 flex-1 flex-col gap-1"
                  >
                    <span className="truncate text-base font-medium text-foreground">
                      {quotationTitle(quotation)}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
                      {quotation.customer.phone.trim() && (
                        <span className="flex items-center gap-1">
                          <Phone className="size-3.5" />
                          {quotation.customer.phone}
                        </span>
                      )}
                      <span>{formatDate(quotation.createdAt)}</span>
                    </span>
                  </Link>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      Final Price
                    </span>
                    <span className="text-lg font-semibold tabular-nums text-primary">
                      {formatRs(quotation.finalPrice)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete quotation"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      handleDelete(quotation.id, quotationTitle(quotation))
                    }
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
