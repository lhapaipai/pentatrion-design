import { ReactNode } from "react";
import { ThemeColor } from "../../types";
import clsx from "clsx";

interface Props {
  color?: ThemeColor;
  children?: ReactNode;
  className?: string;
}

export function Flash({ color = "yellow", children, className }: Props) {
  return (
    <div
      data-color={color}
      className={clsx(
        "bg-gray-0 dark:shadow-dark border-custom-3 border-l-4 p-2 shadow-sm [&_p]:m-0",
        className,
      )}
      aria-live={color !== "red" ? "polite" : "assertive"}
      role={color !== "red" ? "status" : "alert"}
    >
      {children}
    </div>
  );
}
