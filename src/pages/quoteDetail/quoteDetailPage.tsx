import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronDown,
  ClipboardCopy,
  Copy,
  FileText,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRs } from "@/lib/pricing";
import { areSettingsEqual } from "@/lib/settings";
import { quotationTitle } from "@/lib/quotations";
import { openQuotePdf } from "@/lib/quoteDocument";
import { useAppState } from "@/store/appStateContext";
import { InfoRow } from "./components/infoRow";
import { PriceRow } from "./components/priceRow";
import { PlateRow } from "./components/plateRow";
import { SeeMore } from "./components/seeMore";
import { DetailRow } from "./components/detailRow";

export function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, duplicateQuotation, resyncQuotationSettings, deleteQuotation } =
    useAppState();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [includeDetails, setIncludeDetails] = useState(false);

  const quotation = data.quotations.find((q) => q.id === id);
  if (!quotation) return <QuoteNotFound />;

  const outdated = !areSettingsEqual(quotation.settings, data.settings);
  const { finalPricing } = quotation;

  const handleDuplicate = () => {
    const newId = duplicateQuotation(quotation.id);
    if (newId) navigate(`/quote/${newId}/edit`);
  };

  const handleReset = () => {
    resyncQuotationSettings(quotation.id);
    setResetOpen(false);
    navigate(`/quote/${quotation.id}/edit`);
  };

  const handleDelete = () => {
    deleteQuotation(quotation.id);
    setConfirmOpen(false);
    navigate("/");
  };

  const handleCopyPricing = async () => {
    try {
      await navigator.clipboard.writeText(
        formatRs(finalPricing.finalPriceIncShipping),
      );
      toast.success("Final price copied to clipboard.");
    } catch {
      toast.error("Couldn't copy to clipboard.");
    }
  };

  const handleGenerateQuote = async () => {
    if (await openQuotePdf(quotation, { includeDetails })) {
      toast.success("Quote PDF downloaded.");
    } else {
      toast.error("Couldn't generate the quote PDF.");
    }
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
            <>
              <Button size="sm" onClick={handleDuplicate}>
                <Copy />
                Duplicate to edit
              </Button>
              <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RotateCcw />
                    Reset to current settings
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Reset to current settings?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This re-prices “{quotationTitle(quotation)}” against your
                      current global settings and unlocks it for editing. The
                      previously frozen price will be replaced. This can’t be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset}>
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
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

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyPricing}>
              <ClipboardCopy />
              Copy pricing
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText />
                  Generate quote
                  <ChevronDown className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Quote PDF</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={includeDetails}
                  onCheckedChange={setIncludeDetails}
                  onSelect={(event) => event.preventDefault()}
                >
                  Include plate details
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleGenerateQuote}>
                  <FileText />
                  Download PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
            <PriceRow
              label="Tax"
              value={finalPricing.tax}
              info={`Taxed at ${quotation.settings.taxPercent.trim() || "0"}% — frozen when this quote was created`}
            />
            <Separator className="my-1" />
            <PriceRow
              label="Final Price Inc Shipping"
              value={finalPricing.finalPriceIncShipping}
              strong
            />
            {finalPricing.advance > 0 && (
              <>
                <Separator className="my-1" />
                <PriceRow
                  label="Advance"
                  value={finalPricing.advance}
                  info={`${quotation.settings.advancePercent.trim() || "0"}% of the order value, due upfront`}
                />
                <PriceRow
                  label="Balance Due"
                  value={
                    finalPricing.finalPriceIncShipping - finalPricing.advance
                  }
                />
              </>
            )}
          </div>
        </CardSection>
      </CardContent>
    </Card>
  );
}