import { ComponentProps } from "react";
import { getIconByMime } from "./getIconByMime";
import clsx from "clsx";
import { BasicMedia } from "./types";

interface Props extends ComponentProps<"div"> {
  media?: BasicMedia | null;
  mimeType?: string;
}
export function FileIcon({ mimeType, media, className, ...rest }: Props) {
  const { color, icon } = getIconByMime(mimeType ?? media?.mimeType);

  return (
    <div
      className={clsx("flex h-full w-full items-center justify-center bg-white", className)}
      {...rest}
    >
      {icon ? (
        <>
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
