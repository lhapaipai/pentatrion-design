import { FieldName, useField, useControl } from "@conform-to/react/future";
import { Field, FieldProps } from "../Field";
import { Input } from "../text/Input";
import { useRef } from "react";

interface Props extends Omit<FieldProps, "children"> {
  name: FieldName<Date>;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toDatetimeLocalValue(date: Date): string {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function fromDatetimeLocalValue(value: string): Date {
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

export function DateField({ name, ...rest }: Props) {
  const field = useField(name);
  const dateInputRef = useRef<HTMLInputElement>(null!);

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
      <input type="text" name={field.name} ref={control.register} />
      <Field errors={field.errors} data-testid={field.name} {...rest}>
        <Input
          type="datetime-local"
          ref={dateInputRef}
          value={control.payload ? toDatetimeLocalValue(control.payload) : ""}
          onChange={(e) => control.change(fromDatetimeLocalValue(e.target.value))}
          onBlur={() => control.blur()}
        />
      </Field>
    </>
  );
}
