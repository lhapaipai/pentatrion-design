import { useField, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { Textarea } from "./Textarea";

interface Props extends Omit<FieldProps, "errors" | "children"> {
  name: FieldName<string | null>;
  textareaClassName?: string;
}

export function TextareaField({ name, textareaClassName, ...rest }: Props) {
  const field = useField(name);

  return (
    <Field errors={field.errors} data-testid={field.name} {...rest}>
      <Textarea name={field.name} defaultValue={field.defaultValue} className={textareaClassName} />
    </Field>
  );
}
