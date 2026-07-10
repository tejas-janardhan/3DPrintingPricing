import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A titled group of related fields/content, used to separate concerns inside a
 * single card (e.g. the Settings and Printer Cost pages). Pairs a small heading
 * and optional description with its content. Pass `collapsible` to let the user
 * minimize the content with an animated toggle.
 */
export function CardSection({
  title,
  description,
  badge,
  collapsible = false,
  defaultOpen = true,
  padded = false,
  open: controlledOpen,
  onOpenChange,
  children,
}: {
  title: string;
  description?: string;
  /** Small status pill shown next to the title, e.g. an "Incomplete" flag. */
  badge?: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  /** Adds horizontal padding so input focus rings aren't clipped by overflow-hidden. */
  padded?: boolean;
  /** Controlled open state; falls back to internal state when omitted. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const toggle = () => {
    const next = !open;
    onOpenChange ? onOpenChange(next) : setInternalOpen(next);
  };

  const heading = (
    <div className="flex flex-col gap-1 text-left">
      <div className="flex items-center gap-2">
        <div className="text-base font-medium leading-none text-foreground">
          {title}
        </div>
        {badge}
      </div>
      {description && (
        <p className="text-base text-muted-foreground">{description}</p>
      )}
    </div>
  );

  if (!collapsible) {
    return (
      <section className="flex flex-col gap-4">
        {heading}
        {children}
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className="flex items-center justify-between gap-4 text-left"
      >
        {heading}
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        {/* `padded` adds horizontal padding so input focus rings aren't clipped. */}
        <div className="overflow-hidden">
          <div className={cn(padded && "px-1")}>{children}</div>
        </div>
      </div>
    </section>
  );
}
