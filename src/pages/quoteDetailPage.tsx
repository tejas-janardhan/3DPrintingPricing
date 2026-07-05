import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { CardSection } from "@/components/section";
import { QuoteNotFound } from "@/components/quoteNotFound";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { computeFinalPricing, computePlateCost, formatRs } from "@/lib/pricing";
import { areSettingsEqual } from "@/lib/settings";
import { quotationTitle } from "@/lib/quotations";
import { useAppState } from "@/store/appStateContext";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-8 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

function PriceRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div
      className={
        strong
          ? "flex items-center justify-between gap-8 text-base font-semibold"
          : "flex items-center justify-between gap-8 text-sm text-muted-foreground"
      }
    >
      <span>{label}</span>
      <span className="tabular-nums">{formatRs(value)}</span>
    </div>
  );
}

export function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, duplicateQuotation, deleteQuotation } = useAppState();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const quotation = data.quotations.find((q) => q.id === id);
  if (!quotation) return <QuoteNotFound />;

  const outdated = !areSettingsEqual(quotation.settings, data.settings);
  const pricing = computeFinalPricing({
    settings: quotation.settings,
    processing: quotation.processing,
    plates: quotation.plates,
    pricing: quotation.pricing,
  });

  const handleDuplicate = () => {
    const newId = duplicateQuotation(quotation.id);
    if (newId) navigate(`/quote/${newId}/edit`);
  };

  const handleDelete = () => {
    deleteQuotation(quotation.id);
    setConfirmOpen(false);
    navigate("/");
  };

  return (
    <Card>
      <CardHeader className="border-b pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {quotationTitle(quotation)}
        </CardTitle>
        <CardDescription>Quotation summary.</CardDescription>
        <CardAction className="flex flex-col items-end gap-0.5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Final Price
          </span>
          <span className="text-2xl font-semibold tabular-nums text-primary">
            {formatRs(quotation.finalPrice)}
          </span>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          {outdated ? (
            <Button size="sm" onClick={handleDuplicate}>
              <Copy />
              Duplicate to edit
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate(`/quote/${quotation.id}/edit`)}
            >
              <Pencil />
              Edit
            </Button>
          )}

          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this quotation?</AlertDialogTitle>
                <AlertDialogDescription>
                  The quotation for “{quotationTitle(quotation)}” will be
                  permanently removed. This can’t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {outdated && (
          <p className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
            Your global settings have changed since this quotation was created,
            so it’s locked to keep its quoted price. Duplicate it to build a new
            quote with the current settings.
          </p>
        )}

        <CardSection title="Customer">
          <div className="flex max-w-md flex-col gap-2">
            <InfoRow label="Name" value={quotation.customer.name.trim() || "—"} />
            <InfoRow
              label="Phone"
              value={quotation.customer.phone.trim() || "—"}
            />
            <InfoRow
              label="Address"
              value={quotation.customer.address.trim() || "—"}
            />
          </div>
        </CardSection>

        <Separator />

        <CardSection title="Plates">
          <div className="flex max-w-md flex-col gap-2">
            {quotation.plates.map((plate) => (
              <PriceRow
                key={plate.id}
                label={plate.name}
                value={computePlateCost(quotation.settings, plate).plateCost}
              />
            ))}
          </div>
        </CardSection>

        <Separator />

        <CardSection title="Pricing">
          <div className="flex max-w-md flex-col gap-2">
            <PriceRow label="Wage Cost" value={pricing.wageCost} />
            <PriceRow label="Total Print Cost" value={pricing.printCost} />
            <PriceRow label="Last Price" value={pricing.lastPrice} />
            <PriceRow label="Final Price" value={pricing.finalCost} />
            <PriceRow label="Tax" value={pricing.tax} />
            <Separator className="my-1" />
            <PriceRow
              label="Final Price Inc Shipping"
              value={pricing.finalPriceIncShipping}
              strong
            />
          </div>
        </CardSection>
      </CardContent>
    </Card>
  );
}
