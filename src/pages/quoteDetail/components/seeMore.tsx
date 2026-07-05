import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** A "See more" toggle that reveals extra detail rows with an animation. */
export function SeeMore({ children }: { children: ReactNode }) {
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
