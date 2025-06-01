import { ComponentProps, RefObject } from "react";
import { type ThemeColor } from "../../types";
import clsx from "clsx";
import { ButtonProps, buttonVariants } from "../button";

export interface CheckboxProps extends ComponentProps<"input"> {
  indeterminate?: boolean;
  disabled?: boolean;
  color?: ThemeColor;
  ref?: RefObject<HTMLInputElement>;
}

export function Checkbox({
  color = "yellow",
  indeterminate,
  disabled = false,
  className,
  children,
  ref,
  ...rest
}: CheckboxProps) {
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
}

interface CheckboxButtonProps extends Omit<ComponentProps<"input">, "size"> {
  disabled?: boolean;
  color?: ButtonProps["color"];
  variant?: "contained" | "light" | "outlined" | "text" | "ghost";
  size?: "small" | "medium" | "large" | "custom";
  width?: "fit" | "full" | "custom";
  icon?: boolean;
  showInput?: boolean;
  ref?: RefObject<HTMLInputElement>;
}
export function CheckboxButton({
  color = "yellow",
  disabled = false,
  width = "fit",
  size,
  icon,
  showInput,
  variant,
  className,
  children,
  ref,
  ...rest
}: CheckboxButtonProps) {
  return (
    <label
      aria-disabled={disabled}
      className={clsx(
        className,
        showInput && "pr-2 pl-1",
        buttonVariants({ variant, size, icon: icon || showInput, width }),
      )}
      data-color={color}
    >
      <input
        ref={ref}
        disabled={disabled}
        type="checkbox"
        className={clsx(
          showInput
            ? "p8n-input-checkbox my-1 mr-2 inline-block h-6 w-6 shrink-0 cursor-pointer appearance-none rounded-2xl bg-origin-border p-0 outline-offset-0 select-none"
            : "h-0 w-0 -translate-x-[9999px] overflow-hidden",
          //indeterminate && "indeterminate",
          className,
        )}
        {...rest}
      />
      {children}
    </label>
  );
}
