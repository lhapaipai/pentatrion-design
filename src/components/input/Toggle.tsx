import { ComponentPropsWithRef, RefObject } from "react";
import { type ThemeColor } from "../../types";
import clsx from "clsx";

export interface ToggleProps extends ComponentPropsWithRef<"input"> {
  disabled?: boolean;
  color?: ThemeColor;
  ref?: RefObject<HTMLInputElement>;
}

export function Toggle({
  color = "yellow",
  disabled = false,
  checked,
  className,
  children,
  ref,
  ...rest
}: ToggleProps) {
  return (
    <label aria-disabled={disabled} className={clsx("flex cursor-pointer items-center")}>
      <input
        data-color={color}
        ref={ref}
        disabled={disabled}
        type="checkbox"
        className={clsx(
          "p8n-input-toggle bg-gray-1 after:bg-gray-2 after:outline-gray-3 checked:bg-gray-2 relative mr-1 box-border inline-block h-[18px] w-[30px] cursor-pointer appearance-none rounded-xl outline-offset-[-1px] after:absolute after:top-[2px] after:left-[2px] after:h-[12px] after:w-[12px] after:rounded-full after:outline after:outline-1 after:transition-all after:duration-100 checked:after:translate-x-[12px] checked:after:bg-current checked:after:outline-current",
          className,
        )}
        checked={checked}
        {...rest}
      />
      {children}
    </label>
  );
}
