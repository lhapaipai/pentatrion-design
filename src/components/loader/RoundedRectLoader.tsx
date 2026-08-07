import { CSSProperties, ComponentPropsWithoutRef } from "react";
import { ThemeColor } from "../../types";
import clsx from "clsx";

interface Props extends ComponentPropsWithoutRef<"svg"> {
  color?: ThemeColor | "custom";
  /**
   * Matches buttonVariants' rounded-2xl (1rem). Override for other shapes.
   */
  radius?: number;
}

const width = 4;

const trackStyle: CSSProperties = {
  strokeLinecap: "round",
  strokeWidth: width,
};
const rectStyle: CSSProperties = {
  strokeLinecap: "round",
  strokeWidth: width,
  // pathLength=100 normalizes the perimeter, so these percentages hold for any button size.
  strokeDasharray: "40, 60",
};

export function RoundedRectLoader({ color = "blue", radius = 16, className, ...rest }: Props) {
  const rx = radius - 1;

  return (
    <svg
      data-color={color}
      className={clsx(
        "pointer-events-none h-full w-full",
        color !== "custom" && "text-custom-4",
        className,
      )}
      {...rest}
    >
      <rect
        x={width / 2}
        y={width / 2}
        width={`calc(100% - ${width}px)`}
        height={`calc(100% - ${width}px)`}
        rx={rx}
        pathLength={100}
        className="fill-none stroke-current opacity-25"
        style={trackStyle}
      />
      <rect
        x={width / 2}
        y={width / 2}
        width={`calc(100% - ${width}px)`}
        height={`calc(100% - ${width}px)`}
        rx={rx}
        pathLength={100}
        className="animate-loader-rect-stroke fill-none stroke-current"
        style={rectStyle}
      />
    </svg>
  );
}
