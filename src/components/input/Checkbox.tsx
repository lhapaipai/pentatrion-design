import { ComponentPropsWithRef, forwardRef } from "react";
import { type ThemeColor } from "../../types";
import clsx from "clsx";
import { buttonVariants } from "../button";

export interface CheckboxProps extends ComponentPropsWithRef<"input"> {
  indeterminate?: boolean;
  disabled?: boolean;
  color?: ThemeColor;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { color = "yellow", indeterminate, disabled = false, className, children, ...rest },
  ref,
) {
  return (
    <label aria-disabled={disabled} className={clsx("flex cursor-pointer items-center")}>
      <input
        data-color={color}
        ref={ref}
        disabled={disabled}
        type="checkbox"
        className={clsx(
          "p8n-input-checkbox",
          "my-1 mr-2 inline-block h-6 w-6 shrink-0 cursor-pointer appearance-none rounded-sm bg-origin-border p-0 outline-offset-0 select-none",
          indeterminate && "indeterminate",
          className,
        )}
        {...rest}
      />
      {children}
    </label>
  );
});

interface CheckboxButtonProps extends Omit<ComponentPropsWithRef<"input">, "size"> {
  disabled?: boolean;
  color?: ThemeColor;
  variant?: "contained" | "light" | "outlined" | "text" | "ghost";
  size?: "small" | "medium" | "large" | "custom";
  width?: "fit" | "full" | "custom";
  icon?: boolean;
}
export const CheckboxButton = forwardRef<HTMLInputElement, CheckboxButtonProps>(function Checkbox(
  {
    color = "yellow",
    disabled = false,
    width = "fit",
    size,
    icon,
    variant,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <label
      aria-disabled={disabled}
      className={clsx(className, buttonVariants({ variant, size, icon, width }))}
      data-color={color}
    >
      <input
        ref={ref}
        disabled={disabled}
        type="checkbox"
        className="h-0 w-0 -translate-x-[9999px] overflow-hidden"
        {...rest}
      />
      {children}
    </label>
  );
});
