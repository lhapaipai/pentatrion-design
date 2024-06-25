import { ReactNode, isValidElement } from "react";
import { TooltipOptions } from "./interface";
import { Tooltip, TooltipContent, TooltipTrigger } from ".";

interface Props extends TooltipOptions {
  children: ReactNode;
  content: ReactNode;
}

export function SimpleTooltip({ content, children, contentClassName, ...options }: Props) {
  return (
    <Tooltip {...options}>
      <TooltipContent className={contentClassName}>{content}</TooltipContent>
      <TooltipTrigger asChild={isValidElement(children)}>{children}</TooltipTrigger>
    </Tooltip>
  );
}
