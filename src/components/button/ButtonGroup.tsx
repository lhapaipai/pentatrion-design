import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import { cva } from "class-variance-authority";

interface Props extends ComponentProps<"div"> {
  children: ReactNode;
  direction?: "horizontal" | "vertical";
}

export const buttonGroupVariants = cva(
  "[&_:not(:first-child)]:rounded-tl-none [&_:not(:last-child)]:rounded-br-none",
  {
    variants: {
      direction: {
        horizontal:
          "[&_:not(:first-child)]:rounded-bl-none [&_:not(:last-child)]:rounded-tr-none [&_[data-variant='outlined']]:-mx-[1px]",
        vertical:
          "flex flex-col [&_:not(:first-child)]:rounded-tr-none [&_:not(:last-child)]:rounded-bl-none [&_[data-variant='outlined']]:-my-[1px]",
      },
    },
    defaultVariants: {
      direction: "horizontal",
    },
  },
);

export function ButtonGroup({ children, className, direction = "horizontal" }: Props) {
  return <div className={clsx(buttonGroupVariants({ direction }), className)}>{children}</div>;
}
