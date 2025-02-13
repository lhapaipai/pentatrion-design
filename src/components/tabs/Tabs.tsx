import { ReactNode } from "react";
import clsx from "clsx";

/* TODO: fix stickyTabs with overflow: hidden */

export interface Tab {
  id: string | number;
  title: ReactNode;
  content?: ReactNode;
}

interface Props {
  tabs?: Tab[];
  value: number | string;
  /**
   * Will make tabs stick to the top of the container when overflowing
   */
  stickyTabs?: boolean;
  /**
   * Tabs will take the maximum width and divide equally
   */
  fullWidth?: boolean;
  onChange: (id: number | string) => void;

  children?: ReactNode;

  className?: string;
  contentClassName?: string;
  listClassName?: string;
}

export function Tabs({
  className,
  listClassName,
  contentClassName,
  tabs = [],
  value,
  onChange,
  fullWidth = false,
  stickyTabs = false,
  children,
}: Props) {
  const content = tabs.find((t) => t.id === value)?.content;
  return (
    <div className={clsx("ll-tabs bg-gray-2 overflow-hidden shadow-sm", className)}>
      <div
        role="tablist"
        className={clsx("tabs-list flex", stickyTabs && "sticky top-0 z-1", listClassName)}
      >
        {tabs.map(({ title, id }) => {
          return (
            <div
              key={id}
              role="tab"
              className={clsx(
                "tabs-list-item hover:text-gray-7 border-t-4",
                fullWidth && "flex-1 text-center",
                value === id
                  ? "border-t-yellow-3 bg-gray-0 text-gray-7"
                  : "text-gray-6 border-t-transparent",
              )}
            >
              <button
                className="w-full px-2 py-1 focus-visible:outline-offset-0"
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  onChange(id);
                }}
              >
                {title}
              </button>
            </div>
          );
        })}
        {children && <div className="extra mr-2 ml-auto flex items-center">{children}</div>}
      </div>
      <div className={clsx("bg-gray-0 p-2 shadow-sm", contentClassName)} role="tabpanel">
        {content}
      </div>
    </div>
  );
}
