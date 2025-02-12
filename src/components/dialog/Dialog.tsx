import { Placement } from "@floating-ui/react";
import clsx from "clsx";
import { ComponentProps, ReactNode } from "react";
import type { ThemeColor } from "../../types";
import { cva } from "class-variance-authority";

interface Props extends ComponentProps<"div"> {
  color?: ThemeColor;
  placement?: Placement;
  children: ReactNode;
}

export const dialogVariants = cva("relative rounded-2xl shadow-sm dark:shadow-dark", {
  variants: {
    color: {
      yellow: "border-t-4 border-t-yellow-3 bg-gray-0",
      gray: "border-t-4 border-t-gray-3 bg-gray-0",
      red: "border-t-4 border-t-red-3 bg-red-1",
      blue: "border-t-4 border-t-blue-3 bg-blue-1",
      green: "border-t-4 border-t-green-3 bg-green-1",
      orange: "border-t-4 border-t-orange-3 bg-orange-1",
      default: "bg-gray-0",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

export function Dialog({ placement, color, children, className, role = "dialog", ...rest }: Props) {
  return (
    <div
      role={role}
      className={clsx(dialogVariants({ color }), className)}
      data-placement={placement}
      data-color={color ?? "gray"}
      {...rest}
    >
      {children}
    </div>
  );
}
