import { useMemo } from "react";
import clsx from "clsx";

import { stateToHtml } from "./config/html";
import type { WysiwygValue } from "./types";

interface Props {
  value: WysiwygValue;
  proseCompact?: boolean;
  className?: string;
}

export function WysiwygReader({ value, proseCompact = false, className }: Props) {
  const html = useMemo(() => value.html ?? stateToHtml(value.state), [value.html, value.state]);

  return (
    <div
      className={clsx(className ?? "prose")}
      {...(proseCompact ? { "data-compact": true } : {})}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
