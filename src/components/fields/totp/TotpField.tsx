import type { FieldName } from "@conform-to/react";
import { useField, useControl } from "@conform-to/react/future";
import { Field, type FieldProps } from "../Field";
import { TotpInput } from "./TotpInput";

interface Props extends Omit<FieldProps, "errors" | "children"> {
  name: FieldName<string | null | undefined>;
}
export function TotpField({ name, ...rest }: Props) {
  const field = useField(name);
  const ctrl = useControl({
    defaultValue: field.defaultValue,
  });

  return (
    <Field errors={field.errors} data-testid={field.name} {...rest}>
      <TotpInput
        name={name}
        type="number"
        length={6}
        key={field.key}
        value={ctrl.value ?? ""}
        onValue={ctrl.change}
      />
    </Field>
  );
}
