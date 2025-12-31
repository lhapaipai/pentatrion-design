import { Placement } from "@floating-ui/react";
import clsx from "clsx";
import { ComponentProps, ReactNode } from "react";
import type { ThemeBaseColor } from "../../types";
import { cva } from "class-variance-authority";

interface Props extends ComponentProps<"div"> {
  color?: ThemeBaseColor;
  shadow?: boolean;
  rounded?: boolean;
  placement?: Placement;
  children: ReactNode;
}

export const dialogVariants = cva("relative", {
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
    shadow: {
      true: "shadow-sm dark:shadow-dark",
      false: "border border-gray-2",
    },
    rounded: {
      true: "rounded-2xl",
      false: "",
    },
  },
  defaultVariants: {
    color: "default",
    shadow: true,
    rounded: true,
  },
});

export function Dialog({
  placement,
  color,
  rounded,
  shadow,
  children,
  className,
  role = "dialog",
  ...rest
}: Props) {
  return (
    <div
      role={role}
      className={clsx(dialogVariants({ color, rounded, shadow }), className)}
      data-placement={placement}
      data-color={color ?? "gray"}
      {...rest}
    >
      {children}
    </div>
  );
}
