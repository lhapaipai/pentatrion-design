import { FieldName, useField } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { Input, type InputProps } from "./Input";

type Props = Omit<FieldProps, "children" | "group"> &
  Pick<
    InputProps,
    | "type"
    | "placeholder"
    | "prefix"
    | "suffix"
    | "variant"
    | "color"
    | "size"
    | "disabled"
    | "readOnly"
    | "inputClassName"
    | "prefixClassName"
    | "suffixClassName"
  > & {
    name: FieldName<string | number | null | undefined>;
  };

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
  prefixClassName,
  suffixClassName,
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
        prefixClassName={prefixClassName}
        suffixClassName={suffixClassName}
      />
    </Field>
  );
}
