import type { Meta } from "@storybook/react";

import { MediaPreview } from "./MediaPreview";
import { Button } from "../button";
import { Media } from "./types";

const meta = {
  title: "Components/MediaPreview",
  component: MediaPreview,
} satisfies Meta<typeof MediaPreview>;

export default meta;

const gallery: (Media | null)[] = [
  {
    id: "1",
    width: 400,
    height: 300,
    src: "/medias/400x300.jpg",
    mimeType: "image/jpeg",
  },
  {
    id: "2",
    width: 300,
    height: 400,
    src: "/medias/300x400.jpg",
    mimeType: "image/jpeg",
  },
  {
    id: "3",
    width: 400,
    height: 400,
    src: "/medias/400x400.jpg",
    mimeType: "image/jpeg",
  },
  {
    id: "4",
    src: "/medias/other.txt",
    mimeType: "text/plain",
  },
  {
    id: "5",
    src: "/medias/other.jpg",
    mimeType: "image/jpeg",
  },
  {
    id: "6",
    src: "/medias/other.mp3",
    mimeType: "audio/mp3",
  },
  {
    id: "7",
    src: "/medias/other.mp4",
    mimeType: "video/mp4",
  },
  {
    id: "8",
    src: "/medias/other.pdf",
    mimeType: "application/pdf",
  },
  {
    id: "9",
    src: "/medias/other.zip",
    mimeType: "application/zip",
  },
  {
    id: "10",
    src: "/medias/other",
    mimeType: "unknown",
  },
  null,
];

export const Context = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid-cols-repeat-fill-200 grid gap-4">
        {gallery.map((media, i) => (
          <MediaPreview media={media} key={i} squareContainer={true}>
            <Button type="button" icon color="gray" size="large">
              <i className="fe-trash text-body-xl"></i>
            </Button>
          </MediaPreview>
        ))}
      </div>
      <div className="flex flex-wrap items-start gap-4">
        {gallery.map((media, i) => (
          <MediaPreview media={media} key={i} className="w-48">
            <Button type="button" icon color="gray" size="large">
              <i className="fe-trash text-body-xl"></i>
            </Button>
          </MediaPreview>
        ))}
      </div>
    </div>
  );
};
