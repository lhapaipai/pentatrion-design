import { useControl, useField, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { Range } from "./Range";

interface Props extends Omit<FieldProps, "errors" | "children" | "group"> {
  name: FieldName<number | null | undefined>;

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

  const control = useControl<number, string>({
    defaultValue: field.defaultValue,
    parse(payload) {
      if (typeof payload !== "string") {
        throw new Error("range input must return string");
      }
      return parseInt(payload);
    },
    serialize(value) {
      return value.toString();
    },
  });

  return (
    <>
      <input type="text" name={field.name} ref={control.register} hidden />
      <Field id={id} errors={field.errors} data-testid={field.name} {...rest}>
        <Range
          value={control.payload ?? 0}
          min={min}
          max={max}
          step={step}
          showMinMax={showMinMax}
          showValue={showValue}
          onChangeCommitted={(value: number) => {
            control.change(value);
          }}
          onBlur={() => control.blur()}
        />
      </Field>
    </>
  );
}
