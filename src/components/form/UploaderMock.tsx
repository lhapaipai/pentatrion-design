import { useMemo, useState } from "react";
import clsx from "clsx";
import { Button } from "../button/Button";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader } from "../modal";
import type { Media } from "./FileField";

interface Props {
  onPick: (media: Media | null) => void;
  allowedTypes?: "image" | "audio" | "all-safe";
  imageRatio?: number;
  className?: string;
}

const mockMedias: { label: string; media: Media }[] = [
  {
    label: "Image paysage",
    media: {
      id: "mock-landscape",
      origin: "external",
      category: "image",
      mimeType: "image/webp",
      width: 936,
      height: 512,
      size: null,
      src: "/images/landing-page/map.webp",
    },
  },
  {
    label: "Image portrait",
    media: {
      id: "mock-portrait",
      origin: "external",
      category: "image",
      mimeType: "image/jpeg",
      width: 600,
      height: 900,
      size: null,
      src: "https://picsum.photos/600/900",
    },
  },
  {
    label: "Audio",
    media: {
      id: "mock-audio",
      origin: "external",
      category: "audio",
      mimeType: "audio/mpeg",
      width: null,
      height: null,
      size: null,
      src: "/audio/mock-track.mp3",
    },
  },
  {
    label: "PDF",
    media: {
      id: "mock-pdf",
      origin: "external",
      category: "document",
      mimeType: "application/pdf",
      width: null,
      height: null,
      size: null,
      src: "/documents/mock-file.pdf",
    },
  },
];

export function UploaderMock({ onPick, imageRatio, className }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const cssProperties = useMemo(() => ({ "--media-ratio": imageRatio ?? 16 / 9 }), [imageRatio]);

  return (
    <div
      className={clsx(
        "bg-gray-0/50 outline-gray-2 relative flex aspect-(--media-ratio) flex-col items-center justify-center rounded-2xl outline",
        className,
      )}
      style={cssProperties}
    >
      <Button type="button" onClick={() => setIsOpen(true)}>
        Choisir un média (mock)
      </Button>

      <Modal open={isOpen} onOpen={setIsOpen}>
        <ModalContent>
          <ModalHeader>Choisir un média (mock)</ModalHeader>
          <ModalDescription>
            <div className="flex flex-col gap-2 p-4">
              {mockMedias.map(({ label, media }) => (
                <Button
                  key={media.id}
                  type="button"
                  onClick={() => {
                    onPick(media);
                    setIsOpen(false);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </ModalDescription>
          <ModalFooter>
            <div className="flex justify-end">
              <Button variant="text" color="gray" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
