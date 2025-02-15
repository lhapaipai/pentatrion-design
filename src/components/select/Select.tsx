import {
  ChangeEvent,
  ComponentProps,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  Placement,
  autoUpdate,
  flip,
  offset,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from "@floating-ui/react";
import { SelectSelection, SelectSelectionProps } from "./SelectSelection";
import { SelectContext } from "./useSelectContext";

import type { Option } from "./interface";
import clsx from "clsx";
import { Input } from "../input/Input";
import { Button } from "../button/Button";
import { useEffectEvent } from "../../hooks/useEffectEvent";
import { Dialog } from "../dialog/Dialog";
import { ThemeColor } from "~/types";

// readonly string[] -> nécessaire uniquement pour @conform-to/react
// voir getSelectProps()
// src/components/form/form.stories.tsx
export type SelectValue = number | string | readonly string[] | null;
type ChangeEventLike = {
  target: {
    value: SelectValue;
  };
};

export type SelectProps<O extends Option = Option> = {
  variant?: "normal" | "ghost";
  showArrow?: boolean;
  selectionClassName?: string;
  width?: number | string;
  floatingMinWidth?: number;
  placement?: Placement;
  options: O[];
  color?: ThemeColor;
  placeholder?: string;
  getSearchableValue?: (matchReg: RegExp, option: O) => string;
  searchable?: boolean;
  selectOptionComponent?: (props: O) => ReactNode;
  selectSelectionComponent?: (props: SelectSelectionProps<O>) => ReactNode;
  defaultValue?: SelectValue;
  value?: SelectValue;
  onChange?: ((e: ChangeEventLike) => void) | null;
  zIndex?: number;
  ref?: RefObject<HTMLDivElement>;
} & Omit<ComponentProps<"select">, "onChange" | "value" | "defaultValue" | "multiple">;

function defaultGetSearchableValue(matchReg: RegExp, option: Option) {
  return matchReg.test(option.label.toLowerCase().trim());
}

export function Select<O extends Option>({
  id,
  variant = "normal",
  disabled = false,
  showArrow = true,
  selectionClassName,
  width = "100%",
  floatingMinWidth = 130,
  placement = "bottom",
  searchable = false,
  required = true,
  defaultValue,
  name = "",
  value: controlledValue,
  onChange = null,
  placeholder = "Select ...",
  getSearchableValue,
  selectSelectionComponent: SelectSelectionCustomComponent,
  selectOptionComponent: SelectOptionCustomComponent,
  options = [],
  zIndex,
  color = "yellow",
  ref,
}: SelectProps<O>) {
  const isControlled = typeof controlledValue !== "undefined";

  const onChangeStable = useEffectEvent(onChange);

  const [uncontrolledSelectedIndex, setUncontrolledSelectedIndex] = useState<number | null>(() => {
    if (typeof defaultValue === "undefined") {
      return null;
    }
    const pos = options.findIndex((o) => o.value === defaultValue);
    return pos !== -1 ? pos : null;
  });
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(
    () =>
      options.filter((option) => {
        if (!searchable || search.trim() === "") {
          return true;
        }
        const fn = getSearchableValue ?? defaultGetSearchableValue;
        const matchReg = new RegExp(search.toLowerCase().trim());
        return fn(matchReg, option);
      }),
    [searchable, search, getSearchableValue, options],
  );

  let selectedIndex: number | null = null;
  if (isControlled) {
    if (controlledValue !== null) {
      const pos = filteredOptions.findIndex((o) => o.value === controlledValue);
      if (pos !== -1) {
        selectedIndex = pos;
      }
    }
  } else {
    selectedIndex = uncontrolledSelectedIndex;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchHasFocus, setSearchHasFocus] = useState(false);

  const SelectSelectionComponent = SelectSelectionCustomComponent ?? SelectSelection;

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setActiveIndex(null);
    setSearch(e.target.value);
  }

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({ padding: 10 }),
      size({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            width: `${Math.max(floatingMinWidth, rects.reference.width)}px`,
          });
          const firstChild = elements.floating.firstElementChild as HTMLElement;
          if (firstChild) {
            firstChild.style.maxHeight = `${Math.min(availableHeight, 300)}px`;
          }
        },
        padding: 10,
      }),
    ],
  });

  const mergedRef = useMergeRefs([refs.setReference, ref]);

  const listRef = useRef<Array<HTMLElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);
  const isTypingRef = useRef(false);

  const click = useClick(context, { event: "mousedown" });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    focusItemOnHover: searchable ? false : true,
    selectedIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });

  const typeahead = useTypeahead(context, {
    enabled: !searchHasFocus,
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: isOpen ? setActiveIndex : undefined,
    onTypingChange(isTyping) {
      isTypingRef.current = isTyping;
    },
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    listNav,
    typeahead,
    click,
    dismiss,
    role,
  ]);

  useEffect(() => {
    if (SelectOptionCustomComponent) {
      return;
    }
    filteredOptions.map((option, i) => {
      labelsRef.current[i] = option.label;
    });
  }, [search, filteredOptions, SelectOptionCustomComponent]);

  const handleSelect = useCallback(
    (index: number | null) => {
      setIsOpen(false);
      setSearch("");

      const event: ChangeEventLike = {
        target: {
          value: index === null ? null : filteredOptions[index].value,
        },
      };
      onChangeStable?.(event);

      if (!isControlled) {
        setUncontrolledSelectedIndex(index);
      }
    },
    [isControlled, onChangeStable, filteredOptions],
  );

  const selectContext = useMemo(
    () => ({
      activeIndex,
      selectedIndex,
      getItemProps,
      handleSelect,
    }),
    [activeIndex, selectedIndex, getItemProps, handleSelect],
  );

  const showCancelButton = !required && selectedIndex !== null;

  return (
    <div>
      <input
        type="hidden"
        id={id}
        name={name}
        value={selectedIndex !== null ? filteredOptions[selectedIndex].value : ""}
      />
      <div
        data-color={color}
        aria-disabled={disabled}
        className={clsx(
          "p8n-input-text box-border flex cursor-pointer rounded-2xl outline-offset-[-1px]",
          selectionClassName,
          isOpen && "focus",
        )}
        data-variant={variant}
        ref={mergedRef}
        tabIndex={0}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
        }}
        {...getReferenceProps()}
      >
        <span className="flex h-8 flex-1 items-center truncate px-2">
          {selectedIndex !== null ? (
            <SelectSelectionComponent {...filteredOptions[selectedIndex]} key={selectedIndex} />
          ) : (
            placeholder
          )}
        </span>
        {showCancelButton && (
          <Button
            withRipple={false}
            icon
            variant="text"
            color="gray"
            onMouseDown={(e) => {
              // we don't want dropdown to open
              e.stopPropagation();
            }}
            onClick={() => {
              handleSelect(null);
            }}
          >
            <i className="fe-cancel"></i>
          </Button>
        )}
        {!showCancelButton && showArrow && (
          <Button color="gray" withRipple={false} icon variant="text" focusable={false}>
            <i className={isOpen ? "fe-angle-up" : "fe-angle-down"}></i>
          </Button>
        )}
      </div>
      <FloatingPortal>
        <SelectContext.Provider value={selectContext}>
          {isOpen && (
            <FloatingFocusManager context={context} modal={false}>
              <div
                className="z-dialog outline-hidden"
                data-testid="select-list"
                ref={refs.setFloating}
                style={{
                  ...floatingStyles,
                  zIndex,
                }}
                {...getFloatingProps()}
              >
                <Dialog
                  placement={context.placement}
                  className="motion-safe:animate-fade-in-list max-h-80 overflow-auto"
                >
                  {searchable && (
                    <div className="p-2">
                      <Input
                        color="gray"
                        placeholder="Search"
                        tabIndex={selectedIndex === null ? 0 : -1}
                        value={search}
                        onChange={handleSearchChange}
                        onFocus={() => setSearchHasFocus(true)}
                        onBlur={() => setSearchHasFocus(false)}
                      ></Input>
                    </div>
                  )}
                  {SelectOptionCustomComponent ? (
                    <FloatingList elementsRef={listRef} labelsRef={labelsRef}>
                      {filteredOptions.map((option) => (
                        <SelectOptionCustomComponent {...option} key={option.value} />
                      ))}
                    </FloatingList>
                  ) : (
                    filteredOptions.map((option, index) => {
                      const isActive = activeIndex === index;
                      const isSelected = selectedIndex === index;

                      return (
                        <button
                          key={option.value}
                          className={clsx(
                            "option",
                            isSelected ? "bg-gray-2" : isActive && "bg-gray-1",
                          )}
                          data-presentation="compact"
                          role="option"
                          aria-selected={isActive && isSelected}
                          tabIndex={isActive ? 0 : -1}
                          ref={(node) => {
                            listRef.current[index] = node;
                          }}
                          {...getItemProps({
                            onClick: () => handleSelect(index),
                          })}
                        >
                          {option.label}
                        </button>
                      );
                    })
                  )}
                </Dialog>
              </div>
            </FloatingFocusManager>
          )}
        </SelectContext.Provider>
      </FloatingPortal>
    </div>
  );
}
