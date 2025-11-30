import { CSSProperties, ComponentPropsWithoutRef, ReactNode, useId } from "react";
import { ThemeColor } from "../../types";
import clsx from "clsx";

interface Props extends ComponentPropsWithoutRef<"div"> {
  size?: "small" | "medium" | "large" | "input";
  color?: ThemeColor | "custom";
  children?: ReactNode;
  loading?: boolean;
  position?: CSSProperties["position"];
  progression?: number;
}

const sizeConfig = {
  small: "[--h-button:1.5rem]",
  medium: "[--h-button:2rem]",
  large: "[--h-button:3rem]",
  input: "[--h-button:calc(var(--h-input)-2px)]",
};

const trackStyle: CSSProperties = {
  strokeLinecap: "round",
  strokeWidth: 2,
};
const circleStyle: CSSProperties = {
  strokeLinecap: "round",
  strokeWidth: 2,

  /**
   * $total-length: 43.699; // total length of path, calculated by getTotalLength() in JS
   * $looping-percent: 40;
   * $looping-length: math.div($looping-percent * $total-length, 100) = 17.464;
   * stroke-dasharray: #{$looping-length * 1px}, #{($total-length - $looping-length) * 1px};
   */
  strokeDasharray: "17.45px, 26.21px",
};

export function Loader({
  size = "medium",
  color = "blue",
  loading = true,
  progression = -1,
  className,
  position = "relative",
  children,
  ...rest
}: Props) {
  const id = useId();

  const destPoint = {
    x: 7 * Math.sin((2 * Math.PI * progression) / 100),
    y: 7 - 7 * Math.cos((2 * Math.PI * progression) / 100),
  };

  return (
    <div
      data-color={color}
      className={clsx(
        "inline-block h-(--h-button) w-(--h-button)",
        position,
        sizeConfig[size],
        className,
      )}
      {...rest}
    >
      {loading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={clsx(
            "inline-block h-(--h-button) w-(--h-button)",
            color !== "custom" && "text-custom-4",
          )}
          viewBox="0 0 16 16"
        >
          <defs>
            <circle id={id} cx="8" cy="8" r="7" />
          </defs>
          <use href={`#${id}`} className="fill-none stroke-current opacity-25" style={trackStyle} />
          {progression === -1 ? (
            <use
              href={`#${id}`}
              className="animate-loader-stroke fill-none stroke-current"
              style={circleStyle}
            />
          ) : (
            <path
              d={`M 8,1 a 7,7 0 ${progression > 50 ? 1 : 0} 1 ${destPoint.x},${destPoint.y}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          )}
        </svg>
      )}
      {children && (
        <div className="absolute top-0 left-0 inline-flex h-(--h-button) w-(--h-button) items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
