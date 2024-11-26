import { ComponentPropsWithRef, forwardRef, useImperativeHandle, useRef } from "react";
import clsx from "clsx";
import { ThemeColor } from "~/types";
import { Loader } from "../loader";
import { useRipple } from "~/hooks";
import { Slot } from "../slot";
import { cva } from "class-variance-authority";

export interface ButtonProps extends Omit<ComponentPropsWithRef<"button">, "color"> {
  withRipple?: boolean;

  variant?: "contained" | "light" | "outlined" | "text" | "ghost";

  size?: "small" | "medium" | "large" | "custom";

  color?: ThemeColor;

  children?: React.ReactNode;

  /**
   * undefined: hidden
   * false: invisible
   * true: visible
   */
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
  "relative box-border inline-flex cursor-pointer items-center overflow-clip text-center leading-5 no-underline focus-visible:outline focus-visible:outline-2 active:translate-y-[1px]",
  {
    variants: {
      size: {
        small: "h-6",
        medium: "h-8",
        large: "h-12",
        custom: "",
      },
      icon: {
        true: "rounded-full min-w-8 [&_i]:w-[calc(2rem-4px)] justify-center [&_:last-child:not(i,img,svg)]:pr-4",
        false: "rounded-2xl px-4",
        custom: "",
      },
      variant: {
        contained:
          "shadow hover:shadow-md active-full:shadow-md-active outline-offset-0 text-[rgb(var(--color-custom-text))] bg-[rgb(var(--color-custom-3))] hover:bg-[rgb(var(--color-custom-4))] data-[selected=true]:bg-[rgb(var(--color-custom-4))] focus-visible:outline-[rgb(var(--color-custom-5))]",
        light:
          "shadow hover:shadow-md focus:shadow-md active-full:shadow-md-active outline-offset-0 bg-[rgb(var(--color-custom-1))] text-gray-text hover:text-[rgb(var(--color-custom-text))] hover:bg-[rgb(var(--color-custom-3))] focus-visible:outline-[rgb(var(--color-custom-4))]",
        outlined:
          "bg-gray-0 hover:shadow-sm active-full:shadow-sm-active text-gray-7 outline-offset-0 border-2 hover:bg-[rgb(var(--color-custom-1)/50%)] border-[rgb(var(--color-custom-3))] focus-visible:outline-[rgb(var(--color-custom-5))] focus-visible:border-[rgb(var(--color-custom-4))]",
        text: "bg-transparent hover:shadow-sm active-full:shadow-sm-active outline-offset-0 hover:bg-[rgb(var(--color-custom-1))] dark:hover:bg-[rgb(var(--color-custom-1)/50%)] text-gray-7 hover:text-gray-8 focus-visible:outline-[rgb(var(--color-custom-5))]",
        ghost:
          "bg-transparent outline-offset-0 text-gray-7 hover:text-gray-8 focus-visible:outline-[rgb(var(--color-custom-5))]",
      },
    },
    defaultVariants: {
      size: "medium",
      icon: false,
      variant: "contained",
    },
  },
);

export const buttonVariantsLegacy = {
  size(icon: boolean, size: "small" | "medium" | "large" | "custom") {
    if (size === "custom") {
      return false;
    }

    switch (size) {
      case "small":
        return clsx("text-body-sm h-6", icon ? "min-w-6 [&_i]:w-[calc(1.5rem-4px)]" : "px-2");
      case "medium":
        return clsx("h-8", icon ? "min-w-8 [&_i]:w-[calc(2rem-4px)]" : "px-4");
      case "large":
        return clsx(
          "h-12",
          icon ? "text-body-xl min-w-12 [&_i]:w-[calc(3rem-4px)]" : "text-body-lg px-8",
        );
    }
  },
  variant: {
    contained:
      "shadow hover:shadow-md active-full:shadow-md-active outline-offset-0 text-[rgb(var(--color-custom-text))] bg-[rgb(var(--color-custom-3))] hover:bg-[rgb(var(--color-custom-4))] data-[selected=true]:bg-[rgb(var(--color-custom-4))] focus-visible:outline-[rgb(var(--color-custom-5))]",
    light:
      "shadow hover:shadow-md focus:shadow-md active-full:shadow-md-active outline-offset-0 bg-[rgb(var(--color-custom-1))] text-gray-text hover:text-[rgb(var(--color-custom-text))] hover:bg-[rgb(var(--color-custom-3))] focus-visible:outline-[rgb(var(--color-custom-4))]",
    outlined:
      "bg-gray-0 hover:shadow-sm active-full:shadow-sm-active text-gray-7 outline-offset-0 border-2 hover:bg-[rgb(var(--color-custom-1)/50%)] border-[rgb(var(--color-custom-3))] focus-visible:outline-[rgb(var(--color-custom-5))] focus-visible:border-[rgb(var(--color-custom-4))]",
    text: "bg-transparent hover:shadow-sm active-full:shadow-sm-active outline-offset-0 hover:bg-[rgb(var(--color-custom-1))] dark:hover:bg-[rgb(var(--color-custom-1)/50%)] text-gray-7 hover:text-gray-8 focus-visible:outline-[rgb(var(--color-custom-5))]",
    ghost:
      "bg-transparent outline-offset-0 text-gray-7 hover:text-gray-8 focus-visible:outline-[rgb(var(--color-custom-5))]",
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      withRipple = true,
      variant = "contained",
      loading,
      color = "yellow",
      size = "medium",
      focusable = true,
      className,
      disabled,
      children,
      selected = false,
      icon = false,
      asChild = false,
      ...props
    },
    ref,
  ) => {
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
          buttonVariants({ variant, size, icon: size === "custom" ? "custom" : icon }),
          className,
          selected && "active",
        )}
        data-color={color}
        data-variant={variant}
        data-selected={selected}
        disabled={notClickable}
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
              <span className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                <Loader color={color} size="small" className={clsx("")} />
              </span>
            )}
          </>
        )}
      </Comp>
    );
  },
);
