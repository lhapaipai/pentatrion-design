import { useField, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../Field";
import { Range } from "./Range";

interface Props extends Omit<FieldProps, "errors" | "children"> {
  name: FieldName<number>;

  min?: number;
  max?: number;
  step?: number;
  showMinMax?: "onHover" | "always" | "never";
  showValue?: boolean;
}

export function RangeField({ name, min, max, step, showMinMax, showValue, ...rest }: Props) {
  const field = useField(name);
  const numberValue: number | undefined = field.defaultValue
    ? parseInt(field.defaultValue)
    : undefined;

  return (
    <Field errors={field.errors} data-testid={field.name} {...rest}>
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
