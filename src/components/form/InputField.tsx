import { ReactNode, useId } from "react";
import { type ThemeColor } from "../../types";
import { Slot } from "../slot";

interface InputFieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  description?: ReactNode;
  errors?: ReactNode | boolean;
  warning?: ReactNode | boolean;
  children: ReactNode;
  id?: string;
}

export function InputField({
  label,
  hint,
  description,
  errors,
  warning,
  id: providedId,
  children,
}: InputFieldProps) {
  const internalId = useId();
  const id = providedId ?? internalId;

  const labelElement = label && <span>{label}</span>;
  const hintElement = hint && <span className="text-body-sm text-gray-6">{hint}</span>;
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
        <label className="mb-1 flex flex-wrap items-center justify-between" htmlFor={id}>
          {labelElement}
          {hintElement}
        </label>
      ) : (
        <label htmlFor={id} className="invisible"></label>
      )}
      {description && <div className="mb-2 text-body-sm text-gray-6">{description}</div>}
      <Slot id={id} color={color}>
        {children}
      </Slot>
      <div className="mt-1 min-h-5 text-body-sm text-gray-6">{errorsElement || warningElement}</div>
    </div>
  );
}
