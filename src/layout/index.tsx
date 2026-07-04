import type { FC, ReactElement } from "react";

export const Layout: FC<{ children: ReactElement[] | ReactElement }> = ({
  children,
}) => {
  return <div className="w-screen h-screen min-w-[800px] p-6 bg-background text-foreground overflow-auto">{children}</div>;
};
