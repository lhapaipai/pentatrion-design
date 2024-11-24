import { ElementType, ForwardedRef, ReactNode, forwardRef, useId } from "react";
import { Input } from "../input";
import { type ThemeColor } from "../../types";
import { ComponentPropsWithRef } from "@react-spring/web";

interface InputFieldOwnProps {
  label?: ReactNode;
  hint?: ReactNode;
  description?: ReactNode;
  error?: ReactNode | boolean;
  warning?: ReactNode | boolean;
}

const defaultElement = Input;

export type Props<E extends ElementType> = InputFieldOwnProps &
  ComponentPropsWithRef<E> & {
    as?: E;
  };

const InputFieldBase = <E extends ElementType = typeof defaultElement>(
  { label, hint, description, error, warning, id: providedId, as, ...rest }: Props<E>,
  ref: ForwardedRef<Element>,
) => {
  const internalId = useId();
  const id = providedId ?? internalId;
  const Element: ElementType = as || defaultElement;

  const labelElement = label && <span>{label}</span>;
  const hintElement = hint && <span className="ml-auto text-sm text-gray-6">{hint}</span>;
  const errorElement = error && typeof error !== "boolean" && (
    <span className="font-medium text-red-4 dark:text-red-2">
      <i className="fe-circle-exclamation"></i>
      <span>{error}</span>
    </span>
  );
  const warningElement = warning && typeof warning !== "boolean" && (
    <span className="font-medium text-orange-4 dark:text-orange-2">
      <i className="fe-circle-exclamation"></i>
      <span>{warning}</span>
    </span>
  );

  const color: ThemeColor = error ? "red" : warning ? "orange" : "yellow";

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
      {description && <div className="mb-2 text-sm text-gray-6">{description}</div>}
      <Element ref={ref} id={id} color={color} {...rest} />
      <div className="mt-1 min-h-5 text-sm text-gray-6">{errorElement || warningElement}</div>
    </div>
  );
};
InputFieldBase.displayName = "InputField";

export const InputField: <E extends ElementType = typeof defaultElement>(
  props: Props<E>,
) => ReactNode = forwardRef(InputFieldBase);
