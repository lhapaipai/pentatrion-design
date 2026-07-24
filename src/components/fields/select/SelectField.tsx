import { FieldName } from "@conform-to/react/future";
import { Field, FieldProps } from "../field/Field";
import { SelectHandle, SelectOption } from "./types";
import { useField, useControl } from "@conform-to/react/future";
import { Select } from "./Select";
import { useRef } from "react";

interface Props extends Omit<FieldProps, "children" | "group"> {
  name: FieldName<string | number | null | undefined>;
  placeholder?: string;
  options: SelectOption[];
}

export function SelectField({ name, placeholder, options, id: forcedId, ...rest }: Props) {
  const controlInputRef = useRef<SelectHandle>(null);
  const field = useField(name);
  const id = forcedId ?? field.id;
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
        autoComplete="off"
        defaultValue={field.defaultValue}
        ref={control.register}
        hidden
      />
      <Field id={id} errors={field.errors} data-testid={field.name} {...rest}>
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
