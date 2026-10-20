import { FieldName, useField, useControl } from "@conform-to/react/future";
import { Field, FieldProps } from "../field/Field";
import { Input } from "../text/Input";

type DateInputType = "datetime-local" | "date";

interface Props extends Omit<FieldProps, "children" | "group"> {
  name: FieldName<Date | null | undefined>;
  type?: DateInputType;
  min?: Date;
  max?: Date;
}

const defaultMax = new Date(9999, 11, 31, 23, 59);

function pad(n: number, length = 2): string {
  return n.toString().padStart(length, "0");
}

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

function toDateLocalValue(date: Date, type: DateInputType): string {
  // years < 1000 must be padded or the native input rejects the value
  const year = pad(date.getFullYear(), 4);
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return type === "datetime-local"
    ? `${year}-${month}-${day}T${hours}:${minutes}`
    : `${year}-${month}-${day}`;
}

function fromDateLocalValue(value: string): Date | null {
  if (value === "") {
    return null;
  }
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart?.split(":").map(Number) ?? [0, 0];
  const date = new Date(year, month - 1, day, hours, minutes);
  // new Date(year, …) maps years 0-99 to 1900-1999
  date.setFullYear(year, month - 1, day);
  return isValidDate(date) ? date : null;
}

export function DateField({
  name,
  type = "datetime-local",
  id: forcedId,
  min,
  max = defaultMax,
  ...rest
}: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;

  const control = useControl<Date, string>({
    defaultValue: field.defaultValue,
    // only for control.payload
    parse(payload) {
      if (typeof payload !== "string") {
        throw new Error("date input must return string");
      }
      if (payload === "") {
        return null;
      }
      const date = new Date(payload);
      return isValidDate(date) ? date : null;
    },
    serialize(value) {
      return value.toISOString();
    },
  });

  return (
    <>
      <input type="text" name={field.name} ref={control.register} hidden />
      <Field id={id} errors={field.errors} data-testid={field.name} {...rest}>
        <Input
          type={type}
          min={min && toDateLocalValue(min, type)}
          max={toDateLocalValue(max, type)}
          value={control.payload ? toDateLocalValue(control.payload, type) : ""}
          onChange={(e) => {
            control.change(fromDateLocalValue(e.target.value));
          }}
          onBlur={() => control.blur()}
        />
      </Field>
    </>
  );
}
