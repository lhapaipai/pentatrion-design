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
        "group bg-gray-1 relative overflow-hidden rounded-2xl shadow-xs",
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
            src={src ?? (media.origin === "external" && media.src ? media.src : undefined)}
            width={width ?? media.width}
            height={height ?? media.height}
            className={clsx(
              "h-auto rounded-2xl",
              squareContainer ? "max-h-full w-auto max-w-full" : "w-full",
            )}
          />
        </div>
      ) : (
        <FileIcon media={media} />
      )}
      {children && (
        <>
          <div
            className={clsx(
              "pointer-fine:from-gray-7/25 absolute bottom-0 left-0 w-full overflow-hidden rounded-md pointer-fine:h-10",
              // gradient animation
              "from-gray-7/50 to-gray-7/0 group-hover:from-gray-7/50 bg-linear-to-t transition-[height] duration-150 ease-out",
              "h-full group-hover:h-full",
            )}
          ></div>
          <div
            className={clsx(
              "absolute top-1/2 right-0 left-0 flex items-center justify-center transition pointer-fine:translate-y-0 pointer-fine:opacity-0",
              "-translate-y-1/2 group-hover:-translate-y-1/2 group-hover:opacity-100 [:has(:focus)]:-translate-y-1/2 [:has(:focus)]:opacity-100",
            )}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}
