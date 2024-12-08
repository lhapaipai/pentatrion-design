import { forwardRef, useMemo, ComponentPropsWithRef, useState, ChangeEvent } from "react";

import clsx from "clsx";
import { ThemeColor } from "../../types";

export interface RangeProps
  extends Omit<ComponentPropsWithRef<"input">, "value" | "defaultValue" | "min" | "max" | "step"> {
  defaultValue?: number;
  value?: number;

  min?: number;
  max?: number;
  step?: number;

  showMinMax?: "onHover" | "always" | "never";

  showValue?: boolean;

  ticks?: boolean;

  valuesByTick?: number;

  color?: ThemeColor;

  formatter?: (str: number) => string;
}

const trackBase = "pointer-events-none absolute top-0 left-0 h-full";

export const Range = forwardRef<HTMLInputElement, RangeProps>(function Range(
  {
    className,
    defaultValue,
    value: controlledValue,
    min = 0,
    max = 100,
    color = "yellow",
    showMinMax = "onHover",
    step = 1,
    valuesByTick,
    showValue = true,
    ticks = false,
    formatter = (str) => str.toString(),
    onChange,
    ...rest
  }: RangeProps,
  ref,
) {
  const isControlled = typeof controlledValue !== "undefined";

  const [unControlledValue, setUnControlledValue] = useState(defaultValue);

  const value = (isControlled ? controlledValue : unControlledValue)!;

  const range = max - min;
  const percent = (value - min) / range;

  const nbOfTicks = 1 + Math.floor(range / (valuesByTick ?? step ?? 5));

  const cssVars = useMemo(
    () => ({
      "--p8n-range-c-bg": `var(--color-${color}-2)`,
      "--p8n-range-c-fg": `var(--color-${color}-4)`,
      "--p8n-range-progress-percent": `${percent * 100}%`,
    }),
    [color, percent],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUnControlledValue(e.target.valueAsNumber);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={clsx("group relative flex", className)} style={cssVars}>
      {showMinMax !== "never" && (
        <>
          <div
            className={clsx(
              "absolute left-4 top-6 -translate-x-2/4 text-body-xs",
              showMinMax === "onHover" && "opacity-0 transition-opacity group-hover:opacity-100",
            )}
          >
            {formatter(min)}
          </div>
          <div
            className={clsx(
              "absolute right-4 top-6 translate-x-2/4 text-body-xs",
              showMinMax === "onHover" && "opacity-0 transition-opacity group-hover:opacity-100",
            )}
          >
            {formatter(max)}
          </div>
        </>
      )}

      <div className={clsx(trackBase, "bottom-0 right-0 flex items-center justify-center")}>
        <div className="relative h-2 w-[calc(100%-2rem)]">
          {/* track full */}
          <div
            className={clsx(
              trackBase,
              "track w-full bg-[rgb(var(--p8n-range-c-bg))] after:absolute after:left-[calc(100%-.25rem)] after:h-2 after:w-2 after:rounded-full after:bg-[rgb(var(--p8n-range-c-bg))]",
            )}
          ></div>
          {showValue && (
            <div className="pointer-events-none absolute bottom-4 left-[var(--p8n-range-progress-percent)] -translate-x-2/4 text-body-sm">
              {formatter(value)}
            </div>
          )}

          {/* active zone */}
          <div
            className={clsx(
              trackBase,
              "w-[var(--p8n-range-progress-percent)] rounded-[3px] bg-[rgb(var(--p8n-range-c-fg))] before:absolute before:-left-1 before:h-2 before:w-2 before:rounded-full before:bg-[rgb(var(--p8n-range-c-fg))]",
            )}
          ></div>
          {/* ticks */}
          {ticks && (
            <div
              className={clsx(
                trackBase,
                "-mx-0.5 flex w-[calc(100%+0.25rem)] items-center justify-between",
              )}
            >
              {Array.from({ length: nbOfTicks }).map((_, i) => (
                <span key={i} className="h-1 w-1 rounded-full bg-gray-0"></span>
              ))}
            </div>
          )}
        </div>
      </div>
      <input
        type="range"
        className={clsx(
          "p8n-input-range h-8 w-full min-w-0 bg-transparent outline-offset-[0.75rem]",
        )}
        ref={ref}
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        value={controlledValue}
        onChange={handleChange}
        {...rest}
      />
    </div>
  );
});
