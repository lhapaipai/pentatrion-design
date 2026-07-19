import { useControl, useField, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { isMediaImage, MediaPreview } from "../../media-preview";
import { Button } from "../../button/Button";
// import { presets, type PresetKey } from "~shared/media/presets";
// import { calculateDimensions } from "~shared/media/util";
// import { getMediaImageSrc } from "~/lib/util/url";

import { UploaderMock } from "./UploaderMock";
import { Media } from "./types";

type Props = Omit<FieldProps, "children" | "group"> & {
  name: FieldName<Media | null | undefined>;
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
  id: forcedId,
  ...rest
}: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;

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
    // appelé uniquement par control.change(value) (ex: onPick, le bouton de suppression) :
    // convertit le Media/null en string écrite dans l'input caché et déclenche l'event
    // "input" natif. N'est pas utilisé pour le defaultValue initial (déjà une string).
    serialize(value) {
      return typeof value !== "string" && value != null ? JSON.stringify(value) : value;
    },
  });

  const media = control.payload;
  console.log("media value parsée", media);

  // const thumbnailDimensions =
  //   media && isMediaImage(media) ? calculateDimensions(media, presets[mediaPreset]) : null;

  // const src = getMediaImageSrc(media, mediaPreset);
  // const hdMediaPreset = `${mediaPreset}HD` as PresetKey;
  // const srcSet = presets[hdMediaPreset]
  //   ? `${src} 1x, ${getMediaImageSrc(media, hdMediaPreset)} 2x`
  //   : undefined;

  return (
    <>
      <input
        name={field.name}
        type="text"
        autoComplete="off"
        tabIndex={-1}
        ref={control.register}
        defaultValue={control.defaultValue ?? ""}
      />
      <Field id={id} errors={errors} data-testid={field.name} {...rest}>
        {media ? (
          <MediaPreview
            media={media}
            // src={src}
            // srcSet={srcSet}
            // width={thumbnailDimensions?.width}
            // height={thumbnailDimensions?.height}
            fit={isMediaImage(media) ? "original" : "cover"}
            className={mediaContainerClassName}
          >
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
          </MediaPreview>
        ) : (
          <UploaderMock
            id={id}
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
