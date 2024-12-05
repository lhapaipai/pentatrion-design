import clsx from "clsx";
import { ChangeEvent, ComponentPropsWithRef, forwardRef, useState } from "react";

export type MappedStarOption = {
  value: string;
  label: string;
};

export interface MappedStarsProps
  extends Omit<ComponentPropsWithRef<"input">, "defaultValue" | "onChange" | "value" | "step"> {
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: MappedStarOption[];
  value?: string;
  showLabel?: boolean;
  labelClassName?: string;
}

export const MappedStars = forwardRef<HTMLInputElement, MappedStarsProps>(function MappedStars(
  {
    defaultValue,
    onChange,
    options,
    value: controlledValue,
    showLabel = false,
    labelClassName,
    ...rest
  },
  ref,
) {
  const [unControlledValue, setUnControlledValue] = useState(defaultValue);
  const isControlled = typeof onChange !== "undefined";
  const value = isControlled ? controlledValue : unControlledValue;

  const rangeValue = options.findIndex((o) => o.value === value);

  const [hoveredRangeValue, setHoveredRangeValue] = useState(-1);

  function handleClickStar(nextRangeValue: number) {
    const nextValue = options[nextRangeValue].value;
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
    const nextValue = options[event.target.valueAsNumber].value;
    if (isControlled) {
      onChange(nextValue);
    } else {
      setUnControlledValue(nextValue);
    }
  }

  const currentValue = hoveredRangeValue !== -1 ? hoveredRangeValue : rangeValue;

  return (
    <div>
      <input readOnly {...rest} value={value} type="hidden" ref={ref} />
      <input
        onChange={handleInputChange}
        value={rangeValue}
        type="range"
        min={0}
        max={options.length - 1}
        className="peer h-0 w-0 -translate-x-[9999px] overflow-hidden"
      />
      <span
        className="rounded-2xl peer-focus:outline peer-focus:outline-2 peer-focus:outline-[rgb(var(--color-custom-5))]"
        data-color="yellow"
      >
        {Array.from({ length: options.length }).map((_, i) => {
          const hasChanged = hoveredRangeValue !== rangeValue;
          return (
            <i
              key={i}
              onMouseOver={() => setHoveredRangeValue(i)}
              onMouseOut={() => setHoveredRangeValue(-1)}
              onClick={() => handleClickStar(i)}
              className={clsx(
                "cursor-pointer",
                i <= currentValue
                  ? hasChanged && hoveredRangeValue !== -1
                    ? "fe-star text-yellow-3"
                    : "fe-star text-yellow-4"
                  : "fe-star-empty text-gray-2",
              )}
            />
          );
        })}
      </span>
      {showLabel && (
        <span className={clsx(labelClassName ?? "ml-2 text-body-sm text-gray-7")}>
          {options[currentValue].label}
        </span>
      )}
    </div>
  );
});
