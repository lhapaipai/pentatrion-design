import { useFloatingTree, useListItem, useMergeRefs } from "@floating-ui/react";
import { ButtonHTMLAttributes, FocusEvent, MouseEvent, RefObject, useContext } from "react";
import { MenuContext } from "./MenuContext";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  disabled?: boolean;
  ref?: RefObject<HTMLButtonElement>;
}

export function MenuItem({ label, disabled, ref, ...props }: Props) {
  const menu = useContext(MenuContext);
  const item = useListItem({ label: disabled ? null : label });
  const tree = useFloatingTree();
  const isActive = item.index === menu.activeIndex;

  return (
    <button
      {...props}
      ref={useMergeRefs([item.ref, ref])}
      type="button"
      role="menuitem"
      className="option"
      data-presentation="compact"
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      {...menu.getItemProps({
        onClick(event: MouseEvent<HTMLButtonElement>) {
          props.onClick?.(event);
          tree?.events.emit("click");
        },
        onFocus(event: FocusEvent<HTMLButtonElement>) {
          props.onFocus?.(event);
          menu.setHasFocusInside(true);
        },
      })}
    >
      {label}
    </button>
  );
}
