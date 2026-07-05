import { FieldName } from "@conform-to/react/future";
import { InputField, InputFieldProps } from "../form";
import { SelectOption } from "./types";
import { useField, useControl } from "@conform-to/react/future";
import { Select } from "./Select";

interface Props extends Omit<InputFieldProps, "children"> {
  name: FieldName<string>;
  placeholder?: string;
  options: SelectOption[];
}

export function SelectField({ name, placeholder, options, ...rest }: Props) {
  const field = useField(name);
  const control = useControl({
    defaultValue: field.defaultValue,
    onFocus() {
      //...
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
      <InputField errors={field.errors} data-testid={field.name} {...rest}>
        <Select
          placeholder={placeholder}
          options={options}
          onFocus={control.focus}
          onBlur={control.blur}
          value={control.value ?? null}
          onChange={(value) => control.change(value)}
        ></Select>
      </InputField>
    </>
  );
}
