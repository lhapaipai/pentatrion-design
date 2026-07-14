import { FieldName, useField, useControl } from "@conform-to/react/future";
import { Field, FieldProps } from "../field/Field";
import { Input } from "../text/Input";
import { useRef } from "react";

interface Props extends Omit<FieldProps, "children"> {
  name: FieldName<Date | null | undefined>;
  type?: "datetime-local" | "date";
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toDateLocalValue(date: Date, type: "datetime-local" | "date"): string {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return type === "datetime-local"
    ? `${year}-${month}-${day}T${hours}:${minutes}`
    : `${year}-${month}-${day}`;
}

function fromDatetimeLocalValue(value: string): Date {
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart?.split(":").map(Number) ?? [0, 0];
  return new Date(year, month - 1, day, hours, minutes);
}

export function DateField({ name, type = "datetime-local", ...rest }: Props) {
  const field = useField(name);
  const dateInputRef = useRef<HTMLInputElement>(null!);

  console.log("fieldDefaultValue", field.defaultValue);

  const control = useControl<Date, string>({
    defaultValue: field.defaultValue,
    // only for control.payload
    parse(payload) {
      if (typeof payload !== "string") {
        throw new Error("date input must return string");
      }
      return new Date(payload);
    },
    serialize(value) {
      return value.toISOString();
    },
  });

  return (
    <>
      <input type="text" name={field.name} ref={control.register} hidden />
      <Field errors={field.errors} data-testid={field.name} {...rest}>
        <Input
          type={type}
          ref={dateInputRef}
          value={control.payload ? toDateLocalValue(control.payload, type) : ""}
          onChange={(e) => {
            console.log("onChange", e.target.value, fromDatetimeLocalValue(e.target.value));
            control.change(fromDatetimeLocalValue(e.target.value));
          }}
          onBlur={() => control.blur()}
        />
      </Field>
    </>
  );
}
