import { ComponentPropsWithRef, forwardRef } from "react";
import { type ThemeColor } from "../../types";
import clsx from "clsx";

export interface ToggleProps extends ComponentPropsWithRef<"input"> {
  disabled?: boolean;
  color?: ThemeColor;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ color = "yellow", disabled = false, checked, className, children, ...rest }, ref) => {
    return (
      <label aria-disabled={disabled} className={clsx("flex cursor-pointer items-center")}>
        <input
          data-color={color}
          ref={ref}
          disabled={disabled}
          type="checkbox"
          className={clsx(
            "p8n-input-toggle ll-toggle p8n-input-checkbox relative mr-1 box-border inline-block h-[18px] w-[30px] cursor-pointer appearance-none rounded-xl bg-gray-1 outline-offset-[-1px] after:absolute after:left-[2px] after:top-[2px] after:h-[12px] after:w-[12px] after:rounded-full after:bg-gray-2 after:outline after:outline-1 after:outline-gray-3 after:transition-all after:duration-100 checked:bg-gray-2 checked:after:translate-x-[12px] checked:after:bg-current checked:after:outline-current",
            className,
          )}
          checked={checked}
          {...rest}
        />
        {children}
      </label>
    );
  },
);
