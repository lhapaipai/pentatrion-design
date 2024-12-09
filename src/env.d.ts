import "react";

// issue: https://github.com/floating-ui/floating-ui/issues/2507
import type {} from "@floating-ui/react-dom";

type Merge<T, U> = Omit<T, keyof U> & U;
type PropsWithAs<P, T extends React.ElementType> = P & { as?: T };
export type PolymorphicPropsWithRef<P, T extends React.ElementType> = Merge<
  T extends keyof JSX.IntrinsicElements
    ? React.PropsWithRef<JSX.IntrinsicElements[T]>
    : React.ComponentPropsWithRef<T>,
  PropsWithAs<P, T>
>;

declare global {
  interface GlobalEventHandlersEventMap {
    "contextmenu-custom": CustomEvent;
  }
}

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
