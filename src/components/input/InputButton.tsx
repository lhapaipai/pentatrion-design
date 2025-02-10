import clsx from "clsx";
import { ComponentPropsWithRef, forwardRef, ReactNode } from "react";
import { ThemeColor } from "~/types";
import { inputConfig, sizeVariant } from "./Input";

export interface InputButtonProps extends Omit<ComponentPropsWithRef<"button">, "prefix"> {
  label?: string;
  variant?: "normal" | "ghost";
  disabled?: boolean;
  prefix?: ReactNode;
  color?: ThemeColor;
  size?: "small" | "medium" | "large" | "custom";
  flexibleWidth?: boolean;

  readOnly?: boolean;
  placeholder?: string;
}
export const InputButton = forwardRef<HTMLButtonElement, InputButtonProps>(function InputButton(
  {
    variant = "normal",
    color = "yellow",
    disabled = false,
    prefix,
    className,
    readOnly = false,
    size = "medium",
    flexibleWidth = true,
    label,
    placeholder = "",
    ...rest
  },
  ref,
) {
  return (
    <div className="w-full">
      <button
        ref={ref}
        aria-disabled={disabled}
        aria-readonly={readOnly}
        data-color={color}
        data-variant={variant}
        className={clsx(
          "w-full cursor-pointer",
          inputConfig.container,
          sizeVariant[size],
          className,
        )}
        {...rest}
      >
        {prefix && (
          <div
            className={clsx([
              "flex-center relative",
              typeof prefix === "string" && "text-gray-6 mx-2 select-none",
            ])}
          >
            {prefix}
          </div>
        )}
        <div
          data-color="yellow"
          aria-disabled={disabled}
          aria-readonly={readOnly}
          className={clsx("flex flex-1 items-center", flexibleWidth && "w-0")}
        >
          <span className={clsx("flex flex-1 items-center truncate px-2", !label && "text-gray-5")}>
            {label || placeholder}
          </span>
          <span className="text-gray-7 box-border inline-flex h-8 min-w-8 items-center justify-center rounded-full">
            <i className="fe-angle-down"></i>
          </span>
        </div>
      </button>
    </div>
  );
});
