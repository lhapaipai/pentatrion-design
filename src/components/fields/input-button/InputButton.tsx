import clsx from "clsx";
import {
  ComponentPropsWithRef,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
} from "react";
import { ThemeColor } from "../../../types";
import { inputConfig, sizeVariant } from "../text/Input";
import { Button } from "../../button";

export interface InputButtonProps extends Omit<
  ComponentPropsWithRef<"div">,
  "prefix" | "size" | "onClick" | "onFocus" | "onBlur"
> {
  label?: string;
  variant?: "normal" | "ghost";
  disabled?: boolean;
  prefix?: ReactNode;
  color?: ThemeColor;
  size?: "small" | "medium" | "large" | "custom";
  flexibleWidth?: boolean;

  readOnly?: boolean;
  placeholder?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onFocus?: FocusEventHandler<HTMLDivElement>;
  onBlur?: FocusEventHandler<HTMLDivElement>;
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
  ...rest
}: InputButtonProps) {
  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
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
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        {...rest}
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
          className={clsx(
            "flex flex-1 items-center truncate px-2",
            flexibleWidth && "w-0",
            !label && "text-gray-5",
          )}
        >
          {label || placeholder}
        </div>
        <Button
          color="gray"
          withRipple={false}
          icon
          variant="text"
          focusable={false}
          type="button"
          size="input"
        >
          <i className="fe-angle-down"></i>
        </Button>
      </div>
    </div>
  );
}
