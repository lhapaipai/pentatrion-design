import { useListItem } from "@floating-ui/react";
import clsx from "clsx";
import { useDropdownMenuContext } from "./useDropdownMenuContext";
import { ComponentProps, MouseEvent, ReactNode } from "react";

interface Props extends ComponentProps<"button"> {
  children: ReactNode;
}

export function DropdownMenuItem({ children, className, onClick, ...rest }: Props) {
  const { activeIndex, getItemProps, handleSelect } = useDropdownMenuContext();

  const { ref, index } = useListItem({ label: children?.toString() });
  const isActive = activeIndex === index;
  return (
    <button
      className={clsx("option", isActive && "bg-gray-1", className)}
      ref={ref}
      role="option"
      data-presentation="large"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      {...getItemProps({
        ...rest,
        onClick: (e: MouseEvent<HTMLButtonElement>) => {
          onClick?.(e);
          handleSelect();
        },
      })}
    >
      {children}
    </button>
  );
}
