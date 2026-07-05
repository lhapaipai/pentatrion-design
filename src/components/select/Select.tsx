import { Ref, useImperativeHandle, useRef, useState } from "react";
import { SelectChangeEvent, SelectHandle, SelectOption } from "./types";
import {
  autoUpdate,
  offset,
  Placement,
  useFloating,
  size as floatingUiSize,
  flip,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  useTypeahead,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";
import { ThemeColor } from "../../types";
import clsx from "clsx";
import { sizeVariant } from "../input/Input";
import { Dialog } from "../dialog";
import { Button } from "../button";

interface SelectProps<V extends string | number = string> {
  id?: string;
  className?: string;
  name: string;
  variant?: "normal" | "ghost";
  color?: ThemeColor;
  size?: "small" | "medium" | "large" | "custom";
  placeholder?: string;
  disabled?: boolean;
  options: SelectOption<V>[];
  value: V | null;
  onChange: (event: SelectChangeEvent<V>) => void;
  placement?: Placement;
  floatingMinWidth?: number;
  zIndex?: number;

  dialogClassName?: string;
  ref?: Ref<SelectHandle>;

  onFocus?: () => void;
  onBlur?: () => void;
}

export function Select<V extends string | number = string>({
  id,
  className,
  name,
  variant = "normal",
  zIndex,
  color = "yellow",
  size = "medium",
  placeholder = "Select ...",
  disabled = false,
  options,
  value,
  onChange,
  floatingMinWidth = 130,
  placement = "bottom",
  onFocus,
  onBlur,
  dialogClassName,
  ref,
}: SelectProps<V>) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex !== -1 ? options[selectedIndex] : null;

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({ padding: 10 }),
      floatingUiSize({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            width: `${Math.max(floatingMinWidth, rects.reference.width)}px`,
          });
          const firstChild = elements.floating.firstElementChild as HTMLElement;
          if (firstChild) {
            firstChild.style.maxHeight = `${Math.min(availableHeight, 320)}px`;
          }
        },
        padding: 10,
      }),
    ],
  });

  const listRef = useRef<(HTMLElement | null)[]>([]);
  const listContentRef = useRef(options.map((option) => option.label));
  listContentRef.current = options.map((option) => option.label);

  const isTypingRef = useRef(false);

  const click = useClick(context, { event: "mousedown", enabled: !disabled });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "select" });
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    loop: true,
    enabled: !disabled,
  });

  const typeahead = useTypeahead(context, {
    listRef: listContentRef,
    activeIndex,
    selectedIndex: selectedIndex === -1 ? null : selectedIndex,
    onMatch: isOpen ? setActiveIndex : (index) => handleSelect(index ?? -1),
    onTypingChange(isTyping) {
      isTypingRef.current = isTyping;
    },
    enabled: !disabled,
  });

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        (refs.domReference.current as HTMLElement | null)?.focus();
      },
    }),
    [refs.domReference],
  );

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    dismiss,
    role,
    listNav,
    typeahead,
    click,
  ]);

  function handleSelect(index: number) {
    const option = options[index];
    onChange({
      type: "select-one",
      name,
      value: option ? option.value : null,
    });
    setIsOpen(false);
  }

  return (
    <>
      <div
        id={id}
        data-color={color}
        aria-disabled={disabled}
        className={clsx(
          "p8n-input-text box-border flex cursor-pointer rounded-[calc(var(--h-input)/2)] -outline-offset-1",
          className,
          sizeVariant[size],
          isOpen && "focus",
        )}
        data-variant={variant}
        ref={refs.setReference}
        tabIndex={disabled ? -1 : 0}
        {...getReferenceProps({ onFocus, onBlur })}
      >
        <span className="flex flex-1 items-center truncate px-2">
          {selectedOption ? (
            <>
              {selectedOption.icon && <i className={selectedOption.icon}></i>}
              {selectedOption.label}
            </>
          ) : (
            <>{placeholder}</>
          )}
        </span>
        <Button
          color="gray"
          withRipple={false}
          icon
          variant="text"
          focusable={false}
          type="button"
          size="input"
        >
          <i className={isOpen ? "fe-angle-up" : "fe-angle-down"}></i>
        </Button>
      </div>
      {isOpen && (
        <FloatingPortal preserveTabOrder={true}>
          <FloatingFocusManager context={context} modal={false}>
            <div
              className="z-dialog outline-hidden"
              data-testid="select-list"
              ref={refs.setFloating}
              style={{ ...floatingStyles, zIndex }}
              {...getFloatingProps()}
            >
              <Dialog
                placement={context.placement}
                className={clsx("motion-safe:animate-fade-in-list overflow-auto", dialogClassName)}
                rounded={!dialogClassName}
              >
                {options.map((option, i) => {
                  const isActive = i === activeIndex;
                  const isSelected = i === selectedIndex;
                  return (
                    <button
                      type="button"
                      key={option.value}
                      className={clsx("option", isSelected ? "bg-gray-2" : isActive && "bg-gray-1")}
                      data-presentation="compact"
                      role="option"
                      aria-selected={isSelected}
                      ref={(node) => {
                        listRef.current[i] = node;
                      }}
                      {...getItemProps({
                        onClick() {
                          handleSelect(i);
                        },
                        onKeyDown(event) {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            handleSelect(i);
                          }
                          if (event.key === " " && !isTypingRef.current) {
                            event.preventDefault();
                            handleSelect(i);
                          }
                        },
                      })}
                    >
                      {option.icon && <i className={option.icon}></i>}
                      {option.label}
                    </button>
                  );
                })}
              </Dialog>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
