import { ComponentPropsWithRef, ReactNode } from "react";
import { ThemeColor } from "../../../types";

interface Props extends ComponentPropsWithRef<"div"> {
  color?: ThemeColor;
  children: ReactNode;
}

export function ColorForwarder({ children, color, ref, ...rest }: Props) {
  return (
    <div {...rest} data-color={color} ref={ref}>
      {children}
    </div>
  );
}
