import clsx from "clsx";
import { ChangeEvent, ComponentPropsWithRef, forwardRef, useState } from "react";

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
  const [hoveredValue, setHoveredValue] = useState(-1);

  const isControlled = typeof onChange !== "undefined";
  const value = isControlled ? controlledValue : unControlledValue;

  function handleClickStar(nextValue: number) {
    if (isControlled) {
      onChange(nextValue);
    } else {
      setUnControlledValue(nextValue);
    }
  }

  /**
   * for a11y
   */
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.valueAsNumber;
    if (isControlled) {
      onChange(nextValue);
    } else {
      setUnControlledValue(nextValue);
    }
  }

  const currentValue = hoveredValue !== -1 ? hoveredValue : value;

  return (
    <div>
      <input
        onChange={handleInputChange}
        {...rest}
        value={value}
        type="range"
        min={1}
        max={max}
        step={step}
        ref={ref}
        className="peer h-0 w-0 -translate-x-[9999px] overflow-hidden"
      />
      <span
        className="rounded-2xl peer-focus:outline peer-focus:outline-2 peer-focus:outline-[rgb(var(--color-custom-5))]"
        data-color="yellow"
      >
        {Array.from({ length: max }).map((_, i) => {
          const hasChanged = hoveredValue !== value;
          return (
            <i
              key={i}
              onMouseOver={() => setHoveredValue(i + 1)}
              onMouseOut={() => setHoveredValue(-1)}
              onClick={() => handleClickStar(i + 1)}
              className={clsx(
                "cursor-pointer",
                i < currentValue
                  ? hasChanged && hoveredValue !== -1
                    ? "fe-star text-yellow-3"
                    : "fe-star text-yellow-4"
                  : "fe-star-empty text-gray-2",
              )}
            />
          );
        })}
      </span>
    </div>
  );
});
