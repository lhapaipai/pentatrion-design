import { ReactNode } from "react";
import { ThemeColor } from "../../types";
import clsx from "clsx";
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
  const clickable = onClick !== undefined || url !== undefined;
  const badge = (
    <span
      data-color={color}
      className={clsx(
        "bg-custom-2/50 text-gray-text relative box-border inline-flex h-(--h-button) items-center truncate leading-5 no-underline [--h-button:1.5rem]",
        clickable && "cursor-pointer active:translate-y-[1px]",
        "text-body-xs w-fit rounded-full",
        className,
      )}
    >
      {onClick ? (
        <button className="cursor-pointer px-2" onClick={onClick}>
          {children}
        </button>
      ) : (
        <span className="px-2">{children}</span>
      )}
      {onRemove && (
        <button
          className="remove cursor-pointer rounded-r-full pr-1 pl-0.5 active:translate-y-[1px]"
          onClick={onRemove}
        >
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
