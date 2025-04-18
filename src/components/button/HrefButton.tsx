import { ComponentProps, RefObject, useImperativeHandle, useRef } from "react";
import clsx from "clsx";
import { useRipple } from "../../hooks/useRipple";
import { ButtonProps, buttonVariants } from "./Button";

export type HrefButtonProps = ComponentProps<"a"> &
  Pick<
    ButtonProps,
    "withRipple" | "variant" | "size" | "color" | "selected" | "icon" | "disabled" | "width"
  > & { ref?: RefObject<HTMLAnchorElement> };

export function HrefButton({
  withRipple = true,
  variant = "contained",
  color = "yellow",
  size = "medium",
  width = "fit",
  className,
  disabled,
  children,
  selected = false,
  icon = false,
  href,
  ref,
  ...props
}: HrefButtonProps) {
  const anchorRef = useRef<HTMLAnchorElement>(null!);

  useImperativeHandle<HTMLAnchorElement | null, HTMLAnchorElement | null>(
    ref,
    () => anchorRef.current,
  );

  const ripples = useRipple(anchorRef);

  return (
    <a
      role="button"
      href={href}
      ref={anchorRef}
      className={clsx(
        buttonVariants({ variant, size, width, icon: size === "custom" ? "custom" : icon }),
        className,
        selected && "active",
      )}
      data-color={color}
      data-variant={variant}
      aria-checked={selected}
      aria-disabled={disabled}
      {...props}
    >
      {!disabled && withRipple && ripples}
      {children}
    </a>
  );
}
