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
        "group relative overflow-hidden rounded-xl bg-gray-1 shadow-sm",
        squareContainer && "aspect-[4/3]",
        className,
      )}
      {...rest}
    >
      {isMediaImage(media) ? (
        <div
          className={clsx(
            "flex items-center justify-center",
            squareContainer && "aspect-[4/3] p-2",
          )}
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
          "bg-gradient-to-t from-gray-7/25 to-gray-7/0 transition-[height] duration-150 ease-out group-hover:from-gray-7/50",
        )}
      ></div>
      <div className="absolute left-0 right-0 top-1/2 flex translate-y-0 items-center justify-center opacity-0 transition group-hover:-translate-y-1/2 group-hover:opacity-100">
        {children}
      </div>
    </div>
  );
}
