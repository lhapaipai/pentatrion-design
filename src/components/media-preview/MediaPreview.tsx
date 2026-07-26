import { CSSProperties, ReactNode, useMemo } from "react";
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
  children?: ReactNode;

  /* for non image Media */
  mediaRatio?: number;
}

export function MediaPreview({
  children,
  media,
  fit = "original",
  className,
  imageClassName,
  mediaRatio,
  ...rest
}: Props) {
  const isImage = isMediaImage(media);
  const cssProperties = useMemo(() => {
    if (media?.width && media?.height) {
      return { "--media-ratio": media.width / media.height } as CSSProperties;
    } else if (mediaRatio) {
      return { "--media-ratio": mediaRatio } as CSSProperties;
    } else {
      return {};
    }
  }, [media, mediaRatio]);

  return (
    <div
      className={clsx(
        "group bg-gray-1 relative overflow-hidden rounded-2xl shadow-sm",
        fit === "original" && (isImage || mediaRatio) ? "aspect-(--media-ratio)" : "aspect-video",
        className,
      )}
      style={cssProperties}
      {...rest}
    >
      {isImage ? (
        <img
          src={media.src}
          srcSet={media.srcSet}
          sizes={media.sizes}
          width={media.width}
          height={media.height}
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
              "pointer-fine:from-gray-7/25 absolute bottom-0 left-0 w-full overflow-hidden pointer-fine:h-10",
              // gradient animation
              "from-gray-7/50 to-gray-7/0 group-hover:from-gray-7/50 bg-linear-to-t transition-[height] duration-150 ease-out",
              "h-full group-hover:h-full",
              "will-change-transform",
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
