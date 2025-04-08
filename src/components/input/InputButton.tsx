import clsx from "clsx";
import {
  ComponentPropsWithRef,
  FocusEventHandler,
  MouseEventHandler,
  ReactNode,
  RefObject,
  useRef,
} from "react";
import { ThemeColor } from "../../types";
import { inputConfig, sizeVariant } from "./Input";

export interface InputButtonProps extends Omit<ComponentPropsWithRef<"input">, "prefix" | "size"> {
  label?: string;
  variant?: "normal" | "ghost";
  disabled?: boolean;
  prefix?: ReactNode;
  color?: ThemeColor;
  size?: "small" | "medium" | "large" | "custom";
  flexibleWidth?: boolean;

  readOnly?: boolean;
  placeholder?: string;
  ref?: RefObject<HTMLInputElement>;
}
export function InputButton({
  variant = "normal",
  color = "yellow",
  disabled = false,
  prefix,
  className,
  readOnly = false,
  size = "medium",
  flexibleWidth = true,
  label,
  placeholder = "",
  onClick,
  onFocus,
  onBlur,
  ref,
  ...rest
}: InputButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null!);
  return (
    <div className="w-full">
      <input
        ref={ref}
        className="hidden-focusable"
        tabIndex={-1}
        onFocus={() => void buttonRef.current.focus()}
        {...rest}
      />
      <button
        ref={buttonRef}
        aria-disabled={disabled}
        aria-readonly={readOnly}
        data-color={color}
        data-variant={variant}
        className={clsx(
          "w-full cursor-pointer",
          inputConfig.container,
          sizeVariant[size],
          className,
        )}
        type="button"
        onClick={onClick as MouseEventHandler<HTMLButtonElement>}
        onFocus={onFocus as FocusEventHandler<HTMLButtonElement>}
        onBlur={onBlur as FocusEventHandler<HTMLButtonElement>}
      >
        {prefix && (
          <div
            className={clsx([
              "flex-center relative",
              typeof prefix === "string" && "text-gray-6 mx-2 select-none",
            ])}
          >
            {prefix}
          </div>
        )}
        <div
          data-color="yellow"
          aria-disabled={disabled}
          aria-readonly={readOnly}
          className={clsx("flex flex-1 items-center", flexibleWidth && "w-0")}
        >
          <span className={clsx("flex flex-1 items-center truncate px-2", !label && "text-gray-5")}>
            {label || placeholder}
          </span>
          <span className="text-gray-7 box-border inline-flex h-8 min-w-8 items-center justify-center rounded-full">
            <i className="fe-angle-down"></i>
          </span>
        </div>
      </button>
    </div>
  );
}
