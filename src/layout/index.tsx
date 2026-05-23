import type { FC, ReactElement } from "react";

export const Layout: FC<{ children: ReactElement[] | ReactElement }> = ({
  children,
}) => {
  return <div className="w-full h-screen p-4 bg-gray-950">{children}</div>;
};
