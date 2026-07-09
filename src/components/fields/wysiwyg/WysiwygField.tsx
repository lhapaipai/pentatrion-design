import { useField, useControl, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../Field";
import type { RefObject } from "react";
import type { LazyOnChangeArgs } from "./plugins/LazyOnChangePlugin";
import type { ToolbarVariantProps } from "./style";
import type { WysiwygRef } from "./Wysiwyg";
import { Wysiwyg } from "./Wysiwyg";

interface Props extends Omit<FieldProps, "errors" | "children"> {
  name: FieldName<string | null>;
  ref?: RefObject<WysiwygRef>;
  lazyOnChange?: number | false;
  toolbarSticky?: ToolbarVariantProps["sticky"];
  contentEditableClassName?: string;
  containerClassName?: string;
}

export function WysiwygField({
  name,
  ref,
  lazyOnChange = false,
  toolbarSticky,
  contentEditableClassName,
  containerClassName,
  ...rest
}: Props) {
  const field = useField(name);

  const control = useControl({
    defaultValue: field.defaultValue,
  });

  function handleChange({ html }: LazyOnChangeArgs) {
    control.change(html);
  }

  return (
    <Field errors={field.errors} data-testid={field.name} {...rest}>
      <Wysiwyg
        key={field.key}
        ref={ref}
        initialHtml={control.value}
        onChange={handleChange}
        lazyOnChange={lazyOnChange}
        toolbarSticky={toolbarSticky}
        contentEditableClassName={contentEditableClassName}
        containerClassName={containerClassName}
      />
    </Field>
  );
}
