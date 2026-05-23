import type { ReactElement } from "react";
import {
  Card as CardShadCn,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";

export function Card(props: {
  title?: string;
  children: ReactElement[] | ReactElement;
}) {
  return (
    <CardShadCn className="bg-gray-800 w-fit p-4">
      {props.title && (
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>{props.children}</CardContent>
    </CardShadCn>
  );
}
