import type { Meta } from "@storybook/react-vite";

import { MediaPreview } from "./MediaPreview";
import { Button } from "../button";
import { BasicMedia } from "./types";

const meta = {
  title: "Components/MediaPreview",
  component: MediaPreview,
} satisfies Meta<typeof MediaPreview>;

export default meta;

const gallery: (BasicMedia | null)[] = [
  {
    id: "1",
    width: 400,
    height: 300,
    category: "image",
    src: "/medias/400x300.jpg",
    mimeType: "image/jpeg",
  },
  {
    id: "2",
    width: 300,
    height: 400,
    category: "image",
    src: "/medias/300x400.jpg",
    mimeType: "image/jpeg",
  },
  {
    id: "3",
    width: 400,
    height: 400,
    category: "image",
    src: "/medias/400x400.jpg",
    mimeType: "image/jpeg",
  },
  {
    id: "4",
    src: "/medias/other.txt",
    category: "text",
    mimeType: "text/plain",
  },
  {
    id: "5",
    src: "/medias/other.jpg",
    category: "image",
    mimeType: "image/jpeg",
  },
  {
    id: "6",
    src: "/medias/other.mp3",
    category: "audio",
    mimeType: "audio/mp3",
  },
  {
    id: "7",
    src: "/medias/other.mp4",
    category: "video",
    mimeType: "video/mp4",
  },
  {
    id: "8",
    src: "/medias/other.pdf",
    mimeType: "application/pdf",
    category: "application",
  },
  {
    id: "9",
    src: "/medias/other.zip",
    mimeType: "application/zip",
    category: "application",
  },
  {
    id: "10",
    src: "/medias/other",
    mimeType: "unknown",
    category: "unknown",
  },
  null,
];

export const Context = () => {
  return (
    <div className="flex flex-col gap-4">
      <h3>Fit cover</h3>
      <div className="grid-cols-repeat-fill-200 grid gap-4">
        {gallery.map((media, i) => (
          <MediaPreview media={media} key={i} fit="cover">
            <Button type="button" icon color="gray" size="large">
              <i className="fe-trash text-body-xl"></i>
            </Button>
          </MediaPreview>
        ))}
      </div>
      <h3>Fit contain</h3>
      <div className="flex flex-wrap items-start gap-4">
        {gallery.map((media, i) => (
          <MediaPreview media={media} key={i} className="w-48" fit="contain">
            <Button type="button" icon color="gray" size="large">
              <i className="fe-trash text-body-xl"></i>
            </Button>
          </MediaPreview>
        ))}
      </div>
      <h3>Fit original</h3>
      <div className="flex flex-wrap items-start gap-4">
        {gallery
          .filter((media) => media?.mimeType.startsWith("image"))
          .map((media, i) => (
            <MediaPreview media={media} key={i} className="w-48" fit="original">
              <Button type="button" icon color="gray" size="large">
                <i className="fe-trash text-body-xl"></i>
              </Button>
            </MediaPreview>
          ))}
      </div>
    </div>
  );
};
