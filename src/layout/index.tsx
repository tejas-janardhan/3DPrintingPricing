import type { FC, ReactElement } from "react";

export const Layout: FC<{ children: ReactElement[] | ReactElement }> = ({
  children,
}) => {
  return <div className="w-screen h-screen fixed min-w-[800px] py-4 px-6 bg-background text-foreground overflow-auto">{children}</div>;
};
