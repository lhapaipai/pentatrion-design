import clsx from "clsx";
import { ComponentPropsWithRef, forwardRef, ReactNode } from "react";
import { ThemeColor } from "~/types";
import { inputConfig, sizeVariant } from "./Input";

interface InputButtonProps extends Omit<ComponentPropsWithRef<"input">, "prefix" | "size"> {
  label?: string;
  variant?: "normal" | "ghost";
  disabled?: boolean;
  prefix?: ReactNode;
  color?: ThemeColor;
  size?: "small" | "medium" | "large" | "custom";
  flexibleWidth?: boolean;
}
export const InputButton = forwardRef<HTMLInputElement, InputButtonProps>(function InputButton(
  {
    variant = "normal",
    color = "yellow",
    disabled = false,
    prefix,
    className,
    readOnly = false,
    size = "medium",
    flexibleWidth = true,
    name,
    value,
    label,
    placeholder = "",
    ...rest
  },
  ref,
) {
  return (
    <div
      aria-disabled={disabled}
      aria-readonly={readOnly}
      data-color={color}
      data-variant={variant}
      className={clsx("cursor-pointer", inputConfig.container, sizeVariant[size], className)}
      {...rest}
    >
      {prefix && (
        <div
          className={clsx([
            "flex-center relative",
            typeof prefix === "string" && "mx-2 select-none text-gray-6",
          ])}
        >
          {prefix}
        </div>
      )}
      <input ref={ref} type="hidden" readOnly={true} name={name} value={value} />
      <div
        data-color="yellow"
        aria-disabled={disabled}
        aria-readonly={readOnly}
        className={clsx("flex flex-1 items-center", flexibleWidth && "w-0")}
      >
        <span className="flex flex-1 items-center px-2">
          <span>{label || placeholder}</span>
        </span>
        <span className="box-border inline-flex h-8 min-w-8 items-center justify-center rounded-full text-gray-7">
          <i className="fe-angle-down"></i>
        </span>
      </div>
    </div>
  );
});
