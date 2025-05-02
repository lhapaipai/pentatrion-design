import { ComponentProps, useContext } from "react";
import { ResizableContext } from "./context";
import clsx from "clsx";

interface Props extends ComponentProps<"div"> {
  widthCustomClassName?: string;
}

export function ResizablePanel({
  className,
  widthCustomClassName = "w-(--resizable-panel-width)",
  ...rest
}: Props) {
  const context = useContext(ResizableContext);
  if (!context) throw new Error("ResizablePanel must be a child of Resizable");

  return <div ref={context.panelRef} className={clsx(className, widthCustomClassName)} {...rest} />;
}
