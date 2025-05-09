import { ComponentProps } from "react";
import { getIconByMime } from "./getIconByMime";
import clsx from "clsx";
import { BasicMedia } from "./types";

interface Props extends ComponentProps<"div"> {
  media: BasicMedia | null;
}
export function FileIcon({ media, className, ...rest }: Props) {
  const { color, icon } = getIconByMime(media?.mimeType);

  return (
    <div
      style={{ backgroundColor: color }}
      className={clsx("flex aspect-4/3 items-center justify-center p-2", className)}
      {...rest}
    >
      {icon ? (
        <>
          <div className="aspect-58/76 h-full w-auto rounded-2xl bg-white"></div>
          <span
            style={{ color }}
            className="absolute top-1/2 left-1/2 h-full max-h-[60%] w-full max-w-[60%] -translate-x-1/2 -translate-y-1/2"
          >
            {icon}
          </span>
        </>
      ) : (
        <span className="text-body-5xl">?</span>
      )}
    </div>
  );
}
