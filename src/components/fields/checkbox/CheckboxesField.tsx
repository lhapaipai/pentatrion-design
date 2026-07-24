import { FieldName, useField } from "@conform-to/react/future";
import { Field, FieldProps } from "../field/Field";
import { SelectOption } from "../select/types";
import { Checkbox } from "./Checkbox";

interface Props extends Omit<FieldProps, "children" | "group"> {
  name: FieldName<(string | number)[] | null | undefined>;
  options: SelectOption[];
}

export function CheckboxesField({ name, options, id: forcedId, ...rest }: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;
  const itemErrors = Object.values(field.fieldErrors).flat();
  const errors = field.errors ?? (itemErrors.length > 0 ? itemErrors : undefined);

  return (
    <Field id={id} group errors={errors} data-testid={name} {...rest}>
      <div className="sm:grid-cols-repeat-fill-160 grid grid-cols-2 gap-x-2 lg:gap-x-4">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            name={name}
            value={option.value}
            defaultChecked={field.defaultOptions?.includes(option.value)}
          >
            {option.label}
          </Checkbox>
        ))}
      </div>
    </Field>
  );
}
