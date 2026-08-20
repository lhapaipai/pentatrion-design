import { useField, useControl, type FieldName } from "@conform-to/react/future";
import { type FieldProps } from "../field/Field";
import { ColorPicker, RawColor, type Color } from "../../color";

interface Props extends Omit<FieldProps, "children" | "group"> {
  name: FieldName<string | null | undefined>;
  allowInherit?: boolean;
  refColor?: RawColor;
}

export function HexColorField({ name, id: forcedId, allowInherit = false, ...rest }: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;

  const control = useControl({
    defaultValue: field.defaultValue,
  });

  const value: Color | null = control.value ? { type: "raw", hex: control.value } : null;

  function handleChange(color: Color | null) {
    control.change(color?.type === "raw" ? color.hex : null);
  }

  return (
    <>
      <input
        hidden
        type="text"
        name={field.name}
        autoComplete="off"
        ref={control.register}
        defaultValue={field.defaultValue}
      />
      <ColorPicker
        id={id}
        errors={field.errors}
        data-testid={field.name}
        value={value}
        onChange={handleChange}
        allowInherit={allowInherit}
        {...rest}
      />
    </>
  );
}
