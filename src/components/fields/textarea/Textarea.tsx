import clsx from "clsx";
import { ComponentProps, ReactNode, RefObject } from "react";
import type { ThemeColor } from "../../../types";

export interface TextareaProps extends Omit<ComponentProps<"textarea">, "prefix"> {
  variant?: "normal" | "ghost";
  color?: ThemeColor;
  action?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  prefixClassName?: string;
  suffixClassName?: string;
  ref?: RefObject<HTMLTextAreaElement>;
}

export function Textarea({
  variant = "normal",
  color = "yellow",
  disabled = false,
  className,
  readOnly,
  action,
  prefix,
  suffix,
  prefixClassName,
  suffixClassName,
  ref,
  ...rest
}: TextareaProps) {
  return (
    <div
      data-color={color}
      data-variant={variant}
      aria-disabled={disabled}
      aria-readonly={readOnly}
      className={clsx("p8n-textarea relative flex rounded-2xl h-min min-h-8")}
    >
      {prefix && (
        <div
          className={clsx([
            "relative",
            typeof prefix === "string" &&
              "text-gray-6 px-2 pt-2 select-none border-r border-r-custom-2",
            prefixClassName,
          ])}
        >
          {prefix}
        </div>
      )}
      <textarea
        ref={ref}
        className={clsx(
          "w-full min-w-0 flex-1 appearance-none bg-transparent p-2 outline-hidden filter-none",
          className,
        )}
        readOnly={readOnly}
        onFocus={(e) => {
          if (readOnly) {
            e.target.select();
          }
        }}
        {...(disabled ? { disabled } : {})}
        {...rest}
      />
      {suffix && (
        <div
          className={clsx([
            "relative",
            typeof suffix === "string" &&
              "text-gray-6 mx-2 mt-2 select-none border-l border-l-custom-2 pl-1",
            suffixClassName,
          ])}
        >
          {suffix}
        </div>
      )}
      {action && <div className="absolute top-1 right-1">{action}</div>}
    </div>
  );
}
