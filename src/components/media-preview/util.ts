import { Media, MediaImage } from "./types";

export function isMediaImage(media: Media | null): media is MediaImage {
  return (
    media !== undefined &&
    media !== null &&
    media.mimeType.startsWith("image/") &&
    !!media.width &&
    !!media.height
  );
}
