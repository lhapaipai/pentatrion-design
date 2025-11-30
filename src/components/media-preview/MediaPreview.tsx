import { ReactNode } from "react";
import clsx from "clsx";
import { BasicMedia } from "./types";
import { isMediaImage } from "./util";
import { FileIcon } from "./FileIcon";

interface Props {
  media: BasicMedia | null;
  src?: string;
  width?: number;
  height?: number;
  fit?: "contain" | "cover" | "original";
  className?: string;
  imageClassName?: string;
  srcSet?: string;
  sizes?: string;
  children?: ReactNode;
}

export function MediaPreview({
  children,
  media,
  src,
  width,
  height,
  fit = "original",
  className,
  imageClassName,

  srcSet,
  sizes,
  ...rest
}: Props) {
  return (
    <div
      className={clsx(
        "group bg-gray-1 relative overflow-hidden rounded-2xl shadow-xs",
        fit !== "original" && "aspect-16/9",
        className,
      )}
      {...rest}
    >
      {isMediaImage(media) ? (
        <img
          src={src ?? (media.origin === "external" && media.src ? media.src : undefined)}
          srcSet={srcSet}
          sizes={sizes}
          width={width ?? media.width}
          className={clsx(
            "rounded-2xl",
            fit === "original" && "h-auto w-full",
            fit === "contain" && "h-full w-full object-contain p-2",
            fit === "cover" && "h-full w-full object-cover",
            imageClassName,
          )}
        />
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
