import { ComponentPropsWithRef, ReactNode, forwardRef } from "react";
import clsx from "clsx";
import type { ThemeColor } from "../../types";

export interface InputProps extends Omit<ComponentPropsWithRef<"input">, "prefix" | "size"> {
  variant?: "normal" | "ghost";
  disabled?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  color?: ThemeColor;
  size?: "small" | "medium" | "large" | "custom";
  flexibleWidth?: boolean;
}

export const sizeVariant = {
  small: "h-6",
  medium: "h-8",
  large: "h-12",
  custom: "",
};

export const inputConfig = {
  container: "p8n-input-text rounded-full outline-offset-[-1px] flex box-border",
  input: "h-full flex-1 appearance-none outline-none filter-none min-w-0 bg-transparent",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "normal",
      color = "yellow",
      disabled = false,
      prefix,
      suffix,
      className,
      readOnly,
      size = "medium",
      flexibleWidth = true,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        aria-disabled={disabled}
        aria-readonly={readOnly}
        data-color={color}
        data-variant={variant}
        className={clsx(inputConfig.container, sizeVariant[size], className)}
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
        <input
          autoFocus={true}
          ref={ref}
          className={clsx(
            inputConfig.input,
            !prefix && "pl-4",
            !suffix && "pr-4",
            flexibleWidth && "w-0",
          )}
          disabled={disabled}
          readOnly={readOnly}
          onClick={(e) => {
            if (readOnly) {
              (e.target as HTMLInputElement)?.select();
            }
          }}
          {...rest}
        />
        {suffix && (
          <div
            className={clsx([
              "flex-center relative",
              typeof suffix === "string" && "mx-2 select-none text-gray-6",
            ])}
          >
            {suffix}
          </div>
        )}
      </div>
    );
  },
);
