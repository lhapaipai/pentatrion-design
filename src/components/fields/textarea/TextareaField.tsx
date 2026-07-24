import { useField, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { Textarea } from "./Textarea";

interface Props extends Omit<FieldProps, "errors" | "children" | "group"> {
  name: FieldName<string | null | undefined>;
  textareaClassName?: string;
}

export function TextareaField({ name, textareaClassName, id: forcedId, ...rest }: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;

  return (
    <Field id={id} errors={field.errors} data-testid={field.name} {...rest}>
      <Textarea name={field.name} defaultValue={field.defaultValue} className={textareaClassName} />
    </Field>
  );
}
