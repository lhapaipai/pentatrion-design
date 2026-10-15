import {
  useState,
  ChangeEvent,
  useRef,
  KeyboardEvent,
  ComponentProps,
  useEffect,
  useEffectEvent,
} from "react";

import clsx from "clsx";
import { ThemeColor } from "../../../types";

export const formatTime = (time: number) => {
  if (!Number.isFinite(time) || time < 0) {
    return "--:--";
  }
  const totalSeconds = Math.floor(time);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export interface AudioRangeProps extends Omit<
  ComponentProps<"input">,
  "value" | "defaultValue" | "min" | "max" | "step" | "onKeyDown" | "aria-valuetext" | "ref"
> {
  value: number;

  min?: number;
  max?: number;
  step?: number;

  /**
   * jump applied by the arrow keys, in `value` unit
   */
  keyboardStep?: number;

  color?: ThemeColor;

  formatter?: (str: number) => string;
  /**
   * text announced by screen readers (aria-valuetext)
   */
  valueTextFormatter?: (value: number, max: number) => string;

  valueClassName?: string;

  onChangeCommitted: (valueAsNumber: number) => void;
}

const trackBase = "pointer-events-none absolute top-0 left-0 h-full";

const keyboardDirections: Partial<Record<string, -1 | 1>> = {
  ArrowLeft: -1,
  ArrowDown: -1,
  ArrowRight: 1,
  ArrowUp: 1,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function AudioRange({
  className,
  valueClassName,
  value: controlledValue,
  min = 0,
  max = 100,
  color = "yellow",
  step = 1,
  keyboardStep = 5,
  formatter = formatTime,
  valueTextFormatter,
  disabled,
  onChange,
  onChangeCommitted,
  ...rest
}: AudioRangeProps) {
  const rangeRef = useRef<HTMLInputElement>(null!);

  // value being adjusted by the user, not committed yet
  const [tempValue, setTempValue] = useState<number | undefined>(undefined);
  const value = tempValue ?? controlledValue;

  const range = max - min;
  // unknown (0) or infinite duration: nothing to seek
  const isSeekable = Number.isFinite(range) && range > 0;
  const percent = isSeekable ? clamp((value - min) / range, 0, 1) : 0;

  const valueText = isSeekable
    ? (valueTextFormatter?.(value, max) ?? `${formatter(value)} / ${formatter(max)}`)
    : undefined;

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTempValue(e.target.valueAsNumber);
    onChange?.(e);
  };

  // React's onChange is bound to the native "input" event. The native "change" event
  // is fired once the user commits: pointer/touch release, keyboard, assistive technologies.
  const handleNativeChange = useEffectEvent(() => {
    setTempValue(undefined);
    onChangeCommitted(rangeRef.current.valueAsNumber);
  });

  useEffect(() => {
    const input = rangeRef.current;
    input.addEventListener("change", handleNativeChange);
    return () => input.removeEventListener("change", handleNativeChange);
  }, []);

  function handleKeyDown(e: KeyboardEvent) {
    const direction = keyboardDirections[e.key];
    if (!direction) {
      return;
    }
    e.preventDefault();
    onChangeCommitted(clamp(value + direction * keyboardStep, min, max));
  }

  return (
    <div className="flex items-center">
      <div aria-hidden className={clsx("text-right", valueClassName)}>
        {formatter(value)}
      </div>
      <div
        className={clsx("group relative flex flex-1", className)}
        style={{ "--p8n-range-progress-percent": `${percent * 100}%` }}
        data-color={color}
      >
        <div className={clsx(trackBase, "right-0 bottom-0 flex items-center justify-center")}>
          <div className="relative h-2 w-[calc(100%-2rem)]">
            {/* track full */}
            <div className={clsx(trackBase, "track bg-custom-2/50 w-full rounded-sm")}></div>
            {/* active zone */}
            <div
              className={clsx(
                trackBase,
                "from-gray-8/70 to-gray-8/50 bg-linear-to-r from-5% rounded-sm transition-colors duration-300",
                "group-hover:from-custom-4 group-hover:to-custom-3",
                "group-has-focus-visible:from-custom-4 group-has-focus-visible:to-custom-3",

                "w-(--p8n-range-progress-percent)",
              )}
            ></div>
            {/* thumb: follows `value` continuously, the native one is only a hit area */}
            <div
              className={clsx(
                "pointer-events-none absolute top-1/2 left-(--p8n-range-progress-percent) size-3.5 -translate-1/2 rounded-full bg-custom-4",
                "opacity-0 transition-[opacity,scale] duration-300",
                "group-hover:opacity-100 group-has-focus-visible:opacity-100 pointer-coarce:opacity-100",
                "group-has-active:scale-133",
                "outline-yellow-4 group-has-focus-visible:outline-2 group-has-focus-visible:outline-offset-2",
                "group-has-disabled:invisible",
              )}
            ></div>
          </div>
        </div>
        <input
          ref={rangeRef}
          type="range"
          autoComplete="off"
          className={
            "p8n-input-audio-range h-8 w-full min-w-0 cursor-pointer bg-transparent focus-visible:outline-hidden disabled:cursor-default"
          }
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled || !isSeekable}
          aria-valuetext={valueText}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          {...rest}
        />
      </div>
      <div aria-hidden className={clsx(valueClassName)}>
        {formatter(max)}
      </div>
    </div>
  );
}
