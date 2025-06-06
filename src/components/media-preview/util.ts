import { BasicMedia, BasicMediaImage } from "./types";

export function isMediaImage(media: BasicMedia | null | undefined): media is BasicMediaImage {
  return (
    media !== undefined &&
    media !== null &&
    media.mimeType.startsWith("image/") &&
    !!media.width &&
    !!media.height
  );
}
