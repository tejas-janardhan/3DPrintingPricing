import type { ReactElement, ReactNode } from "react";
import {
  Card as CardShadCn,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

export function Card(props: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactElement[] | ReactElement;
}) {
  return (
    <CardShadCn className="w-fit">
      {props.title && (
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <CardTitle>{props.title}</CardTitle>
            {props.description && (
              <CardDescription>{props.description}</CardDescription>
            )}
          </div>
          {props.action}
        </CardHeader>
      )}
      <CardContent>{props.children}</CardContent>
    </CardShadCn>
  );
}
