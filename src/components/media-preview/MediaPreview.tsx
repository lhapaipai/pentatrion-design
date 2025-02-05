import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import { Media } from "./types";
import { isMediaImage } from "./util";
import { FileIcon } from "./FileIcon";

interface Props extends ComponentProps<"div"> {
  children?: ReactNode;
  media: Media | null;
  src?: string;
  width?: number;
  height?: number;
  squareContainer?: boolean;
}

export function MediaPreview({
  children,
  media,
  src,
  width,
  height,
  squareContainer,
  className,
  ...rest
}: Props) {
  return (
    <div
      className={clsx(
        "group bg-gray-1 relative overflow-hidden rounded-xl shadow-xs",
        squareContainer && "aspect-4/3",
        className,
      )}
      {...rest}
    >
      {isMediaImage(media) ? (
        <div
          className={clsx("flex items-center justify-center", squareContainer && "aspect-4/3 p-2")}
        >
          <img
            src={media.src ?? src}
            width={width ?? media.width}
            height={height ?? media.height}
            className="h-auto max-h-full w-auto max-w-full rounded-xl"
          />
        </div>
      ) : (
        <FileIcon media={media} />
      )}
      <div
        className={clsx(
          "absolute bottom-0 left-0 h-10 w-full overflow-hidden rounded-md group-hover:h-full",
          // gradient animation
          "from-gray-7/25 to-gray-7/0 group-hover:from-gray-7/50 bg-linear-to-t transition-[height] duration-150 ease-out",
        )}
      ></div>
      <div className="absolute top-1/2 right-0 left-0 flex translate-y-0 items-center justify-center opacity-0 transition group-hover:-translate-y-1/2 group-hover:opacity-100">
        {children}
      </div>
    </div>
  );
}
