import { useField, useControl, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../Field";
import type { RefObject } from "react";
import type { ToolbarVariantProps } from "./style";
import type { WysiwygRef } from "./Wysiwyg";
import { Wysiwyg } from "./Wysiwyg";
import { parseWysiwygValue, serializeWysiwygValue, WysiwygValue } from "./types";

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

  function handleChange(value: WysiwygValue) {
    control.change(value);
  }

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
      />
      <Field errors={field.errors} data-testid={field.name} {...rest}>
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
      </Field>
    </>
  );
}
