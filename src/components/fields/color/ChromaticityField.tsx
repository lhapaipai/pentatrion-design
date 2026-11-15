import { FieldName, useControl, useField } from "@conform-to/react/future";
import { Chromaticity, ChromaticityPicker } from "../../color";
import { FieldProps } from "../field";

interface Props extends Omit<FieldProps, "children" | "group"> {
  name: FieldName<Chromaticity | null | undefined>;
  allowInherit?: boolean;
}

export function ChromaticityField({ name, id: forcedId, allowInherit = false, ...rest }: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;

  const control = useControl<Chromaticity, string>({
    defaultValue: field.defaultValue,
    parse(payload) {
      if (typeof payload !== "string") {
        throw new Error("chromaticity input must return string");
      }
      if (payload === "") {
        return undefined;
      }
      return JSON.parse(payload);
    },
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
      <ChromaticityPicker
        id={id}
        errors={field.errors}
        data-testid={field.name}
        value={value}
        onChange={(chromaticity) => control.change(chromaticity)}
        allowInherit={allowInherit}
        {...rest}
      />
    </>
  );
}
