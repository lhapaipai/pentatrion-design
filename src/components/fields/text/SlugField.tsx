import { useField, useControl, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { Input } from "./Input";
import { slugify } from "../../../lib/strUtil";
import type { ChangeEvent } from "react";

interface Props extends Omit<FieldProps, "errors" | "children" | "group"> {
  name: FieldName<string | null | undefined>;
}

export function SlugField({ name, id: forcedId, ...rest }: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;
  const control = useControl({
    defaultValue: field.defaultValue,
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    control.change(slugify(e.target.value, false, false));
  }

  function handleBlur() {
    if (control.value) {
      control.change(slugify(control.value, false));
    }
    control.blur();
  }

  return (
    <>
      <input
        type="text"
        hidden
        name={field.name}
        ref={control.register}
        defaultValue={field.defaultValue}
      />
      <Field id={id} errors={field.errors} data-testid={field.name} {...rest}>
        <Input value={control.value ?? ""} onBlur={handleBlur} onChange={handleChange} />
      </Field>
    </>
  );
}
