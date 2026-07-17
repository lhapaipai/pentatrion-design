import { useField, useControl, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { lazy, Suspense, type RefObject } from "react";
import clsx from "clsx";
import { useIntersectionObserver } from "../../../hooks";
import type { ToolbarVariantProps } from "./style";
import { contentEditableStyles } from "./style";
import type { WysiwygRef } from "./Wysiwyg";
import { parseWysiwygValue, serializeWysiwygValue, WysiwygValue } from "./types";

const Wysiwyg = lazy(() => import("./Wysiwyg").then((module) => ({ default: module.Wysiwyg })));

interface Props extends Omit<FieldProps, "errors" | "children"> {
  name: FieldName<WysiwygValue | undefined | null>;
  ref?: RefObject<WysiwygRef>;
  debounceChange?: number | false;
  toolbarSticky?: ToolbarVariantProps["sticky"];
  contentEditableClassName?: string;
  containerClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

function WysiwygPlaceholder({
  containerClassName,
  contentEditableClassName,
}: {
  containerClassName?: string;
  contentEditableClassName?: string;
}) {
  return (
    <div className="relative z-(--index-wysiwyg) w-full" aria-hidden>
      <div data-color="gray" className={clsx("relative mx-auto w-full", containerClassName)}>
        <div className={clsx("prose", contentEditableStyles.normal, contentEditableClassName)} />
      </div>
    </div>
  );
}

export function WysiwygField({
  name,
  ref,
  debounceChange = false,
  toolbarSticky,
  contentEditableClassName,
  containerClassName,
  disabled = false,
  readOnly = false,
  ...rest
}: Props) {
  const field = useField(name);

  const control = useControl<WysiwygValue, string>({
    // on utiliserait defaultPayload si on construisait un composant fieldset.
    // ici on a uniquement un input text
    defaultValue: field.defaultValue,
    // useControl attend `null` (pas `undefined`) pour signaler l'absence de valeur
    parse: (payload) => parseWysiwygValue(payload) ?? null,
    serialize: serializeWysiwygValue,
  });

  // Lexical/LexicalComposer isn't SSR-friendly (strict instanceof checks
  // against its own node classes break with any duplicate module instance,
  // easy to hit through SSR dep pre-bundling) and there's no real benefit to
  // rendering an interactive editor server-side anyway. Deferring the mount
  // until the field scrolls into view, like MapField does for the map,
  // sidesteps SSR entirely and avoids paying for Lexical on fields the user
  // never reaches.
  const { isIntersecting, ref: wysiwygContainerRef } = useIntersectionObserver({
    freezeOnceVisible: true,
  });

  function handleChange(value: WysiwygValue) {
    control.change(value);
  }

  const placeholder = (
    <WysiwygPlaceholder
      containerClassName={containerClassName}
      contentEditableClassName={contentEditableClassName}
    />
  );

  return (
    <>
      <input
        name={field.name}
        type="text"
        autoComplete="off"
        tabIndex={-1}
        ref={control.register}
        defaultValue={control.defaultValue ?? ""}
        disabled={disabled}
        readOnly={readOnly}
        hidden
      />
      <Field errors={field.errors} data-testid={field.name} {...rest}>
        <div ref={wysiwygContainerRef}>
          {isIntersecting ? (
            <Suspense fallback={placeholder}>
              <Wysiwyg
                key={field.key}
                ref={ref}
                defaultValue={control.payload ?? undefined}
                onChange={handleChange}
                debounceChange={debounceChange}
                toolbarSticky={toolbarSticky}
                contentEditableClassName={contentEditableClassName}
                containerClassName={containerClassName}
                disabled={disabled}
                readOnly={readOnly}
              />
            </Suspense>
          ) : (
            placeholder
          )}
        </div>
      </Field>
    </>
  );
}
