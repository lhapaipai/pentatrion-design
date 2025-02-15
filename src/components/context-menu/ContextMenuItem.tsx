import React, { ComponentPropsWithRef, ReactNode, RefObject } from "react";
import clsx from "clsx";

export type ContextMenuItemMouseEvent =
  | React.MouseEvent<HTMLButtonElement>
  | MouseEvent
  | CustomEvent
  | null;

export interface ContextMenuItemProps extends Omit<ComponentPropsWithRef<"button">, "onClick"> {
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
  onClick?: (e: ContextMenuItemMouseEvent) => void;
  ref?: RefObject<HTMLButtonElement>;
}

export function ContextMenuItem({
  label,
  disabled,
  icon,
  className,
  ref,
  ...props
}: ContextMenuItemProps) {
  return (
    <button
      {...props}
      className={clsx(["option", className])}
      ref={ref}
      role="menuitem"
      data-presentation="compact"
      disabled={disabled}
    >
      {icon}
      <span className="content">{label}</span>
    </button>
  );
}
