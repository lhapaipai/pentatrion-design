import { ReactNode } from "react";
import { ThemeColor } from "../../types";
import clsx from "clsx";
import { colorVariants } from "../../lib/tailwindVariants";

interface Props {
  color?: ThemeColor;
  children?: ReactNode;
  className?: string;
}

export function Flash({ color = "yellow", children, className }: Props) {
  return (
    <div
      className={clsx(
        "bg-gray-0 dark:shadow-dark border-l-4 p-2 shadow-sm [&_p]:m-0",
        colorVariants[color].border,
        className,
      )}
      aria-live={color !== "red" ? "polite" : "assertive"}
      role={color !== "red" ? "status" : "alert"}
    >
      {children}
    </div>
  );
}
