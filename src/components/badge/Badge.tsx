import { ReactNode } from "react";
import { ThemeColor } from "../../types";
import clsx from "clsx";
import { buttonVariants } from "../button/Button";
import { Tooltip } from "../tooltip/Tooltip";
import { TooltipContent } from "../tooltip/TooltipContent";
import { TooltipTrigger } from "../tooltip/TooltipTrigger";

interface Props {
  children: ReactNode;
  className?: string;
  tooltip?: string;
  url?: string;
  color?: ThemeColor;
  onClick?: () => void;
  onRemove?: () => void;
}

export function Badge({
  children,
  className,
  onRemove,
  onClick,
  tooltip,
  url,
  color = "yellow",
}: Props) {
  const badge = (
    <span
      data-color={color}
      className={clsx(
        "w-fit rounded-full text-body-xs",
        buttonVariants({
          variant: "contained",
          icon: null,
          size: null,
          clickable: onClick !== undefined,
        }),
        className,
      )}
    >
      {onClick ? (
        <button className="px-2" onClick={onClick}>
          {children}
        </button>
      ) : (
        <span className="px-2">{children}</span>
      )}
      {onRemove && (
        <button className="remove rounded-r-full pl-0.5 pr-1" onClick={onRemove}>
          <i className="fe-cancel"></i>
        </button>
      )}
    </span>
  );
  const wrappedBadge = url ? <a href={url}>{badge}</a> : badge;

  if (!tooltip) {
    return wrappedBadge;
  }

  return (
    <Tooltip>
      <TooltipContent>{tooltip}</TooltipContent>
      <TooltipTrigger asChild={true}>{wrappedBadge}</TooltipTrigger>
    </Tooltip>
  );
}
