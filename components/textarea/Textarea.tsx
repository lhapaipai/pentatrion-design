import clsx from "clsx";
import { forwardRef, ComponentProps, ReactNode } from "react";
import type { ThemeColor } from "../../types";

export interface TextareaProps extends ComponentProps<"textarea"> {
  variant?: "normal" | "ghost";
  color?: ThemeColor;
  action?: ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { variant = "normal", color = "yellow", disabled = false, className, readOnly, action, ...rest },
  ref,
) {
  return (
    <div className={clsx("relative block", className)}>
      <textarea
        data-color={color}
        data-variant={variant}
        ref={ref}
        className={clsx(
          "p8n-textarea h-full w-full min-w-0 appearance-none rounded-2xl bg-transparent p-2 outline-offset-[-1px] filter-none",
          disabled && "disabled",
          readOnly && "readonly",
        )}
        readOnly={readOnly}
        onClick={() => {
          if (readOnly) {
            // it's better to listen onClick instead of onFocus. the event is triggered later and there
            // was an issue if we listen on onFocus and user click on the text of the textarea with Firefox
            (document.activeElement as HTMLInputElement)?.select();
          }
        }}
        disabled={disabled}
        {...rest}
      />
      {action && <div className="absolute right-1 top-1">{action}</div>}
    </div>
  );
});
