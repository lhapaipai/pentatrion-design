import clsx from "clsx";
import { ReactNode, ComponentProps } from "react";

interface Props extends ComponentProps<"th"> {
  children: ReactNode;
}

export function TableHeaderCell({ children, className, ...props }: Props) {
  return (
    <th className={clsx("text-left font-bold p-2", className)} {...props}>
      {children}
    </th>
  );
}
