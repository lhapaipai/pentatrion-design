import { ComponentProps, RefObject, useImperativeHandle, useRef } from "react";
import clsx from "clsx";
import { Loader } from "../loader";
import { useRipple } from "../../hooks";
import { Slot } from "../slot";
import { cva } from "class-variance-authority";
import { ThemeColor } from "../../types";

export interface ButtonProps extends Omit<ComponentProps<"button">, "color"> {
  withRipple?: boolean;

  variant?: "contained" | "light" | "outlined" | "text" | "ghost";

  size?: "small" | "medium" | "large" | "custom" | "input";

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

  ref?: RefObject<HTMLButtonElement>;
}

export const buttonVariants = cva(
  "relative box-border inline-flex items-center leading-5 no-underline focus-visible-has:outline-2 truncate",
  {
    variants: {
      clickable: {
        true: "cursor-pointer active:translate-y-[1px] focus-visible-has:z-10",
        false: "pointer-events-none",
      },
      size: {
        small: "[--h-button:1.5rem] h-(--h-button)",
        medium: "[--h-button:2rem] h-(--h-button)",
        large: "[--h-button:3rem] h-(--h-button)",
        input: "[--h-button:calc(var(--h-input)-2px)] h-(--h-button)",
        custom: "",
      },
      icon: {
        true: "rounded-[calc(var(--h-button)/2)] min-w-(--h-button) [&_i,&_img,&_svg]:w-(--h-button) justify-center [&_:last-child:not(i,img,svg)]:pr-4",
        false: "rounded-2xl px-4",
        custom: "",
      },
      width: {
        fit: "w-full max-w-fit",
        full: "w-full",
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
          "shadow-sm hover:shadow-md active:shadow-md-active outline-offset-0 text-custom-text bg-custom-3 hover:bg-custom-4 current:bg-custom-4  focus-visible-has:outline-custom-5",
        light:
          "shadow-sm hover:shadow-md has-checked:shadow-md focus:shadow-md active:shadow-md-active outline-offset-0 bg-custom-1 text-gray-text hover:text-custom-text hover:bg-custom-3 current:bg-custom-3 focus-visible-has:outline-custom-4",
        outlined:
          "bg-gray-0 hover:shadow-xs active:shadow-xs-active text-gray-7 outline-offset-0 border-2 hover:bg-custom-1/50 border-custom-3 focus-visible-has:outline-custom-5 current:bg-custom-3 focus-visible-has:border-transparent",
        text: "bg-transparent hover:shadow-xs active:shadow-xs-active outline-offset-0 hover:bg-custom-1 dark:hover:bg-custom-1/50 text-gray-7 hover:text-gray-8 current:bg-custom-3 focus-visible-has:outline-custom-5",
        ghost: "outline-offset-0  current:bg-custom-1 focus-visible-has:outline-custom-5",
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

export function Button({
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
  ref,
  ...props
}: ButtonProps) {
  const inputRef = useRef<HTMLButtonElement>(null!);

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
          width,
          icon: width === "custom" && !icon ? "custom" : icon,
        }),
        className,
        loading && !icon && "text-transparent",
      )}
      data-color={color}
      data-variant={variant}
      aria-checked={selected}
      disabled={typeof disabled === "boolean" ? disabled : undefined}
      suppressHydrationWarning
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
              className={clsx("top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2")}
              position="absolute"
            />
          )}
        </>
      )}
    </Comp>
  );
}
