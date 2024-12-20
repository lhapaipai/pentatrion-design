import { forwardRef, ReactElement, ReactNode, Ref, useId } from "react";
import { Option, Select, SelectProps } from "../select";
import { ThemeColor } from "~/types";

interface SelectFieldOwnProps {
  label?: ReactNode;
  hint?: ReactNode;
  description?: ReactNode;
  errors?: ReactNode | boolean;
  warning?: ReactNode | boolean;
}

export type Props<O extends Option = Option> = SelectFieldOwnProps & SelectProps<O>;

export const SelectField = forwardRef<Element, Props>(
  ({ label, hint, description, errors, warning, id: providedId, ...rest }, ref) => {
    const internalId = useId();
    const id = providedId ?? internalId;

    const labelElement = label && <span className="font-semibold">{label}</span>;
    const hintElement = hint && <span className="ml-auto text-body-sm text-gray-6">{hint}</span>;
    const errorsElement = errors && typeof errors !== "boolean" && (
      <span className="font-medium text-red-4 dark:text-red-2">
        <i className="fe-circle-exclamation"></i>
        <span>{errors}</span>
      </span>
    );
    const warningElement = warning && typeof warning !== "boolean" && (
      <span className="font-medium text-orange-4 dark:text-orange-2">
        <i className="fe-circle-exclamation"></i>
        <span>{warning}</span>
      </span>
    );

    const color: ThemeColor = errors ? "red" : warning ? "orange" : "yellow";

    return (
      <div>
        {label || hint ? (
          <label className="mb-1 flex items-end" htmlFor={id}>
            {labelElement}
            {hintElement}
          </label>
        ) : (
          <label htmlFor={id} className="invisible"></label>
        )}
        {description && <div className="mb-2 text-body-sm text-gray-6">{description}</div>}
        <Select ref={ref as any} color={color} id={id} {...rest} />
        <div className="mt-1 min-h-5 text-body-sm text-gray-6">
          {errorsElement || warningElement}
        </div>
      </div>
    );
  },
) as <O extends Option>(p: Props<O> & { ref?: Ref<HTMLDivElement> }) => ReactElement;
