import { ComponentProps, RefObject, useImperativeHandle, useRef } from "react";
import type { ThemeColor } from "../../types";
import clsx from "clsx";
import { useRipple } from "../../hooks";

export interface ColorProps extends ComponentProps<"button"> {
  withRipple?: boolean;

  value?: string;
  color?: ThemeColor;
  label?: string;
  showValue?: boolean;
  className?: string;
  ref?: RefObject<HTMLButtonElement>;
}

export function Color({
  value,
  withRipple = true,
  color = "yellow",
  label,
  showValue = false,
  className,
  ref,
  ...rest
}: ColorProps) {
  const valueToShow = label ?? (showValue ? value : null);

  const buttonRef = useRef<HTMLButtonElement>(null!);

  useImperativeHandle<HTMLButtonElement | null, HTMLButtonElement | null>(
    ref,
    () => buttonRef.current,
  );

  const ripples = useRipple(buttonRef);

  return (
    <button
      ref={buttonRef}
      data-color={color}
      className="p8n-input-text relative flex h-8 overflow-clip rounded-2xl p-1 outline-offset-[-1px]"
      {...rest}
    >
      {withRipple && ripples}
      <span
        className={clsx(
          "flex h-full items-center justify-center rounded-2xl px-2",
          valueToShow === null && "min-w-12",
          className,
        )}
        style={{ backgroundColor: value }}
      >
        {valueToShow}
      </span>
    </button>
  );
}
