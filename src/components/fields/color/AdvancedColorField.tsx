import { FieldName, useControl, useField } from "@conform-to/react/future";
import { BrandPalette, Color, ColorInput, ColorPicker, RawColor } from "../../color";
import { FieldProps } from "../field";

interface Props extends Omit<FieldProps, "children" | "group"> {
  name: FieldName<ColorInput | null | undefined>;
  allowInherit?: boolean;
  palette?: BrandPalette;
  refColor?: RawColor;
}

export function AdvancedColorField({
  name,
  id: forcedId,
  allowInherit = false,
  palette,
  refColor,
  ...rest
}: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;

  const control = useControl<Color, string>({
    defaultValue: field.defaultValue,
    parse(payload) {
      if (typeof payload !== "string") {
        throw new Error("color input must return string");
      }
      if (payload == null || payload === "") {
        return undefined;
      }
      return JSON.parse(payload);
    },
    // appelé uniquement par control.change(value) (ex: ColorPicker.onChange) :
    // convertit le Color/null en string écrite dans l'input caché et déclenche l'event
    // "input" natif. N'est pas utilisé pour le defaultValue initial (déjà une string).
    serialize(value) {
      return typeof value !== "string" && value != null ? JSON.stringify(value) : value;
    },
  });

  const value = control.payload ?? null;

  return (
    <>
      <input
        hidden
        name={field.name}
        type="text"
        autoComplete="off"
        tabIndex={-1}
        ref={control.register}
        defaultValue={control.defaultValue ?? ""}
      />
      <ColorPicker
        id={id}
        errors={field.errors}
        data-testid={field.name}
        palette={palette}
        refColor={refColor}
        value={value}
        onChange={(color) => control.change(color)}
        allowInherit={allowInherit}
        {...rest}
      />
    </>
  );
}
