import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function QuoteNotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Quotation not found
        </CardTitle>
        <CardDescription>
          This quotation doesn't exist or has been deleted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" size="sm">
          <Link to="/">
            <ArrowLeft />
            Back to quotations
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
