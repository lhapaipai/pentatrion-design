import { ComponentPropsWithRef, ReactNode, forwardRef } from "react";
import clsx from "clsx";
import type { ThemeColor } from "../../types";

export interface InputProps extends Omit<ComponentPropsWithRef<"input">, "prefix"> {
  variant?: "normal" | "ghost";
  disabled?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  color?: ThemeColor;
}

export const inputConfig = {
  container: "p8n-input-text rounded-2xl outline-offset-[-1px] flex box-border h-8",
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
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        data-color={color}
        data-variant={variant}
        className={clsx(
          inputConfig.container,
          disabled && "disabled",
          readOnly && "readonly",
          className,
        )}
      >
        {prefix && (
          <div
            className={clsx([
              "relative flex-center",
              typeof prefix === "string" && "mx-2 select-none text-gray-6",
            ])}
          >
            {prefix}
          </div>
        )}
        <input
          autoFocus={true}
          ref={ref}
          className={clsx(inputConfig.input, !prefix && "pl-4", !suffix && "pr-4")}
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
              "relative flex-center",
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
