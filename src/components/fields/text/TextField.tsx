import { FieldName, useField } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { Input, type InputProps } from "./Input";

interface Props extends Omit<FieldProps, "children" | "group"> {
  name: FieldName<string | number | null | undefined>;
  type?: InputProps["type"];
  placeholder?: InputProps["placeholder"];
  prefix?: InputProps["prefix"];
  suffix?: InputProps["suffix"];
  variant?: InputProps["variant"];
  color?: InputProps["color"];
  size?: InputProps["size"];
  disabled?: InputProps["disabled"];
  readOnly?: InputProps["readOnly"];
  inputClassName?: InputProps["inputClassName"];
}

export function TextField({
  name,
  type,
  placeholder,
  prefix,
  suffix,
  variant,
  color,
  size,
  disabled,
  readOnly,
  inputClassName,
  id: forcedId,
  ...rest
}: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;

  return (
    <Field id={id} errors={field.errors} data-testid={field.name} {...rest}>
      <Input
        name={field.name}
        defaultValue={field.defaultValue}
        type={type}
        placeholder={placeholder}
        prefix={prefix}
        suffix={suffix}
        variant={variant}
        color={color}
        size={size}
        disabled={disabled}
        readOnly={readOnly}
        inputClassName={inputClassName}
      />
    </Field>
  );
}
