import { isValidElement, ReactNode, useId } from "react";
import { type ThemeColor } from "../../types";
import { Slot } from "../slot";

export interface InputFieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  description?: ReactNode;
  errors?: ReactNode | boolean;
  warning?: ReactNode | boolean;
  children: ReactNode;
  id?: string;
  preventLayerShift?: boolean;
  "data-testid"?: string;
  className?: string;
}

export function InputField({
  label,
  hint,
  description,
  errors,
  warning,
  id: providedId,
  children,
  preventLayerShift = true,
  "data-testid": dataTestId,
  className,
}: InputFieldProps) {
  const internalId = useId();
  const id = isValidElement<{ id?: string }>(children)
    ? children?.props.id
    : (providedId ?? internalId);

  const labelElement = label && <span>{label}</span>;
  const hintElement = hint && <span className="text-body-sm text-gray-6">{hint}</span>;
  const errorsElement = errors && typeof errors !== "boolean" && (
    <span
      className="text-red-4 dark:text-red-2 font-medium"
      aria-live="polite"
      role="status"
      data-testid={dataTestId ? `input-field/alert/${dataTestId}` : undefined}
    >
      <i className="fe-circle-exclamation"></i>
      <span>{errors}</span>
    </span>
  );
  const warningElement = warning && typeof warning !== "boolean" && (
    <span className="text-orange-4 dark:text-orange-2 font-medium" aria-live="polite" role="status">
      <i className="fe-circle-exclamation"></i>
      <span data-testid={dataTestId ? `input-field/warning/${dataTestId}` : undefined}>
        {warning}
      </span>
    </span>
  );

  const color: ThemeColor = errors ? "red" : warning ? "orange" : "yellow";

  const showLabel = preventLayerShift || label || hint;
  const showFooter = preventLayerShift || errorsElement || warningElement;

  return (
    <div role="group" className={className}>
      {showLabel &&
        (label || hint ? (
          <label className="mb-1 flex flex-wrap items-center justify-between" htmlFor={id}>
            {labelElement}
            {hintElement}
          </label>
        ) : (
          <label htmlFor={id} className="invisible"></label>
        ))}
      {description && <div className="text-body-sm text-gray-6 mb-2">{description}</div>}
      <Slot id={id} color={color}>
        {children}
      </Slot>
      {showFooter && (
        <div className="text-body-sm text-gray-6 mt-1 min-h-5">
          {errorsElement || warningElement}
        </div>
      )}
    </div>
  );
}
