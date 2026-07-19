import { FieldName, useField } from "@conform-to/react/future";
import { Field, FieldProps } from "../field/Field";
import { Checkbox } from "./Checkbox";

interface Props extends Omit<FieldProps, "children" | "group"> {
  name: FieldName<boolean>;
  checkboxLabel: string;
}

export function CheckboxField({ name, checkboxLabel, id: forcedId, ...rest }: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;

  return (
    <Field id={id} errors={field.errors} data-testid={name} {...rest}>
      <Checkbox name={field.name} defaultChecked={field.defaultChecked}>
        {checkboxLabel}
      </Checkbox>
    </Field>
  );
}
