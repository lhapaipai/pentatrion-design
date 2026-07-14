import { FieldName, useField } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { RadioButton } from "./Radio";
import clsx from "clsx";
import { buttonGroupVariants } from "../../button";

export type RadioButtonIconOption = { value: string; icon: string; label: string };

interface Props extends Omit<FieldProps, "children"> {
  name: FieldName<string>;
  options: RadioButtonIconOption[];
  iconClassName?: string;
}

export function RadiosButtonIconField({ name, options, iconClassName, ...rest }: Props) {
  const field = useField(name);

  return (
    <Field errors={field.errors} data-testid={field.name} {...rest}>
      <div className={clsx(buttonGroupVariants())}>
        {options.map((option) => (
          <RadioButton
            key={option.value}
            className={clsx("flex-col items-center justify-center p-1")}
            size="custom"
            width="custom"
            color="gray"
            name={field.name}
            value={option.value}
            defaultChecked={field.defaultValue === option.value}
          >
            <i className={clsx(option.icon, iconClassName)}></i>
            <span className="text-body-2xs max-w-full truncate">{option.label}</span>
          </RadioButton>
        ))}
      </div>
    </Field>
  );
}
