import { FieldName, useField } from "@conform-to/react/future";
import { Field, FieldProps } from "../Field";
import { Checkbox } from "./Checkbox";

interface Props extends Omit<FieldProps, "children"> {
  name: FieldName<boolean>;
  checkboxLabel: string;
}

export function CheckboxField({ name, checkboxLabel, ...rest }: Props) {
  const field = useField(name);

  return (
    <Field errors={field.errors} data-testid={name} {...rest}>
      <Checkbox name={field.name} defaultChecked={field.defaultChecked}>
        {checkboxLabel}
      </Checkbox>
    </Field>
  );
}
