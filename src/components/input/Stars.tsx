import clsx from "clsx";
import { ComponentPropsWithRef, forwardRef, useState } from "react";

export interface StarsProps
  extends Omit<
    ComponentPropsWithRef<"input">,
    "defaultValue" | "onChange" | "value" | "max" | "step"
  > {
  onChange?: (value: number) => void;
  defaultValue?: number;
  value?: number;
  max?: number;
  step?: number;
}

export const Stars = forwardRef<HTMLInputElement, StarsProps>(function Stars(
  { max = 5, step = 1, value: controlledValue = 3, defaultValue = 3, onChange, ...rest },
  ref,
) {
  const [unControlledValue, setUnControlledValue] = useState(defaultValue);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const isControlled = typeof onChange !== "undefined";
  const value = isControlled ? controlledValue : unControlledValue;

  function handleClickStar(val: number) {
    if (isControlled) {
      onChange(val);
    } else {
      setUnControlledValue(val);
    }
  }

  return (
    <div>
      <input
        readOnly
        {...rest}
        value={value}
        type="range"
        min={1}
        max={max}
        step={step}
        ref={ref}
        className="hidden"
      />
      {Array.from({ length: max }).map((_, i) => {
        const hasChanged = hoveredValue !== value;
        const val = hoveredValue !== null ? hoveredValue : value;
        return (
          <i
            key={i}
            onMouseOver={() => setHoveredValue(i + 1)}
            onMouseOut={() => setHoveredValue(null)}
            onClick={() => handleClickStar(i + 1)}
            className={clsx(
              i < val
                ? hasChanged && hoveredValue !== null
                  ? "fe-star text-yellow-3"
                  : "fe-star text-yellow-4"
                : "fe-star-empty text-gray-2",
            )}
          />
        );
      })}
    </div>
  );
});
