import {
  getFieldValue,
  useControl,
  useField,
  useFormData,
  type FieldName,
} from "@conform-to/react/future";
import { Field, type FieldProps } from "./Field";
import { isMediaImage, MediaPreview } from "../media-preview";
import clsx from "clsx";
import { Button } from "../button/Button";
import type { RefObject } from "react";
import { useMemo, useRef } from "react";
// import { presets, type PresetKey } from "~shared/media/presets";
import { useStrictMergeRefs } from "../../hooks";
// import { calculateDimensions } from "~shared/media/util";
// import { getMediaImageSrc } from "~/lib/util/url";
import { UploaderMock } from "./UploaderMock";
import { z } from "zod/v4-mini";

const useMediaFromString = (mediaString: unknown) => {
  return useMemo(() => {
    if (typeof mediaString !== "string" || mediaString === "") {
      return null;
    }

    try {
      const mediaJson = JSON.parse(mediaString);
      if (mediaJson.id && mediaJson.origin) {
        return mediaJson as Media;
      }
      return null;
    } catch {
      return null;
    }
  }, [mediaString]);
};

export const mediaSchema = z.object({
  id: z.string(),
  origin: z.enum(["s3Upload", "localUpload", "external", "asset"]),
  category: z.string(),
  mimeType: z.string(),
  width: z._default(z.nullable(z.coerce.number().check(z.int())), null),
  height: z._default(z.nullable(z.coerce.number().check(z.int())), null),
  size: z._default(z.nullable(z.coerce.number().check(z.int())), null),
  src: z.string(),
});

export type Media = z.infer<typeof mediaSchema>;

type Props = Omit<FieldProps, "children"> & {
  name: FieldName<Media | undefined>;
  mediaContainerClassName?: string;
  allowedTypes?: "image" | "audio" | "all-safe";
  // mediaPreset?: Exclude<PresetKey, "raw">;
  imageRatio?: number;
};

export function FileField({
  name,
  mediaContainerClassName,
  allowedTypes = "all-safe",
  // mediaPreset = "uploadPreview",
  imageRatio,
  ...rest
}: Props) {
  const field = useField(name);

  const inputRef = useRef<HTMLInputElement>(null!);

  const itemErrors = Object.values(field.fieldErrors).flat();
  const errors = field.errors ?? (itemErrors.length > 0 ? itemErrors : undefined);

  const control = useControl<Media, string>({
    defaultValue: field.defaultValue,
    parse(payload) {
      if (typeof payload !== "string") {
        throw new Error("media input must return string");
      }
      if (payload == null || payload === "") {
        return undefined;
      }
      return JSON.parse(payload);
    },
    serialize(value) {
      return typeof value !== "string" && value != null ? JSON.stringify(value) : value;
    },
  });

  const media = control.payload;
  console.log("media value parsée", media);

  // const media = useFormData<Media | null>(field.formId, (formData) =>
  //   getFieldValue(formData, field.name, { type: "object", optional: true }),
  // );

  // const media = useMediaFromString(field.value);

  // const thumbnailDimensions =
  //   media && isMediaImage(media) ? calculateDimensions(media, presets[mediaPreset]) : null;

  // const src = getMediaImageSrc(media, mediaPreset);
  // const hdMediaPreset = `${mediaPreset}HD` as PresetKey;
  // const srcSet = presets[hdMediaPreset]
  //   ? `${src} 1x, ${getMediaImageSrc(media, hdMediaPreset)} 2x`
  //   : undefined;

  // TODO pas l'idéal : Object.values(field.allErrors).flat()
  // message : Valeur non autorisé (on ne sait pas quel champ (ici c'est s3))
  return (
    <>
      <input
        name={field.name}
        type="text"
        autoComplete="off"
        // className={clsx("hidden-focusable")}
        tabIndex={-1}
        ref={control.register}
        defaultValue={control.defaultValue ?? ""}
      />
      <Field errors={errors} data-testid={field.name} {...rest}>
        {media ? (
          // <MediaPreview
          //   media={media}
          //   src={src}
          //   srcSet={srcSet}
          //   width={thumbnailDimensions?.width}
          //   height={thumbnailDimensions?.height}
          //   fit={isMediaImage(media) ? "original" : "cover"}
          //   className={mediaContainerClassName}
          // >
          <Button
            onClick={() => {
              control.change(null);
            }}
            type="button"
            icon
            color="gray"
            size="large"
          >
            <i className="fe-trash text-body-xl"></i>
          </Button>
        ) : (
          // </MediaPreview>
          <UploaderMock
            className={mediaContainerClassName}
            onPick={(media: Media | null) => {
              console.log("onPick", media);
              control.change(media);
            }}
            imageRatio={imageRatio}
            allowedTypes={allowedTypes}
          />
        )}
      </Field>
    </>
  );
}
