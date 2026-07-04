import type { ReactElement, ReactNode } from "react";
import {
  Card as CardShadCn,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";

export function Card(props: {
  title?: string;
  action?: ReactNode;
  children: ReactElement[] | ReactElement;
}) {
  return (
    <CardShadCn className="bg-gray-800 w-fit">
      {props.title && (
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-gray-50">{props.title}</CardTitle>
          {props.action}
        </CardHeader>
      )}
      <CardContent>{props.children}</CardContent>
    </CardShadCn>
  );
}
