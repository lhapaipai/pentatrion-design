import { FieldName } from "@conform-to/react/future";
import { Field, FieldProps } from "../form";
import { SelectHandle, SelectOption } from "../select/types";
import { useField, useControl } from "@conform-to/react/future";
import { Select } from "../select/Select";
import { useRef } from "react";

interface Props extends Omit<FieldProps, "children"> {
  name: FieldName<string>;
  placeholder?: string;
  options: SelectOption[];
}

export function SelectField({ name, placeholder, options, ...rest }: Props) {
  const controlInputRef = useRef<SelectHandle>(null);
  const field = useField(name);
  const control = useControl({
    defaultValue: field.defaultValue,
    onFocus() {
      controlInputRef.current?.focus();
    },
  });

  return (
    <>
      <input
        type="text"
        name={field.name}
        defaultValue={field.defaultValue}
        ref={control.register}
      />
      <Field errors={field.errors} data-testid={field.name} {...rest}>
        <Select
          name={field.name}
          ref={controlInputRef}
          placeholder={placeholder}
          options={options}
          onFocus={control.focus}
          onBlur={control.blur}
          value={control.value ?? null}
          onChange={(event) => control.change(event.value)}
        ></Select>
      </Field>
    </>
  );
}
