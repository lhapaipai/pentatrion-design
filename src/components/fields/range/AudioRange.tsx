import { useMemo, useState, ChangeEvent, useRef, KeyboardEvent, ComponentProps } from "react";

import clsx from "clsx";
import { ThemeColor } from "../../../types";

export const formatTime = (time: number) => {
  let seconds: string | number = time % 60;
  const foo = time - seconds;
  const minutes = foo / 60;
  if (seconds < 10) {
    seconds = `0${Math.floor(seconds)}`;
  } else {
    seconds = Math.floor(seconds).toFixed(0);
  }
  return minutes + ":" + seconds;
};

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
  | "onKeyDown"
  | "ref"
> {
  value: number;

  min?: number;
  max?: number;
  step?: number;

  color?: ThemeColor;

  formatter?: (str: number) => string;

  valueClassName?: string;

  onChangeCommitted?: (valueAsNumber: number) => void;
}

const trackBase = "pointer-events-none absolute top-0 left-0 h-full";

export function AudioRange({
  className,
  valueClassName,
  value: controlledValue,
  min = 0,
  max = 100,
  color = "yellow",
  step = 1,
  formatter = formatTime,
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

  const cssVars = useMemo(
    () => ({
      "--p8n-range-progress-percent": `${percent * 100}%`,
    }),
    [percent],
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

  function handleKeyDown(e: KeyboardEvent) {
    const currentVal = rangeRef.current.valueAsNumber;
    switch (e.code) {
      case "ArrowLeft": {
        e.preventDefault();
        onChangeCommitted?.(Math.max(min, currentVal - 5));
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        onChangeCommitted?.(Math.min(max, currentVal + 5));
        break;
      }
    }
  }

  return (
    <div className="flex items-center">
      <div className={clsx("text-right", valueClassName)}>{formatter(value)}</div>

      <div
        className={clsx("group relative flex flex-1", className)}
        style={cssVars}
        data-color={color}
      >
        <div className={clsx(trackBase, "right-0 bottom-0 flex items-center justify-center")}>
          <div className="relative h-2 w-[calc(100%-2rem)]">
            {/* track full */}
            <div
              className={clsx(
                trackBase,
                "track bg-custom-2/50 after:bg-custom-2/50 w-full after:absolute after:left-[calc(100%-.25rem)] after:h-2 after:w-2 after:rounded-full after:mask-l-from-50% after:mask-l-to-transparent after:mask-l-to-50%",
              )}
            ></div>

            {/* active zone */}
            <div
              className={clsx(
                trackBase,
                "from-gray-8/70 to-gray-8/50 before:bg-gray-8/70 bg-linear-to-r from-5%",
                "group-hover:from-custom-4 group-hover:to-custom-3 group-hover:before:bg-custom-4 group-hover:bg-linear-to-r",

                "w-(--p8n-range-progress-percent) rounded-r-sm",
                "before:absolute before:-left-1 before:h-2 before:w-2 before:rounded-full before:mask-r-from-50% before:mask-r-to-transparent before:mask-r-to-50%",
              )}
            ></div>
          </div>
        </div>
        <input
          autoComplete="off"
          type="range"
          className={clsx(
            "p8n-input-audio-range h-8 w-full min-w-0 cursor-pointer bg-transparent outline-offset-[0.75rem]",
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
          onKeyDown={handleKeyDown}
          {...rest}
        />
      </div>
      <div className={clsx(valueClassName)}>{formatter(max)}</div>
    </div>
  );
}
