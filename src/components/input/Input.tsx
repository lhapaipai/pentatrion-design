import { ComponentPropsWithRef, ReactNode } from "react";
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
  children?: ReactNode;
  inputClassName?: string;
}

export const sizeVariant = {
  small: "[--h-input:24px] h-(--h-input)",
  medium: "[--h-input:32px] h-(--h-input)",
  large: "[--h-input:48px] h-(--h-input)",
  custom: "",
};

export const inputConfig = {
  container: "p8n-input-text rounded-full flex box-border",
  input: "h-full flex-1 appearance-none outline-hidden filter-none min-w-0 bg-transparent",
  icon: "[--h-icon:calc(var(--h-input)-2px)] h-(--h-icon) w-(--h-icon) inline-flex-center",
};

export function Input({
  variant = "normal",
  color = "yellow",
  disabled = false,
  prefix,
  suffix,
  className,
  inputClassName,
  readOnly,
  size = "medium",
  flexibleWidth = true,
  type,
  children,
  ref,
  ...rest
}: InputProps) {
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
            typeof prefix === "string" && "text-gray-6 mx-2 select-none",
          ])}
        >
          {prefix}
        </div>
      )}
      <input
        type={type}
        ref={ref}
        className={clsx(
          inputConfig.input,
          size !== "custom" && !prefix && "pl-4",
          size !== "custom" && type !== "date" && type !== "datetime-local"
            ? !suffix && "pr-4"
            : "pr-1",
          flexibleWidth && "w-0",
          inputClassName,
        )}
        readOnly={readOnly}
        onClick={(e) => {
          if (readOnly) {
            (e.target as HTMLInputElement)?.select();
          }
        }}
        {...(disabled ? { disabled } : {})}
        {...rest}
      />
      {suffix && (
        <div
          className={clsx([
            "flex-center relative",
            typeof suffix === "string" && "text-gray-6 mx-2 select-none",
          ])}
        >
          {suffix}
        </div>
      )}
      {children}
    </div>
  );
}
