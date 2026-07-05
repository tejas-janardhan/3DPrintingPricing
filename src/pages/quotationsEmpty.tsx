import { useNavigate } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppState } from "@/store/appStateContext";

export function QuotationsEmpty() {
  const { addQuotation } = useAppState();
  const navigate = useNavigate();

  const handleNew = () => {
    const id = addQuotation();
    navigate(`/quote/${id}/edit`);
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <span className="flex size-11 items-center justify-center rounded-full border border-dashed border-current text-muted-foreground">
          <FileText className="size-5" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-foreground">
            Select a quotation
          </p>
          <p className="text-sm text-muted-foreground">
            Pick a quotation from the list, or create a new one.
          </p>
        </div>
        <Button size="sm" onClick={handleNew} className="mt-1">
          <Plus />
          New quotation
        </Button>
      </CardContent>
    </Card>
  );
}
