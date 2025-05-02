import { ComponentProps, useCallback, useContext } from "react";
import { ResizableContext } from "./context";
import clsx from "clsx";

interface Props extends ComponentProps<"div"> {
  widthCustomClassName?: string;
}

export function ResizableHandle({
  className,
  widthCustomClassName = "translate-x-(--resizable-panel-width)",
  ...rest
}: Props) {
  const context = useContext(ResizableContext);
  if (!context) throw new Error("ResizableHandle must be a child of Resizable");

  const handlePointerMove = useCallback(
    (e: MouseEvent) => {
      if (!context.panelRef.current) {
        return;
      }
      const cssVarName = "--resizable-panel-width";

      const containerRect = context.panelRef.current.getBoundingClientRect();
      const width = e.pageX - containerRect.left;
      context.containerRef.current.style.setProperty(
        cssVarName,
        `${(width * context.scaleFactor) / 100}px`,
      );
      return () => {
        document.documentElement.style.removeProperty(cssVarName);
      };
    },
    [context.containerRef, context.panelRef, context.scaleFactor],
  );

  const handlePointerUp = useCallback(() => {
    const handler = handlePointerMove;
    document.removeEventListener("pointermove", handler);
    document.body.classList.remove("cursor-ew-resize");

    return () => {
      document.removeEventListener("pointermove", handler);
    };
  }, [handlePointerMove]);

  function handlePointerDown() {
    document.addEventListener("pointerup", handlePointerUp, { once: true });
    document.addEventListener("pointermove", handlePointerMove);
    document.body.classList.add(`cursor-ew-resize`);
  }

  return (
    <div
      className={clsx(
        "group pointer-events-auto absolute top-1/2 left-0 cursor-ew-resize max-lg:hidden",
        widthCustomClassName,
      )}
      onPointerDown={handlePointerDown}
    >
      <div
        className={clsx(
          className,
          "bg-gray-5 group-hover:bg-gray-3 group-active:bg-gray-1 h-12 w-1.5 translate-x-1/2 -translate-y-1/2 rounded-full",
        )}
        {...rest}
      />
      <div className="absolute top-0 left-0 h-32 w-16 -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );
}
