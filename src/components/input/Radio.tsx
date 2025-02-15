import { ComponentPropsWithRef, RefObject } from "react";
import { type ThemeColor } from "../../types";
import clsx from "clsx";
import { buttonVariants } from "../button";

export interface RadioProps extends ComponentPropsWithRef<"input"> {
  color?: ThemeColor;
  variant?: "contained" | "light" | "outlined" | "text" | "ghost";
  width?: "fit" | "full" | "custom";
  ref?: RefObject<HTMLInputElement>;
}
export function Radio({
  disabled = false,
  color = "yellow",
  children,
  className,
  ref,
  ...rest
}: RadioProps) {
  return (
    <label aria-disabled={disabled} className={clsx("flex cursor-pointer items-center")}>
      <input
        data-color={color}
        ref={ref}
        type="radio"
        disabled={disabled}
        className={clsx(
          "p8n-input-radio",
          "my-1 mr-2 inline-block h-6 w-6 shrink-0 cursor-pointer appearance-none rounded-full bg-origin-border p-0 outline-offset-[-1px] select-none",
          className,
        )}
        {...rest}
      />
      {children}
    </label>
  );
}

export function RadioButton({
  disabled = false,
  color = "yellow",
  children,
  className,
  variant = "light",
  width = "fit",
  ref,
  ...rest
}: RadioProps) {
  return (
    <label
      aria-disabled={disabled}
      className={clsx(className, buttonVariants({ variant, width }))}
      data-color={color}
    >
      <input
        ref={ref}
        disabled={disabled}
        type="radio"
        className="h-0 w-0 -translate-x-[9999px] overflow-hidden"
        {...rest}
      />
      {children}
    </label>
  );
}
