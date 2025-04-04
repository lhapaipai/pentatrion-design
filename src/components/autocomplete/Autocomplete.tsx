import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
  ReactNode,
  ComponentProps,
  CSSProperties,
  RefObject,
} from "react";
import type { OptionLike, Option } from "../select";
import { AutocompleteOption, AutocompleteOptionProps } from "./AutocompleteOption";
import {
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  Placement,
  autoUpdate,
  flip,
  offset,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from "@floating-ui/react";
import { AutocompleteContext } from "./useAutocompleteContext";
import clsx from "clsx";
import { useEffectEvent } from "../../hooks";

import { getOptionLabel, getOptionValue } from "./util";
import { Button } from "../button";
import { Dialog } from "../dialog";
import { Loader } from "../loader";
import { inputConfig, sizeVariant } from "../input/Input";
import { ThemeColor } from "../../types";

export interface AutocompleteProps<O extends OptionLike = Option> extends ComponentProps<"input"> {
  icon?: boolean | ReactNode;

  color?: ThemeColor;

  /**
   * render suffix only if selection and searchValue is empty
   */
  noSearchSuffix?: ReactNode;

  suffix?: ReactNode;

  placement?: Placement;
  /**
   * search string used as value for <input>
   */
  searchValue: string;
  /**
   * change handler when typing in the input
   * or when clicking on an option (the label value is passed)
   */
  onChangeSearchValue: (value: string, selectionLabel: boolean) => void;

  selection?: O | null;
  /**
   * select handler for a selection from the autocomplete's dropdown
   * the option object is passed when clicking on an option
   * null value is passed when typing a new character in the input search.
   */
  onChangeSelection: (option: O | null) => void;
  options: O[];

  autocompleteOptionComponent?: (props: AutocompleteOptionProps<O>) => ReactNode;

  loading?: boolean;

  clearSearchButton?: boolean;

  selectOnFocus?: boolean;

  ref?: RefObject<HTMLInputElement>;
}

export function Autocomplete<O extends OptionLike = Option>({
  className,
  autoFocus = false,
  icon = true,
  color = "yellow",
  noSearchSuffix,
  suffix,
  placement = "bottom",
  placeholder = "Search...",
  selection = null,
  onChangeSelection,
  autocompleteOptionComponent,
  loading = false,
  clearSearchButton = false,
  searchValue,
  onChangeSearchValue,
  options,
  selectOnFocus = true,
  readOnly = false,
  ref,
  ...rest
}: AutocompleteProps<O>) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onChangeSearchValueStable = useEffectEvent(onChangeSearchValue);
  const onChangeSelectionStable = useEffectEvent(onChangeSelection);

  const OptionComponent = autocompleteOptionComponent ?? AutocompleteOption;

  const listRef = useRef<Array<HTMLElement | null>>([]);

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
            width: `${Math.max(130, rects.reference.width)}px`,
          });
          const firstChild = elements.floating.firstElementChild as HTMLElement;
          if (firstChild) {
            firstChild.style.maxHeight = `${Math.min(availableHeight, 288)}px`;
          }
        },
        padding: 10,
      }),
    ],
  });

  const role = useRole(context, { role: "listbox" });
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    /* we want the real focus to stay on the input, so focus associated to active items is simulated */
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    role,
    dismiss,
    listNav,
  ]);

  function handleChangeSearchValue(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    onChangeSearchValueStable(value, false);

    if (value !== searchValue && selection !== null) {
      onChangeSelectionStable(null);
      setActiveIndex(null);
      return;
    }

    if (value) {
      setIsOpen(true);
      /**
       * bug whith LazyAutocomplete activeIndex is set to 0 but the options array has immediately 0 elements
       * so focus can't be set to the first Dom element.
       */
      setActiveIndex(listRef.current[0] ? 0 : null);
    } else {
      setIsOpen(false);
      setActiveIndex(null);
    }
  }

  const handleSelect = useCallback(
    (index: number | null) => {
      if (index === null) {
        onChangeSelectionStable(null);
      } else if (options[index]) {
        const newSelection = options[index];
        onChangeSelectionStable(newSelection);

        onChangeSearchValueStable(getOptionLabel(newSelection), true);
      }
      setActiveIndex(null);
      setIsOpen(false);
    },

    [options, onChangeSelectionStable, onChangeSearchValueStable],
  );

  const autocompleteContext = useMemo(
    () => ({
      activeIndex,
      selection,
      getItemProps,
      handleSelect,
    }),
    [activeIndex, selection, getItemProps, handleSelect],
  );

  const showClearSearchButton =
    clearSearchButton && (searchValue.trim() !== "" || selection !== null);

  return (
    <div className={className} role="combobox">
      <div
        className={clsx(inputConfig.container, sizeVariant.medium, readOnly && "readonly")}
        ref={refs.setReference}
        data-color={color}
      >
        {icon !== false && (
          <div className="flex-center relative">
            <Loader loading={loading} size="input" color="gray" className="mr-2">
              {icon === true ? <i className="fe-search text-body-md"></i> : icon}
            </Loader>
          </div>
        )}
        <input
          autoComplete="off"
          autoFocus={autoFocus}
          spellCheck="false"
          className={clsx(inputConfig.input, icon === false && "pl-4")}
          ref={ref}
          type="search"
          readOnly={readOnly}
          value={searchValue}
          placeholder={placeholder}
          aria-autocomplete="list"
          {...getReferenceProps({
            onClick() {
              if (selectOnFocus) {
                // it's better to listen onClick instead of onFocus. the event is triggered later and there
                // was an issue if we listen on onFocus and user click on the text of the textarea with Firefox
                (document.activeElement as HTMLInputElement)?.select();
              }
            },
            onChange: handleChangeSearchValue,
            onMouseDown() {
              if (options.length === 0) {
                return;
              }
              /**
               * There is a already selection
               * and the only element available is the selection,
               * no need to display the dropdown.
               */
              // if (options.length === 1 && options[0].value === selection?.value) {
              //   return;
              // }
              setIsOpen((isOpen) => !isOpen);
            },
            onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
              if (e.key === "Enter" && activeIndex != null) {
                handleSelect(activeIndex);
              }
            },
          })}
          {...rest}
        />
        <div className="flex-center relative">
          {suffix}
          {showClearSearchButton && (
            <Button
              size="input"
              type="button"
              withRipple={false}
              icon
              color="gray"
              variant="text"
              onClick={() => {
                setIsOpen(false);
                onChangeSelectionStable(null);
                setActiveIndex(null);
                onChangeSearchValueStable("", true);
              }}
            >
              <i className="fe-cancel"></i>
            </Button>
          )}
          {icon === false && loading && <Loader size="medium" color="gray" />}
          {!selection && searchValue === "" && noSearchSuffix}
        </div>
      </div>
      <FloatingPortal>
        <AutocompleteContext.Provider value={autocompleteContext}>
          {isOpen && (
            <FloatingFocusManager
              disabled={selectOnFocus}
              context={context}
              initialFocus={-1}
              visuallyHiddenDismiss
            >
              <div
                className="z-dialog outline-hidden"
                ref={refs.setFloating}
                style={floatingStyles as CSSProperties}
                {...getFloatingProps()}
              >
                <Dialog
                  placement={context.placement}
                  className="motion-safe:animate-fade-in-list overflow-auto"
                >
                  <FloatingList elementsRef={listRef}>
                    {options.map((option) => {
                      return <OptionComponent {...option} key={getOptionValue(option)} />;
                    })}
                  </FloatingList>
                </Dialog>
              </div>
            </FloatingFocusManager>
          )}
        </AutocompleteContext.Provider>
      </FloatingPortal>
    </div>
  );
}
