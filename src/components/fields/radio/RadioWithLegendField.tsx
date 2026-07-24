import { useField, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { RadioWithLegend } from "./Radio";
import clsx from "clsx";
import type { ReactNode } from "react";

export type RadioWithLegendOption<T extends string | null = string> = {
  label: string;
  value: T;
  children: ReactNode;
};

interface Props extends Omit<FieldProps, "errors" | "children" | "group"> {
  name: FieldName<string | number | null | undefined>;
  options: readonly RadioWithLegendOption[];
  labelClassName?: string;
}

export function RadiosWithLegendField({
  name,
  options,
  className,
  labelClassName,
  id: forcedId,
  ...rest
}: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;

  return (
    <Field id={id} group errors={field.errors} data-testid={field.name} {...rest}>
      <div className={clsx(className)}>
        {options.map((option) => (
          <RadioWithLegend
            key={option.value}
            name={field.name}
            value={option.value}
            defaultChecked={field.defaultValue === option.value}
            label={option.label}
            labelClassName={labelClassName}
          >
            {option.children}
          </RadioWithLegend>
        ))}
      </div>
    </Field>
  );
}
