import { PrinterCostCard } from "@/components/printerCostCard";
import { useAppState } from "@/store/appStateContext";

export function PrinterCostPage() {
  const { data, setPrinterCost } = useAppState();

  return (
    <div className="flex flex-col gap-4">
      <PrinterCostCard inputs={data.printerCost} onChange={setPrinterCost} />
    </div>
  );
}
