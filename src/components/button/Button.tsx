import { ComponentPropsWithRef, forwardRef, useImperativeHandle, useRef } from "react";
import clsx from "clsx";
import { ThemeColor } from "../../types";
import { Loader } from "../loader";
import { useRipple } from "../../hooks";
import { Slot } from "../slot";
import { cva } from "class-variance-authority";

export interface ButtonProps extends Omit<ComponentPropsWithRef<"button">, "color"> {
  withRipple?: boolean;

  variant?: "contained" | "light" | "outlined" | "text" | "ghost";

  size?: "small" | "medium" | "large" | "custom";

  color?: ThemeColor;

  width?: "fit" | "full" | "custom";

  loading?: boolean;

  disabled?: boolean;

  focusable?: boolean;
  /**
   * For a selected item inside a group.
   */
  selected?: boolean;

  icon?: boolean;

  asChild?: boolean;
}

export const buttonVariants = cva(
  "relative box-border inline-flex items-center overflow-clip text-center leading-5 no-underline focus-visible-has:outline focus-visible-has:outline-2",
  {
    variants: {
      clickable: {
        true: "cursor-pointer active:translate-y-[1px] focus-visible-has:z-10",
        false: "pointer-events-none",
      },
      size: {
        small: "truncate h-6",
        medium: "truncate h-8",
        large: "truncate h-12",
        custom: "",
      },
      icon: {
        /* if size is custom icon is not used */
        true: "rounded-full [&_i]:w-[calc(2rem-4px)] justify-center [&_:last-child:not(i,img,svg)]:pr-4",
        false: "rounded-2xl",
        custom: "",
      },
      variant: {
        /**
         * src/tailwind/plugin.ts
         *   addVariant("current", [
         *    `&[aria-checked="true"]`,
         *    `&[aria-current="page"]`,
         *    `&:has(:checked)`
         *   ])
         */
        contained:
          "shadow hover:shadow-md active:shadow-md-active outline-offset-0 text-[rgb(var(--color-custom-text))] bg-[rgb(var(--color-custom-3))] hover:bg-[rgb(var(--color-custom-4))] current:bg-[rgb(var(--color-custom-4))]  focus-visible-has:outline-[rgb(var(--color-custom-5))]",
        light:
          "shadow hover:shadow-md has-[:checked]:shadow-md focus:shadow-md active:shadow-md-active outline-offset-0 bg-[rgb(var(--color-custom-1))] text-gray-text hover:text-[rgb(var(--color-custom-text))] hover:bg-[rgb(var(--color-custom-3))] current:bg-[rgb(var(--color-custom-3))] focus-visible-has:outline-[rgb(var(--color-custom-4))]",
        outlined:
          "bg-gray-0 hover:shadow-sm active:shadow-sm-active text-gray-7 outline-offset-0 border-2 hover:bg-[rgb(var(--color-custom-1)/50%)] border-[rgb(var(--color-custom-3))] focus-visible-has:outline-[rgb(var(--color-custom-5))] current:bg-[rgb(var(--color-custom-3))] focus-visible-has:border-transparent",
        text: "bg-transparent hover:shadow-sm active:shadow-sm-active outline-offset-0 hover:bg-[rgb(var(--color-custom-1))] dark:hover:bg-[rgb(var(--color-custom-1)/50%)] text-gray-7 hover:text-gray-8 current:bg-[rgb(var(--color-custom-3))] focus-visible-has:outline-[rgb(var(--color-custom-5))]",
        ghost:
          "bg-transparent outline-offset-0 text-gray-7 hover:text-gray-8 current:bg-[rgb(var(--color-custom-1))] focus-visible-has:outline-[rgb(var(--color-custom-5))]",
      },
      width: {
        fit: "w-full max-w-fit px-4",
        full: "w-full",
        custom: "",
      },
    },
    defaultVariants: {
      size: "medium",
      icon: false,
      variant: "contained",
      clickable: true,
      width: "fit",
    },
  },
);

const iconSizeVariants = {
  small: "min-w-6",
  medium: "min-w-8",
  large: "min-w-12",
  custom: "",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    withRipple = true,
    variant = "contained",
    loading = false,
    color = "yellow",
    size = "medium",
    focusable = true,
    className,
    disabled = false,
    children,
    selected = false,
    icon = false,
    asChild = false,
    width = "fit",
    ...props
  },
  ref,
) {
  const inputRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle<HTMLButtonElement | null, HTMLButtonElement | null>(
    ref,
    () => inputRef.current,
  );

  const notClickable = loading || disabled;

  const ripples = useRipple(
    inputRef,
    ["text", "outlined", "ghost"].includes(variant) ? true : false,
  );

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      tabIndex={focusable ? 0 : -1}
      role="button"
      ref={inputRef}
      className={clsx(
        buttonVariants({
          variant,
          size,
          width: icon ? "custom" : width,
          icon: size === "custom" ? "custom" : icon,
        }),
        icon && iconSizeVariants[size],
        className,
        loading && !icon && "text-transparent",
      )}
      data-color={color}
      data-variant={variant}
      aria-checked={selected}
      disabled={typeof disabled === "boolean" ? disabled : undefined}
      aria-busy={loading}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {!notClickable && withRipple && ripples}
          {children}
          {loading && (
            <Loader
              color={color}
              className={clsx("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2")}
            />
          )}
        </>
      )}
    </Comp>
  );
});
