import { ReactNode, useId } from "react";
import { type ThemeColor } from "../../../types";
import { isArrayOfString } from "../../../lib/arrUtil";
import { Slot } from "../../slot";
import { useTranslate } from "../../i18n";

export interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  description?: ReactNode;
  footerDescription?: ReactNode;
  errors?: ReactNode | boolean;
  warning?: ReactNode | boolean;
  children: ReactNode;
  id?: string;
  /**
   * Set when children renders multiple controls (checkboxes, radios, digit inputs)
   * instead of a single labelable element: the label gets its own id and the
   * group is associated via aria-labelledby instead of label[for], since a single
   * htmlFor/id pair can't target one control among several.
   */
  group?: boolean;
  preventLayerShift?: boolean;
  "data-testid"?: string;
  className?: string;
}

export function Field({
  label,
  hint,
  description,
  footerDescription,
  errors: rawErrors,
  warning,
  id: providedId,
  children,
  group = false,
  preventLayerShift = true,
  "data-testid": dataTestId,
  className,
}: FieldProps) {
  const translate = useTranslate();
  const errors =
    isArrayOfString(rawErrors) && translate
      ? rawErrors.map((k) => translate(k)).join(", ")
      : rawErrors;
  const internalId = useId();
  const id = providedId ?? internalId;

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

  const testIdProp = dataTestId ? { "data-testid": `input-field-${dataTestId}` } : {};
  const groupLabelProps = group && showLabel ? { "aria-labelledby": id } : {};

  return (
    <div role="group" className={className} {...testIdProp} {...groupLabelProps}>
      {showLabel &&
        (label || hint ? (
          <label
            id={group ? id : undefined}
            htmlFor={group ? undefined : id}
            className="mb-1 flex flex-wrap items-center justify-between"
          >
            {labelElement}
            {hintElement}
          </label>
        ) : (
          <label
            id={group ? id : undefined}
            htmlFor={group ? undefined : id}
            className="invisible"
          ></label>
        ))}
      {description && <div className="text-body-sm text-gray-6 mb-2">{description}</div>}
      <Slot id={group ? undefined : id} color={color}>
        {children}
      </Slot>
      {showFooter && (
        <div className="text-body-sm text-gray-6 mt-1 min-h-5">
          {errorsElement || warningElement}
        </div>
      )}
      {footerDescription && (
        <div className="text-body-sm text-gray-6 mb-2">{footerDescription}</div>
      )}
    </div>
  );
}
