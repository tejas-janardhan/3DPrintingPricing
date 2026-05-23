import type { ReactElement } from "react";
import { Card as CardShadCn } from "./ui/card";

export function Card(props: { children: ReactElement[] | ReactElement }) {
  return (
    <CardShadCn className="bg-gray-800 w-fit p-4">{props.children}</CardShadCn>
  );
}
