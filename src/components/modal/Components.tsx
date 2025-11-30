import { ComponentProps } from "react";
import { useModalContext } from "./useModalContext";
import clsx from "clsx";
import { Button } from "../button/Button";
import { Scroll } from "../scroll/Scroll";

interface ModalHeaderProps extends ComponentProps<"h2"> {
  closeButton?: boolean;
}
export function ModalHeader({
  children,
  className,
  closeButton = true,
  ...props
}: ModalHeaderProps) {
  const { setOpen } = useModalContext();

  return (
    <>
      {closeButton && (
        <div className="float-right p-1">
          <Button icon variant="text" color="gray" onClick={() => setOpen(false)}>
            <i className="fe-cancel"></i>
          </Button>
        </div>
      )}
      <header className={clsx("flex items-center p-2", className)} {...props}>
        <h4 className="leading-6 font-semibold">{children}</h4>
      </header>
    </>
  );
}

interface ModalDescriptionProps extends ComponentProps<"div"> {
  scrollable?: boolean;
}
export function ModalDescription({
  children,
  className,
  scrollable = false,
  ...props
}: ModalDescriptionProps) {
  if (!scrollable) {
    return (
      <div className={clsx("p-2 pt-0", className)} {...props}>
        {children}
      </div>
    );
  }
  return (
    <Scroll className={clsx("flex flex-col", className)} {...props}>
      {children}
    </Scroll>
  );
}

export function ModalFooter({ children, className, ...props }: ComponentProps<"footer">) {
  return (
    <footer className={clsx("relative z-10 p-2", className)} {...props}>
      {children}
    </footer>
  );
}
