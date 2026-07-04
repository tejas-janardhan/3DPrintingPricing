import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const orientationClasses = {
  vertical: "flex-col",
  horizontal: "flex-row",
} as const;

export function Form({
  className,
  orientation = "vertical",
  children,
  ...props
}: ComponentProps<"form"> & {
  orientation?: keyof typeof orientationClasses;
  children: ReactNode;
}) {
  return (
    <form
      className={cn("flex gap-8", orientationClasses[orientation], className)}
      {...props}
    >
      {children}
    </form>
  );
}
