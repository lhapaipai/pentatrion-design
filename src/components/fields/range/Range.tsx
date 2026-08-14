import { useMemo, ComponentProps, useState, ChangeEvent, useRef } from "react";

import clsx from "clsx";
import { ThemeColor } from "../../../types";

export interface RangeProps extends Omit<
  ComponentProps<"input">,
  | "value"
  | "defaultValue"
  | "min"
  | "max"
  | "step"
  | "onPointerDown"
  | "onPointerUp"
  | "onTouchEnd"
  | "ref"
> {
  value: number;

  additionalBarValue?: number;

  min?: number;
  max?: number;
  step?: number;

  showMinMax?: "onHover" | "always" | "never";

  showValue?: boolean;

  ticks?: boolean;

  valuesByTick?: number;

  color?: ThemeColor;

  formatter?: (str: number) => string;

  onChangeCommitted?: (valueAsNumber: number) => void;
}

const trackBase = "pointer-events-none absolute top-0 left-0 h-full";

export function Range({
  className,
  additionalBarValue,
  value: controlledValue,
  min = 0,
  max = 100,
  color = "yellow",
  showMinMax = "onHover",
  step = 1,
  valuesByTick,
  showValue = true,
  ticks = false,
  formatter = (str) => str?.toString(),
  onChange,
  onChangeCommitted,
  ...rest
}: RangeProps) {
  const rangeRef = useRef<HTMLInputElement>(null!);

  const [tempValue, setTempValue] = useState<number | undefined>(undefined);
  const isTemp = typeof tempValue !== "undefined";

  const value = isTemp ? tempValue : controlledValue;

  const range = max - min;
  const percent = (value - min) / range;
  const additionalPercent = additionalBarValue ? (additionalBarValue - min) / range : 0;
  const nbOfTicks = 1 + Math.floor(range / (valuesByTick ?? step ?? 5));

  const cssVars = useMemo(
    () => ({
      "--p8n-range-progress-percent": `${percent * 100}%`,
      "--p8n-range-additional-percent": `${additionalPercent * 100}%`,
    }),
    [percent, additionalPercent],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isTemp) {
      setTempValue(e.target.valueAsNumber);
    }
    onChange?.(e);
  };

  function handleSeekStart() {
    setTempValue(rangeRef.current.valueAsNumber);
  }
  function handleSeekEnd() {
    setTempValue(undefined);
    onChangeCommitted?.(rangeRef.current.valueAsNumber);
  }

  function handleKeyUp() {
    onChangeCommitted?.(rangeRef.current.valueAsNumber);
  }

  return (
    <div className={clsx("group relative flex", className)} style={cssVars} data-color={color}>
      {showMinMax !== "never" && (
        <>
          <div
            className={clsx(
              "text-body-xs absolute top-6 left-4 -translate-x-2/4",
              showMinMax === "onHover" && "opacity-0 transition-opacity group-hover:opacity-100",
            )}
          >
            {formatter(min)}
          </div>
          <div
            className={clsx(
              "text-body-xs absolute top-6 right-4 translate-x-2/4",
              showMinMax === "onHover" && "opacity-0 transition-opacity group-hover:opacity-100",
            )}
          >
            {formatter(max)}
          </div>
        </>
      )}

      <div className={clsx(trackBase, "right-0 bottom-0 flex items-center justify-center")}>
        <div className="relative h-2 w-[calc(100%-2rem)]">
          {/* track full */}
          <div
            className={clsx(
              trackBase,
              "track w-full bg-custom-1 after:absolute after:left-[calc(100%-.25rem)] after:h-2 after:w-2 after:rounded-full after:bg-custom-1",
            )}
          ></div>
          {typeof additionalBarValue !== "undefined" && (
            <div
              className={clsx(
                trackBase,
                "w-(--p8n-range-additional-percent) rounded-[3px] bg-custom-2 before:absolute before:-left-1 before:h-2 before:w-2 before:rounded-full before:bg-custom-2",
              )}
            ></div>
          )}
          {showValue && (
            <div className="text-body-sm pointer-events-none absolute bottom-4 left-(--p8n-range-progress-percent) -translate-x-2/4">
              {formatter(value)}
            </div>
          )}
          {/* active zone */}
          <div
            className={clsx(
              trackBase,
              "w-(--p8n-range-progress-percent) rounded-[3px] bg-custom-4 before:absolute before:-left-1 before:h-2 before:w-2 before:rounded-full before:bg-custom-4",
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
                <span key={i} className="bg-gray-0 h-1 w-1 rounded-full"></span>
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
        ref={rangeRef}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        onPointerDown={handleSeekStart}
        onPointerUp={handleSeekEnd}
        onTouchEnd={handleSeekEnd}
        onKeyUp={handleKeyUp}
        {...rest}
      />
    </div>
  );
}
