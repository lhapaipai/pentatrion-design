import clsx from "clsx";
import { ComponentProps, ReactNode, RefObject } from "react";
import type { ThemeColor } from "../../types";

export interface TextareaProps extends ComponentProps<"textarea"> {
  variant?: "normal" | "ghost";
  color?: ThemeColor;
  action?: ReactNode;
  ref?: RefObject<HTMLTextAreaElement>;
}

export function Textarea({
  variant = "normal",
  color = "yellow",
  disabled = false,
  className,
  readOnly,
  action,
  ref,
  ...rest
}: TextareaProps) {
  return (
    <div className={clsx("relative block", className)}>
      <textarea
        data-color={color}
        data-variant={variant}
        ref={ref}
        className={clsx(
          "p8n-textarea h-full w-full min-w-0 appearance-none rounded-2xl bg-transparent p-2 outline-offset-[-1px] filter-none",
        )}
        readOnly={readOnly}
        onFocus={(e) => {
          if (readOnly) {
            e.target.select();
          }
        }}
        disabled={disabled}
        {...rest}
      />
      {action && <div className="absolute top-1 right-1">{action}</div>}
    </div>
  );
}
