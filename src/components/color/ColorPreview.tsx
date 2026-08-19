import { ComponentProps, RefObject, useImperativeHandle, useRef } from "react";
import clsx from "clsx";
import { useRipple } from "pentatrion-design/hooks";
import { Color, defaultColorTheme, defaultNamedColor, ColorTheme } from "./config";
import { getColorValue } from "./util";

export interface ColorPreviewProps extends Omit<ComponentProps<"button">, "color"> {
  withRipple?: boolean;

  color?: Color | null;
  palette?: ColorTheme;
  showValue?: boolean;
  className?: string;
  ref?: RefObject<HTMLButtonElement>;
}

export function ColorPreview({
  color,
  palette = defaultColorTheme,
  withRipple = true,
  showValue = false,
  className,
  ref,
  ...rest
}: ColorPreviewProps) {
  color ??= defaultNamedColor;

  const valueToShow = showValue ? (color.type === "raw" ? color.value : color.name) : null;

  const buttonRef = useRef<HTMLButtonElement>(null!);

  useImperativeHandle<HTMLButtonElement | null, HTMLButtonElement | null>(
    ref,
    () => buttonRef.current,
  );

  const ripples = useRipple(buttonRef);

  return (
    <button
      ref={buttonRef}
      data-color="yellow"
      className="p8n-input-text group relative flex h-8 cursor-pointer overflow-clip rounded-2xl p-1 -outline-offset-1 active:translate-y-px"
      {...rest}
    >
      {withRipple && ripples}
      <span
        className={clsx(
          "absolute inset-1 flex items-center justify-center rounded-2xl transition-transform group-hover:scale-150",
          valueToShow === null && "min-w-12",
          className,
        )}
        style={{ backgroundColor: getColorValue(color, palette) }}
      ></span>
      <span
        className={clsx(
          "relative flex h-full items-center justify-center px-2",
          valueToShow === null && "min-w-12",
          className,
        )}
      >
        {valueToShow}
      </span>
    </button>
  );
}
