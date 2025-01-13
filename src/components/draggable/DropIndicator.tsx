import { type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import clsx from "clsx";
import { CSSProperties } from "react";

interface Props {
  edge: Edge;
  gap: string;
}

type Orientation = "horizontal" | "vertical";

const edgeToOrientationMap: Record<Edge, Orientation> = {
  top: "horizontal",
  bottom: "horizontal",
  left: "vertical",
  right: "vertical",
};

const orientationStyles: Record<Orientation, string> = {
  horizontal:
    "h-[--line-thickness] left-[--circle-radius] right-0 before:left-[calc(-1*var(--circle-size))]",
  vertical:
    "w-[--line-thickness] top-[--circle-radius] bottom-0 before:top-[calc(-1*var(--circle-size))]",
};

const edgeStyles: Record<Edge, string> = {
  top: "top-[--line-offset] before:top-[--circle-offset]",
  right: "right-[--line-offset] before:right-[--circle-offset]",
  bottom: "bottom-[--line-offset] before:bottom-[--circle-offset]",
  left: "left-[--line-offset] before:left-[--circle-offset]",
};

const lineThickness = 2;
const circleSize = 8;
const offsetToAlignCircleWithLine = (lineThickness - circleSize) / 2;

export function DropIndicator({ edge, gap }: Props) {
  const lineOffset = `calc(-0.5 * (${gap} + ${lineThickness}px))`;
  const orientation = edgeToOrientationMap[edge];

  return (
    <div
      style={
        {
          "--line-thickness": `${lineThickness}px`,
          "--line-offset": `${lineOffset}`,
          "--circle-size": `${circleSize}px`,
          "--circle-radius": `${circleSize / 2}px`,
          "--circle-offset": `${offsetToAlignCircleWithLine}px`,
        } as CSSProperties
      }
      className={clsx(
        "pointer-events-none absolute z-10 box-border bg-gray-6 before:absolute before:block before:h-[--circle-size] before:w-[--circle-size] before:rounded-full before:border-[length:--line-thickness] before:border-solid before:border-gray-6 before:bg-white",
        orientationStyles[orientation],
        edgeStyles[edge],
      )}
    ></div>
  );
}
