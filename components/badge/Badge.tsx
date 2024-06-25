import { ReactNode } from "react";
import { ThemeColor } from "../../types.d";
import clsx from "clsx";
import { buttonVariants } from "../button";
import { Href } from "../href";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
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
      className={clsx(
        "ll-badge",
        "inline-flex w-fit items-stretch overflow-hidden rounded-full text-xs shadow",
        buttonVariants.variant.contained(color),
        // badgeVariants.color[color],
        // `variant-solid-${color}`,
        // `text-${color}-4`,
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
        <button
          className="remove rounded-r-full pl-0.5 pr-1"
          onClick={onRemove}
        >
          <i className="fe-cancel"></i>
        </button>
      )}
    </span>
  );
  const wrappedBadge = url ? (
    <Href href={url} ghost={true}>
      {badge}
    </Href>
  ) : (
    badge
  );

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
