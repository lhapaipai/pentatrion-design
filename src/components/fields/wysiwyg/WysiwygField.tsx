import type { FieldName } from "@conform-to/react";
import { useField, useInputControl } from "@conform-to/react";
import type { InputFieldProps } from "pentatrion-design/form";
import { InputField } from "pentatrion-design/form";
import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import type { LazyOnChangeArgs } from "~/components/wysiwyg/plugins/LazyOnChangePlugin";
import type { ToolbarVariantProps } from "~/components/wysiwyg/style";
import type { WysiwygRef } from "~/components/wysiwyg/Wysiwyg";
import { Wysiwyg } from "~/components/wysiwyg/Wysiwyg";
import { tArr } from "~/lib/i18n/util";

interface Props extends Omit<InputFieldProps, "errors" | "children"> {
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
  const [field] = useField(name);
  const { t } = useTranslation();

  const control = useInputControl(field);

  function handleChange({ html }: LazyOnChangeArgs) {
    control.change(html);
  }

  return (
    <InputField errors={tArr(t, field.errors)} data-testid={field.name} {...rest}>
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
    </InputField>
  );
}
