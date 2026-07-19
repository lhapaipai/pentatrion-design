import { useField, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { Range } from "./Range";

interface Props extends Omit<FieldProps, "errors" | "children" | "group"> {
  name: FieldName<number>;

  min?: number;
  max?: number;
  step?: number;
  showMinMax?: "onHover" | "always" | "never";
  showValue?: boolean;
}

export function RangeField({
  name,
  min,
  max,
  step,
  showMinMax,
  showValue,
  id: forcedId,
  ...rest
}: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;
  const numberValue: number | undefined = field.defaultValue
    ? parseInt(field.defaultValue)
    : undefined;

  return (
    <Field id={id} errors={field.errors} data-testid={field.name} {...rest}>
      <Range
        name={field.name}
        defaultValue={numberValue}
        min={min}
        max={max}
        step={step}
        showMinMax={showMinMax}
        showValue={showValue}
      />
    </Field>
  );
}
