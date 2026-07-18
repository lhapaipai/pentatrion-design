import type { FieldName } from "@conform-to/react";
import { useField, useControl } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { TotpInput } from "./TotpInput";

interface Props extends Omit<FieldProps, "errors" | "children"> {
  name: FieldName<string | null | undefined>;
}
export function TotpField({ name, ...rest }: Props) {
  const field = useField(name);
  const control = useControl({
    defaultValue: field.defaultValue,
  });

  return (
    <>
      <input type="text" name={field.name} ref={control.register} hidden />
      <Field errors={field.errors} data-testid={field.name} {...rest}>
        <TotpInput
          type="number"
          length={6}
          key={field.key}
          value={control.value ?? ""}
          onValue={control.change}
        />
      </Field>
    </>
  );
}
