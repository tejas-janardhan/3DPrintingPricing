import { useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Copy, Pencil, Trash2 } from "lucide-react";
import { CardSection } from "@/components/section";
import { QuoteNotFound } from "@/components/quoteNotFound";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FILAMENT_TYPE_OPTIONS } from "@/config/constants";
import type { PlateInputs } from "@/types";
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
import { formatRs } from "@/lib/pricing";
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

/** A muted label/value row for secondary detail inside a "See more". */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-8 text-sm text-muted-foreground">
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

/** A "See more" toggle that reveals extra detail rows with an animation. */
function SeeMore({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2 pb-2">{children}</div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="self-start px-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
        onClick={() => setOpen((shown) => !shown)}
      >
        {open ? "See less" : "See more"}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </Button>
    </div>
  );
}

const filamentLabel = (value: string) =>
  FILAMENT_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? "—";

/** One plate: cost row plus a "See more" with its print inputs. */
function PlateRow({
  plate,
  plateCost,
}: {
  plate: PlateInputs;
  plateCost: number;
}) {
  const hours = plate.printTimeHours.trim() || "0";
  const minutes = plate.printTimeMinutes.trim() || "0";
  const weight = plate.printWeight.trim() || "0";
  const price = plate.filamentPrice.trim();
  return (
    <div className="flex flex-col gap-1">
      <SeeMore>
        <DetailRow label="Filament Type" value={filamentLabel(plate.filamentType)} />
        <DetailRow
          label="Filament Pricing"
          value={price ? `${formatRs(Number(price))} /kg` : "—"}
        />
        <DetailRow label="Print Time" value={`${hours}h ${minutes}m`} />
        <DetailRow label="Print Weight" value={`${weight} g`} />
      </SeeMore>
      <PriceRow label={plate.name} value={plateCost} />
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
  const { finalPricing } = quotation;

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
            {formatRs(finalPricing.finalPriceIncShipping)}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {formatRs(finalPricing.rsPerGram)} /g
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
          <div className="flex max-w-md flex-col gap-3">
            {quotation.plates.map((plate, index) => (
              <PlateRow
                key={plate.id}
                plate={plate}
                plateCost={quotation.plateCosts[index]?.plateCost ?? 0}
              />
            ))}
          </div>
        </CardSection>

        <Separator />

        <CardSection title="Pricing">
          <div className="flex max-w-md flex-col gap-2">
            <SeeMore>
              <PriceRow label="Wage Cost" value={finalPricing.wageCost} />
              <PriceRow label="Total Print Cost" value={finalPricing.printCost} />
              <DetailRow
                label="Markup"
                value={`${quotation.pricing.markup.trim() || "0"}%`}
              />
              <PriceRow
                label="Shipping Cost"
                value={Number(quotation.pricing.shipping.trim() || "0")}
              />
            </SeeMore>
            <PriceRow label="Last Price" value={finalPricing.lastPrice} />
            <Separator className="my-1" />
            <PriceRow label="Final Price" value={finalPricing.finalCost} />
            <PriceRow label="Tax" value={finalPricing.tax} />
            <Separator className="my-1" />
            <PriceRow
              label="Final Price Inc Shipping"
              value={finalPricing.finalPriceIncShipping}
              strong
            />
          </div>
        </CardSection>
      </CardContent>
    </Card>
  );
}