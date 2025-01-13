import { useListItem } from "@floating-ui/react";
import clsx from "clsx";
import { useDropdownMenuContext } from "./useDropdownMenuContext";
import { ComponentProps, MouseEvent, ReactNode } from "react";
import { Slot } from "../slot";

interface Props extends ComponentProps<"button"> {
  children: ReactNode;
  asChild?: boolean;
}

export function DropdownMenuItem({
  children,
  className,
  onClick,
  type,
  asChild = false,
  ...rest
}: Props) {
  const { activeIndex, getItemProps, handleSelect } = useDropdownMenuContext();

  const { ref, index } = useListItem({ label: children?.toString() });
  const isActive = activeIndex === index;

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={clsx("option", isActive && "bg-gray-1", className)}
      ref={ref}
      role="menuitem"
      data-presentation="large"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      {...getItemProps({
        ...rest,
        onClick: (e: MouseEvent<HTMLButtonElement>) => {
          onClick?.(e);
          if (type !== "submit" && !e.defaultPrevented) {
            handleSelect();
          }
        },
      })}
    >
      {children}
    </Comp>
  );
}
