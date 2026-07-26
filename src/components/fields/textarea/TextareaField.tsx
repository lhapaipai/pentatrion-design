import { useField, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { Textarea, type TextareaProps } from "./Textarea";

type Props = Omit<FieldProps, "errors" | "children" | "group"> &
  Pick<TextareaProps, "prefix" | "suffix" | "prefixClassName" | "suffixClassName"> & {
    name: FieldName<string | null | undefined>;
    textareaClassName?: string;
  };

export function TextareaField({
  name,
  textareaClassName,
  prefix,
  suffix,
  prefixClassName,
  suffixClassName,
  id: forcedId,
  ...rest
}: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;

  return (
    <Field id={id} errors={field.errors} data-testid={field.name} {...rest}>
      <Textarea
        name={field.name}
        defaultValue={field.defaultValue}
        className={textareaClassName}
        prefix={prefix}
        suffix={suffix}
        prefixClassName={prefixClassName}
        suffixClassName={suffixClassName}
      />
    </Field>
  );
}
