import { Activity, ReactNode, useId } from "react";
import clsx from "clsx";

/* TODO: fix stickyTabs with overflow: hidden */

export interface Tab {
  id: string | number;
  title: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
}

interface Props {
  tabs: Tab[];
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

  action?: ReactNode;

  className?: string;
  contentClassName?: string;
  listClassName?: string;
  preload?: boolean;
}

export function Tabs({
  className,
  listClassName,
  contentClassName,
  tabs,
  value,
  onChange,
  fullWidth = false,
  stickyTabs = false,
  preload = false,
  action,
}: Props) {
  const content = tabs.find((t) => t.id === value)?.content;
  const baseId = useId();
  return (
    <div className={clsx("bg-gray-2 overflow-hidden", className)}>
      <div
        role="tablist"
        className={clsx("flex w-full", stickyTabs && "sticky top-0 z-1", listClassName)}
      >
        <div className="overflow-x-scroll flex-1 min-w-0">
          <div className="flex h-full flex-1">
            {tabs.map(({ title, id, disabled }) => {
              const selected = value === id;
              return (
                <button
                  type="button"
                  key={id}
                  role="tab"
                  id={`${baseId}-tab-${id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${id}`}
                  tabIndex={selected ? 0 : -1}
                  disabled={disabled}
                  className={clsx(
                    "hover:text-gray-7 border-t-4 shrink-0 whitespace-nowrap px-2 py-1 focus-visible:outline-offset-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                    fullWidth && "flex-1 text-center",
                    selected
                      ? "border-t-yellow-3 bg-gray-0 text-gray-7"
                      : "text-gray-6 border-t-transparent",
                  )}
                  onClick={() => onChange(id)}
                >
                  {title}
                </button>
              );
            })}
          </div>
        </div>
        {action && <div className="extra mr-0.5 ml-auto flex items-center">{action}</div>}
      </div>
      <div
        className={clsx("bg-gray-0 p-2", contentClassName)}
        role="tabpanel"
        id={`${baseId}-panel-${value}`}
        aria-labelledby={`${baseId}-tab-${value}`}
      >
        {preload
          ? tabs.map(({ id, content }) => (
              <Activity key={id} mode={value === id ? "visible" : "hidden"}>
                {content}
              </Activity>
            ))
          : content}
      </div>
    </div>
  );
}
