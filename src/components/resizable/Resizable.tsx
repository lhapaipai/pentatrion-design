import clsx from "clsx";
import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { ResizableContext } from "./context";

interface Props extends ComponentProps<"div"> {
  scaleFactor?: number;
}

export function Resizable({ children, className, scaleFactor = 100, ...rest }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null!);
  const panelRef = useRef<HTMLDivElement>(null);

  const context = useMemo(() => {
    return {
      panelRef,
      containerRef,
      isDragging,
      setIsDragging,
      scaleFactor,
    };
  }, [isDragging, scaleFactor]);

  useEffect(() => {
    if (!context.panelRef.current) {
      return;
    }
    const observer = new window.ResizeObserver(([{ target }]) => {
      const width = target.getBoundingClientRect().width ?? 0;
      context.containerRef.current.style.setProperty(
        "--resizable-panel-width",
        `${(width * scaleFactor) / 100}px`,
      );
    });
    observer.observe(context.panelRef.current);
    return () => {
      observer.disconnect();
    };
  }, [context.containerRef, context.panelRef, scaleFactor]);

  return (
    <ResizableContext.Provider value={context}>
      <div ref={containerRef} className={clsx(className, "relative")} {...rest}>
        {children}
      </div>
    </ResizableContext.Provider>
  );
}
