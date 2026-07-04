import type { ReactNode } from "react";

/**
 * A titled group of related fields/content, used to separate concerns inside a
 * single card (e.g. the Settings and Printer Cost pages). Pairs a small heading
 * and optional description with its content.
 */
export function CardSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="text-base font-medium leading-none text-foreground">
          {title}
        </div>
        {description && (
          <p className="text-base text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
