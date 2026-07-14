import { FieldName, useField } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { Input, type InputProps } from "./Input";
import { memo } from "react";

interface Props extends Omit<FieldProps, "children"> {
  name: FieldName<string | null | undefined>;
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

function TextFieldComponent({
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
  ...rest
}: Props) {
  const field = useField(name);

  return (
    <Field errors={field.errors} data-testid={field.name} {...rest}>
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

export const TextField = memo(TextFieldComponent);
