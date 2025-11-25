import clsx from "clsx";
import { ChangeEvent, ComponentPropsWithRef, RefObject, useRef, useState } from "react";
import { Button } from "../button";
import { useMergeRefs } from "../../hooks";

export interface StarsProps
  extends Omit<
    ComponentPropsWithRef<"input">,
    "onChange" | "defaultValue" | "value" | "max" | "step"
  > {
  onChange?: (value: number | null) => void;
  defaultValue?: number | null;
  value?: number | null;
  max?: number;
  step?: number;
  zeroAsResetValue?: boolean;
  ref?: RefObject<HTMLInputElement>;
}

export function Stars({
  onChange,
  defaultValue,
  value: controlledValue,
  max = 5,
  step = 1,
  required = false,
  ref,
  ...rest
}: StarsProps) {
  const isControlled = typeof controlledValue !== "undefined";

  const [unControlledValue, setUnControlledValue] = useState(defaultValue);
  const [hoveredValue, setHoveredValue] = useState(-1);

  const rangeValue = isControlled ? controlledValue : unControlledValue;

  if (typeof rangeValue === "undefined") {
    throw Error("you have to define either value or defaultValue");
  }

  const inputRef = useRef<HTMLInputElement>(null!);
  const combinedRef = useMergeRefs([inputRef, ref]);

  function handleClickStar(nextValue: number) {
    if (!isControlled) {
      inputRef.current.value = nextValue.toString();
      setUnControlledValue(nextValue);
    }

    onChange && onChange(nextValue);
  }

  /**
   * for a11y
   */
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.valueAsNumber;

    if (!isControlled) {
      setUnControlledValue(nextValue);
    }

    onChange && onChange(nextValue);
  }

  function handleReset() {
    if (!isControlled) {
      setUnControlledValue(null);
    }

    onChange && onChange(null);
  }

  const currentValue = hoveredValue !== -1 ? hoveredValue : rangeValue;

  return (
    <div>
      <input
        onChange={handleInputChange}
        value={rangeValue ?? /* any value, control is disabled */ 1}
        type="range"
        min={1}
        max={max}
        step={step}
        ref={combinedRef}
        className="peer h-0 w-0 -translate-x-[9999px] overflow-hidden"
        {...(rangeValue === null ? { disabled: true } : {})}
        {...rest}
      />
      <span
        className="rounded-2xl peer-focus:outline-2 peer-focus:outline-(--color-custom-5)"
        data-color="yellow"
      >
        {Array.from({ length: max }).map((_, i) => {
          const hasChanged = hoveredValue !== rangeValue;
          return (
            <i
              key={i}
              onMouseOver={() => setHoveredValue(i + 1)}
              onMouseOut={() => setHoveredValue(-1)}
              onClick={() => handleClickStar(i + 1)}
              className={clsx(
                "cursor-pointer",
                currentValue !== null && i < currentValue
                  ? hasChanged && hoveredValue !== -1
                    ? "fe-star text-yellow-3"
                    : "fe-star text-yellow-4"
                  : "fe-star-empty text-gray-2",
              )}
            />
          );
        })}
      </span>
      {!required && rangeValue !== null && (
        <Button icon size="small" onClick={handleReset} variant="text">
          <i className="fe-cancel"></i>
        </Button>
      )}
      {/* {rangeValue === null ? "null" : (rangeValue ?? "undefined")} */}
    </div>
  );
}
