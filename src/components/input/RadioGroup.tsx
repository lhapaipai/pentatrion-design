import { ComponentPropsWithRef, forwardRef, useId, useRef } from "react";
import { type ThemeColor } from "../../types";
import { useCombinedRefs } from "../../hooks";
import clsx from "clsx";
import { buttonVariants } from "../button";
import { buttonGroupVariants } from "../button/ButtonGroup";

interface RadioProps extends ComponentPropsWithRef<"input"> {
  disabled?: boolean;
  color?: ThemeColor;
  variant?: "contained" | "light" | "outlined" | "text" | "ghost";
}
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ disabled = false, color = "yellow", checked, children, name, className, ...rest }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const combinedRef = useCombinedRefs(inputRef, ref);
    return (
      <label data-disabled={disabled} className={clsx("flex cursor-pointer items-center")}>
        <input
          data-color={color}
          ref={combinedRef}
          disabled={disabled}
          type="radio"
          className={clsx(
            "p8n-input-radio",
            "my-1 mr-2 inline-block h-6 w-6 shrink-0 cursor-pointer select-none appearance-none rounded-full bg-gray-0 bg-origin-border p-0 outline-offset-[-1px]",
            className,
          )}
          checked={checked}
          name={name}
          {...rest}
        />
        {children}
      </label>
    );
  },
);

export const RadioButton = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      disabled = false,
      color = "yellow",
      checked,
      children,
      name,
      className,
      variant = "light",
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const combinedRef = useCombinedRefs(inputRef, ref);
    const id = useId();
    return (
      <label
        htmlFor={id}
        data-disabled={disabled}
        className={clsx(className, buttonVariants({ variant }))}
        data-color={color}
        data-checked={checked}
      >
        <input
          id={id}
          ref={combinedRef}
          disabled={disabled}
          type="radio"
          checked={checked}
          name={name}
          className="h-0 w-0 -translate-x-[9999px] overflow-hidden"
          {...rest}
        />
        <span>{children}</span>
      </label>
    );
  },
);

interface RadioGroupProps {
  value: string | null;
  options: {
    label: string;
    value: string;
  }[];
  // onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChange?: (newValue: string | null) => void;
  disabled?: boolean;
  placement?: "inline" | "inline-grid" | "block" | "custom";
  className?: string;
  radioClassName?: string;
  color?: ThemeColor;
  name?: string;
  shape?: "radio" | "button" | "button-group";

  /**
   * only if shape is button
   */
  variant?: "contained" | "light" | "outlined" | "text" | "ghost";
}

const placementVariants = {
  inline: "flex gap-2",
  "inline-grid": "grid gap-2 grid-cols-repeat-fill-160",
  block: "",
  custom: "",
};

export function RadioGroup({
  value,
  options,
  onChange = () => {},
  placement = "block",
  disabled = false,
  className,
  radioClassName,
  color = "yellow",
  name,
  shape = "radio",
  variant,
}: RadioGroupProps) {
  const id = useId();
  const Comp = shape === "radio" ? Radio : RadioButton;
  return (
    <div
      className={clsx(
        className,
        shape === "button-group" ? buttonGroupVariants() : placementVariants[placement],
      )}
    >
      {options.map((option) => (
        <Comp
          disabled={disabled}
          key={option.value}
          checked={option.value === value}
          onChange={() => onChange(option.value)}
          name={name ?? id}
          value={option.value}
          className={radioClassName}
          color={color}
          variant={variant}
        >
          {option.label}
        </Comp>
      ))}
    </div>
  );
}
