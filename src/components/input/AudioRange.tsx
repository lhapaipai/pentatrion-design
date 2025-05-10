import { useMemo, ComponentPropsWithRef, useState, ChangeEvent, RefObject } from "react";

import clsx from "clsx";
import { ThemeColor } from "../../types";

export interface RangeProps
  extends Omit<ComponentPropsWithRef<"input">, "value" | "defaultValue" | "min" | "max" | "step"> {
  defaultValue?: number | string;
  value?: number | string;

  min?: number;
  max?: number;
  step?: number;

  color?: ThemeColor;

  formatter?: (str: number) => string;

  ref?: RefObject<HTMLInputElement>;
}

const trackBase = "pointer-events-none absolute top-0 left-0 h-full";

export function AudioRange({
  className,
  defaultValue,
  value: controlledValue,
  min = 0,
  max = 100,
  color = "yellow",
  step = 1,
  formatter = (str) => str?.toString(),
  onChange,
  ref,
  ...rest
}: RangeProps) {
  const isControlled = typeof controlledValue !== "undefined";

  const [unControlledValue, setUnControlledValue] = useState(defaultValue);

  const value = (isControlled ? controlledValue : unControlledValue)!;
  const valueAsNumber = typeof value === "string" ? parseInt(value) : value;

  const range = max - min;
  const percent = (valueAsNumber - min) / range;

  const cssVars = useMemo(
    () => ({
      "--p8n-range-c-bg": `var(--color-custom-1)`,
      "--p8n-range-c-fg": `var(--color-custom-4)`,
      "--p8n-range-progress-percent": `${percent * 100}%`,
    }),
    [percent],
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
    <div className="flex items-center">
      <div className={clsx("text-body-xs w-8 text-right")}>{formatter(valueAsNumber)}</div>

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
                "bg-gray-3 before:bg-gray-3 group-hover:bg-custom-4 group-hover:before:bg-custom-4 w-[var(--p8n-range-progress-percent)] rounded-r-[4px] before:absolute before:-left-1 before:h-2 before:w-2 before:rounded-full before:mask-r-from-50% before:mask-r-to-transparent before:mask-r-to-50%",
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
      <div className={clsx("text-body-xs w-8")}>{formatter(max)}</div>
    </div>
  );
}
