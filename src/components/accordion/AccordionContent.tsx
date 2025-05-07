import { ComponentProps, useEffect, useRef } from "react";
import { useAccordion } from "./useAccordion";
import clsx from "clsx";

interface Props extends ComponentProps<"div"> {
  name: string;
}

export function AccordionContent({ name, children, ...rest }: Props) {
  const { value } = useAccordion();
  const wrapperRef = useRef<HTMLDivElement>(null!);
  const contentRef = useRef<HTMLDivElement>(null!);

  const isOpen = value === name;

  useEffect(() => {
    const updateHeight = () => {
      wrapperRef.current.style.setProperty(
        "--accordion-content-height",
        `${contentRef.current.scrollHeight}px`,
      );
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={clsx(
        "overflow-hidden transition-[height] ease-in-out",
        isOpen ? "h-(--accordion-content-height)" : "h-0",
      )}
      {...rest}
    >
      <div className="p-2" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
