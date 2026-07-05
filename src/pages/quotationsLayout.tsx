import { Outlet } from "react-router-dom";
import { QuotationsSidebar } from "@/components/quotationsSidebar";

export function QuotationsLayout() {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      <QuotationsSidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
