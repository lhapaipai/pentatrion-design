import { ComponentProps, RefObject, useImperativeHandle, useRef } from "react";
import clsx from "clsx";
import { useRipple } from "pentatrion-design/hooks";
import { Color, defaultBrandPalette, defaultNamedColor, BrandPalette } from "./config";
import { getColorValue } from "./util";
import { ThemeColor } from "../../types";

export interface ColorPreviewProps extends Omit<ComponentProps<"button">, "color" | "value"> {
  withRipple?: boolean;

  value?: Color | null | string;
  color?: ThemeColor;
  label?: string;
  palette?: BrandPalette;
  showValue?: boolean;
  className?: string;
  ref?: RefObject<HTMLButtonElement>;
}

export function ColorPreview({
  value: unknownColor,
  withRipple = true,
  color = "yellow",
  label,
  showValue = false,
  palette = defaultBrandPalette,
  className,
  ref,
  ...rest
}: ColorPreviewProps) {
  const value: Color =
    typeof unknownColor === "string"
      ? { type: "raw", hex: unknownColor }
      : (unknownColor ?? defaultNamedColor);

  const valueToShow = label ?? (showValue ? (value.type === "raw" ? value.hex : value.name) : null);

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
        style={{ backgroundColor: getColorValue(value, palette) }}
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
