import clsx from "clsx";
import { ChangeEvent, ComponentPropsWithRef, RefObject, useRef, useState } from "react";
import { useMergeRefs } from "../../hooks";
import { Button } from "../button";

export type MappedStarOption = {
  value: string;
  label: string;
};

export interface MappedStarsProps
  extends Omit<ComponentPropsWithRef<"input">, "defaultValue" | "onChange" | "value"> {
  onChange?: (value: string | null) => void;
  value?: string | null;
  defaultValue?: string | null;
  options: MappedStarOption[];
  showLabel?: boolean;
  labelClassName?: string;
  ref?: RefObject<HTMLInputElement>;
}

export function MappedStars({
  onChange,
  value: controlledValue,
  defaultValue,
  options,
  showLabel = false,
  labelClassName,
  required = false,
  ref,
  ...rest
}: MappedStarsProps) {
  const isControlled = typeof controlledValue !== "undefined";

  const [unControlledValue, setUnControlledValue] = useState(defaultValue);
  const [hoveredRangeValue, setHoveredRangeValue] = useState(-1);

  const value = isControlled ? controlledValue : unControlledValue;

  if (typeof value === "undefined") {
    throw Error("you have to define either value or defaultValue");
  }

  const inputTextRef = useRef<HTMLInputElement>(null!);
  const combinedRef = useMergeRefs([inputTextRef, ref]);
  const inputRangeRef = useRef<HTMLInputElement>(null!);

  const rangeValue = options.findIndex((o) => o.value === value);

  function handleClickStar(nextRangeValue: number) {
    const nextValue = options[nextRangeValue].value;
    inputTextRef.current.value = nextValue.toString();

    if (!isControlled) {
      inputRangeRef.current.value = nextValue.toString();
      setUnControlledValue(nextValue);
    }

    if (onChange) {
      onChange(nextValue);
    }
  }

  /**
   * for a11y
   */
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = options[event.target.valueAsNumber].value;
    inputTextRef.current.value = nextValue.toString();

    if (!isControlled) {
      setUnControlledValue(nextValue);
    }

    if (onChange) {
      onChange(nextValue);
    }
  }

  function handleReset() {
    if (!isControlled) {
      setUnControlledValue(null);
    }

    onChange && onChange(null);
  }

  const currentValue = hoveredRangeValue !== -1 ? hoveredRangeValue : rangeValue;

  return (
    <div>
      <input
        readOnly
        {...rest}
        value={value ?? /* any value, control is disabled */ ""}
        disabled={value === null}
        type="hidden"
        ref={combinedRef}
      />
      <input
        ref={inputRangeRef}
        onChange={handleInputChange}
        disabled={rangeValue === -1}
        value={rangeValue}
        type="range"
        min={0}
        max={options.length - 1}
        className="peer h-0 w-0 -translate-x-[9999px] overflow-hidden"
      />
      <span
        className="rounded-2xl peer-focus:outline-2 peer-focus:outline-(--color-custom-5)"
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
      {!required && rangeValue !== -1 && (
        <Button icon size="small" onClick={handleReset} variant="text">
          <i className="fe-cancel"></i>
        </Button>
      )}
      {showLabel && currentValue !== -1 && (
        <span className={clsx(labelClassName ?? "text-body-sm text-gray-7 ml-2")}>
          {options[currentValue].label}
        </span>
      )}
      {/* {rangeValue === null ? "null" : (rangeValue ?? "undefined")}|
      {value === null ? "null" : (value ?? "undefined")} */}
    </div>
  );
}
