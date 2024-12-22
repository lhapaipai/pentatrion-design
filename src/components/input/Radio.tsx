import { ComponentPropsWithRef, forwardRef } from "react";
import { type ThemeColor } from "../../types";
import clsx from "clsx";
import { buttonVariants } from "../button";

export interface RadioProps extends ComponentPropsWithRef<"input"> {
  color?: ThemeColor;
  variant?: "contained" | "light" | "outlined" | "text" | "ghost";
  width?: "fit" | "full" | "custom";
}
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ disabled = false, color = "yellow", children, className, ...rest }, ref) => {
    return (
      <label aria-disabled={disabled} className={clsx("flex cursor-pointer items-center")}>
        <input
          data-color={color}
          ref={ref}
          type="radio"
          disabled={disabled}
          className={clsx(
            "p8n-input-radio",
            "my-1 mr-2 inline-block h-6 w-6 shrink-0 cursor-pointer select-none appearance-none rounded-full bg-gray-0 bg-origin-border p-0 outline-offset-[-1px]",
            className,
          )}
          {...rest}
        />
        {children}
      </label>
    );
  },
);

export const RadioButton = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      disabled = false,
      color = "yellow",
      children,
      className,
      variant = "light",
      width = "fit",
      ...rest
    },
    ref,
  ) => {
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
  },
);
