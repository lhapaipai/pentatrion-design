import type { Media, MediaImage } from "../fields/file";

export function isMediaImage(media: Media | null | undefined): media is MediaImage {
  return (
    media !== undefined &&
    media !== null &&
    media.mimeType.startsWith("image/") &&
    !!media.width &&
    !!media.height
  );
}
