import { ComponentProps, useState, ChangeEvent, useRef, useEffect, useEffectEvent } from "react";

import clsx from "clsx";
import { ThemeColor } from "../../../types";

export interface RangeProps extends Omit<
  ComponentProps<"input">,
  "value" | "defaultValue" | "min" | "max" | "step" | "aria-valuetext" | "ref"
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

  formatter?: (value: number) => string;

  /**
   * text announced by screen readers (aria-valuetext), `formatter` by default
   */
  valueTextFormatter?: (value: number) => string;

  onChangeCommitted?: (valueAsNumber: number) => void;
}

const trackBase = "pointer-events-none absolute top-0 left-0 h-full";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

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
  formatter = (value) => value.toString(),
  valueTextFormatter = formatter,
  onChange,
  onChangeCommitted,
  ...rest
}: RangeProps) {
  const rangeRef = useRef<HTMLInputElement>(null!);

  // value being adjusted by the user, not committed yet
  const [tempValue, setTempValue] = useState<number | undefined>(undefined);
  const value = tempValue ?? controlledValue;

  const range = max - min;
  const toPercent = (v: number) => (range > 0 ? clamp((v - min) / range, 0, 1) : 0);
  const percent = toPercent(value);
  const additionalPercent = additionalBarValue === undefined ? 0 : toPercent(additionalBarValue);
  const nbOfTicks = 1 + Math.floor(range / (valuesByTick ?? step));

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTempValue(e.target.valueAsNumber);
    onChange?.(e);
  };

  // React's onChange is bound to the native "input" event. The native "change" event
  // is fired once the user commits: pointer/touch release, keyboard, assistive technologies.
  const handleNativeChange = useEffectEvent(() => {
    setTempValue(undefined);
    onChangeCommitted?.(rangeRef.current.valueAsNumber);
  });

  useEffect(() => {
    const input = rangeRef.current;
    input.addEventListener("change", handleNativeChange);
    return () => input.removeEventListener("change", handleNativeChange);
  }, []);

  return (
    <div
      className={clsx("group relative flex", className)}
      style={{
        "--p8n-range-progress-percent": `${percent * 100}%`,
        "--p8n-range-additional-percent": `${additionalPercent * 100}%`,
      }}
      data-color={color}
    >
      {showMinMax !== "never" && (
        <>
          <div
            aria-hidden
            className={clsx(
              "text-body-xs absolute top-6 left-4 -translate-x-2/4",
              showMinMax === "onHover" && "opacity-0 transition-opacity group-hover:opacity-100",
            )}
          >
            {formatter(min)}
          </div>
          <div
            aria-hidden
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
            <div
              aria-hidden
              className="text-body-sm pointer-events-none absolute bottom-4 left-(--p8n-range-progress-percent) -translate-x-2/4"
            >
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
        ref={rangeRef}
        type="range"
        className="p8n-input-range h-8 w-full min-w-0 bg-transparent outline-offset-[0.75rem]"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueTextFormatter(value)}
        onChange={handleInput}
        {...rest}
      />
    </div>
  );
}
