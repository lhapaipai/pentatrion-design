import { FieldName, useField } from "@conform-to/react/future";
import { Field, FieldProps } from "../field/Field";
import { SelectOption } from "../select/types";
import clsx from "clsx";
import { buttonGroupVariants } from "../../button";
import { Radio } from "./Radio";

interface Props extends Omit<FieldProps, "children" | "group"> {
  name: FieldName<string | number | undefined | null>;
  options: readonly SelectOption[];
  asButton?: boolean;
  direction?: "horizontal" | "vertical";
}

export function RadiosField({
  name,
  options,
  className,
  asButton,
  direction,
  id: forcedId,
  ...rest
}: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;

  return (
    <Field id={id} group errors={field.errors} data-testid={field.name} {...rest}>
      <div
        className={clsx(
          className,
          asButton
            ? buttonGroupVariants()
            : !className &&
                direction === "horizontal" &&
                "sm:grid-cols-repeat-fill-160 grid grid-cols-2 gap-x-2 lg:gap-x-4",
        )}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            name={field.name}
            value={option.value}
            defaultChecked={field.defaultValue === option.value}
          >
            {option.label}
          </Radio>
        ))}
      </div>
    </Field>
  );
}
