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
        "text-body-xs w-fit rounded-full",
        buttonVariants({
          variant: "contained",
          icon: null,
          size: null,
          clickable: onClick !== undefined,
          width: "custom",
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
        <button className="remove rounded-r-full pr-1 pl-0.5" onClick={onRemove}>
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
