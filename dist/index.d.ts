import * as react from 'react';
import react__default, { Ref, ReactElement, ReactNode, ComponentPropsWithRef, ComponentProps, RefObject, HTMLProps, ButtonHTMLAttributes, ElementType, ComponentPropsWithoutRef, Dispatch, SetStateAction, MutableRefObject, useEffect } from 'react';
import { Geometry, BBox } from 'geojson';
import * as _floating_ui_react from '@floating-ui/react';
import { Placement, useInteractions } from '@floating-ui/react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _floating_ui_react_dom from '@floating-ui/react-dom';
import { ItemInterface, ReactSortableProps } from 'react-sortablejs';
import * as tailwindcss_types_config from 'tailwindcss/types/config';

type ThemeColor = "yellow" | "gray" | "red" | "orange" | "green" | "blue";

type MessageOptions = Partial<Omit<Message, "content" | "id">>;

interface Message {
  id: string;
  content: string;
  expiration: number; // in ms. if -1 never expire
  color: ThemeColor;
  canClose: boolean;
  withLoader: boolean;
}

type OptionLike = Option | GeoOption;

type Option = {
  type?: "Option";
  value: string | number;
  label: string;
};

type NoDataOption = {
  id: string;
  type: "nodata";
};

/** For compatibility with OptionLike. get original types from pentatrion-geo */
type GeoOption<G extends Geometry | null = Geometry, T extends string = string> = {
  id: string;
  type: "Feature";
  properties: FeatureProperties<T>;
  geometry: G;
  bbox?: BBox | undefined;
};

type FeatureProperties<T extends string = string> = {
  id: string;

  /** computed name + short context for input string */
  label: string;
  name: string;
  context: string | null;
  score: number;
  type: T;
  originalProperties?: any;
};

type Props$F<O extends Option> = O;
declare function SelectOption<O extends Option>({ label }: Props$F<O>): react_jsx_runtime.JSX.Element;

type SelectSelectionProps<O extends Option> = O & {
    multiple?: boolean;
};
declare function SelectSelection<O extends Option>({ label, multiple, }: SelectSelectionProps<O>): react_jsx_runtime.JSX.Element;

type SelectValue = number | string | null;
type ChangeEventLike = {
    target: {
        value: SelectValue;
    };
};
type Props$E<O extends Option = Option> = {
    disabled?: boolean;
    variant?: "normal" | "ghost";
    showArrow?: boolean;
    selectionClassName?: string;
    width?: number | string;
    floatingMinWidth?: number;
    placement?: Placement;
    options: O[];
    placeholder?: string;
    getSearchableValue?: (matchReg: RegExp, option: O) => string;
    searchable?: boolean;
    required?: boolean;
    selectOptionComponent?: (props: O) => ReactNode;
    selectSelectionComponent?: (props: SelectSelectionProps<O>) => ReactNode;
    value?: SelectValue;
    onChange: ((e: ChangeEventLike) => void) | null;
    zIndex?: number;
};
declare const Select: <O extends Option>(p: Props$E<O> & {
    ref?: Ref<HTMLDivElement>;
}) => ReactElement;

interface SelectContext {
    activeIndex: number | null;
    selectedIndex: number | null;
    getItemProps: ReturnType<typeof useInteractions>["getItemProps"];
    handleSelect: (index: number | null) => void;
}
declare const SelectContext: react.Context<SelectContext | null>;
declare function useSelect(): SelectContext;

type AutocompleteOptionProps<O extends OptionLike> = O;
declare function AutocompleteOption<O extends OptionLike>(props: AutocompleteOptionProps<O>): react_jsx_runtime.JSX.Element;
declare const _default$1: react.MemoExoticComponent<typeof AutocompleteOption>;

interface AutocompleteProps<O extends OptionLike = Option> {
    className?: string;
    icon?: boolean | ReactNode;
    color?: ThemeColor;
    /**
     * render suffix only if selection
     * ex: add contextuel buttons associated to selection
     */
    selectionSuffix?: ReactNode;
    /**
     * render suffix only if selection and searchValue is empty
     */
    noSearchSuffix?: ReactNode;
    placement?: Placement;
    placeholder?: string;
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
}
declare const _default: <O extends OptionLike = Option>(props: AutocompleteProps<O> & react.RefAttributes<HTMLInputElement>) => React.ReactElement | null;

interface Props$D<O extends OptionLike = Option> extends Pick<AutocompleteProps<O>, "className" | "icon" | "color" | "placement" | "placeholder" | "selection" | "onChangeSelection" | "autocompleteOptionComponent" | "options" | "selection"> {
}
declare function SimpleAutocomplete<O extends OptionLike = Option>({ options, selection, onChangeSelection, ...rest }: Props$D<O>): react_jsx_runtime.JSX.Element;

interface Props$C<O extends OptionLike = Option> extends Pick<AutocompleteProps<O>, "className" | "icon" | "color" | "selectionSuffix" | "noSearchSuffix" | "placement" | "placeholder" | "selection" | "onChangeSelection" | "autocompleteOptionComponent" | "loading" | "clearSearchButton"> {
    onChangeSearchValueCallback: (searchValue: string) => Promise<O[]>;
    debounce?: number;
}
declare function LazyAutocomplete<O extends OptionLike = Option>({ onChangeSearchValueCallback, debounce, selection, onChangeSelection, ...rest }: Props$C<O>): react_jsx_runtime.JSX.Element;

interface AutocompleteContext {
    activeIndex: number | null;
    selection: OptionLike | null;
    getItemProps: ReturnType<typeof useInteractions>["getItemProps"];
    handleSelect: (index: number | null) => void;
}
declare const AutocompleteContext: react.Context<AutocompleteContext | null>;
declare function useAutocomplete(): AutocompleteContext;

declare function getOptionLabel(option: OptionLike): string;
declare function getOptionValue(option: OptionLike): string | number;

interface Props$B {
    children: ReactNode;
    className?: string;
    tooltip?: string;
    url?: string;
    color?: ThemeColor;
    onClick?: () => void;
    onRemove?: () => void;
}
declare function Badge({ children, className, onRemove, onClick, tooltip, url, color, }: Props$B): react_jsx_runtime.JSX.Element;

interface ButtonProps extends ComponentPropsWithRef<"button"> {
    withRipple?: boolean;
    variant?: "contained" | "light" | "outlined" | "text" | "ghost";
    size?: "small" | "medium" | "large" | "custom";
    color?: ThemeColor;
    children?: React.ReactNode;
    /**
     * undefined: hidden
     * false: invisible
     * true: visible
     */
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    focusable?: boolean;
    /**
     * For a selected item inside a group.
     */
    selected?: boolean;
    icon?: boolean;
}
declare const buttonVariants: {
    size(icon: boolean, size: "small" | "medium" | "large" | "custom"): string | false;
    variant: {
        contained(color: ThemeColor): string;
        light(color: ThemeColor): string;
        outlined(color: ThemeColor): string;
        text(color: ThemeColor): string;
        ghost(color: ThemeColor): string;
    };
};
declare const Button: (props: ButtonProps & react.RefAttributes<HTMLButtonElement>) => React.ReactElement | null;

interface Props$A extends ComponentProps<"div"> {
    children: ReactNode;
    direction?: "horizontal" | "vertical";
}
declare function ButtonGroup({ children, className, direction }: Props$A): react_jsx_runtime.JSX.Element;

interface LinkButtonProps extends ComponentPropsWithRef<"a"> {
    href: string;
    withRipple?: boolean;
    variant?: "contained" | "light" | "outlined" | "text" | "ghost";
    size?: "small" | "medium" | "large" | "custom";
    color?: ThemeColor;
    children?: React.ReactNode;
    fullWidth?: boolean;
    focusable?: boolean;
    /**
     * For a selected item inside a group.
     */
    selected?: boolean;
    icon?: boolean;
}
declare const LinkButton: (props: LinkButtonProps & react.RefAttributes<HTMLAnchorElement>) => React.ReactElement | null;

declare const cardConfig: {
    item: string;
    group: string;
};

interface Props$z {
    children: ReactNode;
    className?: string;
}
declare function Code({ children, className }: Props$z): react_jsx_runtime.JSX.Element;

interface Props$y extends ComponentPropsWithRef<"div"> {
    targetRef?: RefObject<HTMLElement>;
    children: ReactElement[] | ReactElement;
    eventName?: "contextmenu" | string;
    debounceOpenning?: number;
}
declare function ContextMenu({ targetRef, children, style, eventName }: Props$y): react_jsx_runtime.JSX.Element;

type ContextMenuItemMouseEvent = react__default.MouseEvent<HTMLButtonElement> | MouseEvent | CustomEvent | null;
interface ContextMenuItemProps extends Omit<ComponentPropsWithRef<"button">, "onClick"> {
    label: string;
    disabled?: boolean;
    icon?: ReactNode;
    onClick?: (e: ContextMenuItemMouseEvent) => void;
}
declare const ContextMenuItem: (props: ContextMenuItemProps & react__default.RefAttributes<HTMLButtonElement>) => react__default.ReactElement | null;

interface Props$x extends ComponentProps<"div"> {
    color?: ThemeColor;
    placement?: Placement;
    children: ReactNode;
}
declare const dialogVariants: {
    color(color?: ThemeColor): string;
};
declare function Dialog({ placement, color, children, className, ...rest }: Props$x): react_jsx_runtime.JSX.Element;

interface DropdownMenuOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpen?: (open: boolean) => void;
  color?: ThemeColor | "default";
  modal?: boolean;
}

interface Props$w extends DropdownMenuOptions {
    children: ReactNode;
}
declare function DropdownMenu({ children, ...options }: Props$w): react_jsx_runtime.JSX.Element;

declare const DropdownMenuContent: (props: react.ClassAttributes<HTMLDivElement> & react.HTMLAttributes<HTMLDivElement> & react.RefAttributes<HTMLDivElement>) => React.ReactElement | null;

interface Props$v extends HTMLProps<HTMLElement> {
    asChild?: boolean;
}
declare const DropdownMenuTrigger: (props: Props$v & react.RefAttributes<HTMLElement>) => React.ReactElement | null;

declare function useDropdownMenu({ initialOpen, placement, open: controlledOpen, onOpen: setControlledOpen, color, modal, }: DropdownMenuOptions): {
    elementsRef: react.MutableRefObject<(HTMLElement | null)[]>;
    labelsRef: react.MutableRefObject<(string | null)[]>;
    color: "default" | ThemeColor;
    modal: boolean;
    activeIndex: number | null;
    handleSelect: () => void;
    placement: _floating_ui_react.Placement;
    strategy: _floating_ui_react.Strategy;
    middlewareData: _floating_ui_react.MiddlewareData;
    x: number;
    y: number;
    isPositioned: boolean;
    update: () => void;
    floatingStyles: react.CSSProperties;
    refs: {
        reference: react.MutableRefObject<_floating_ui_react_dom.ReferenceType | null>;
        floating: react.MutableRefObject<HTMLElement | null>;
        setReference: (node: _floating_ui_react_dom.ReferenceType | null) => void;
        setFloating: (node: HTMLElement | null) => void;
    } & _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
    elements: {
        reference: _floating_ui_react_dom.ReferenceType | null;
        floating: HTMLElement | null;
    } & _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    context: {
        x: number;
        y: number;
        placement: _floating_ui_react.Placement;
        strategy: _floating_ui_react.Strategy;
        middlewareData: _floating_ui_react.MiddlewareData;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: react.CSSProperties;
        open: boolean;
        onOpenChange: (open: boolean, event?: Event, reason?: _floating_ui_react.OpenChangeReason) => void;
        events: _floating_ui_react.FloatingEvents;
        dataRef: react.MutableRefObject<_floating_ui_react.ContextData>;
        nodeId: string | undefined;
        floatingId: string;
        refs: _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
        elements: _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    };
    getReferenceProps: (userProps?: react.HTMLProps<Element>) => Record<string, unknown>;
    getFloatingProps: (userProps?: react.HTMLProps<HTMLElement>) => Record<string, unknown>;
    getItemProps: (userProps?: Omit<react.HTMLProps<HTMLElement>, "selected" | "active"> & {
        active?: boolean;
        selected?: boolean;
    }) => Record<string, unknown>;
    open: boolean;
    setOpen: (open: boolean) => void;
};

type ContextType$3 = ReturnType<typeof useDropdownMenu> | null;
declare const DropdownMenuContext: react.Context<ContextType$3>;
declare function useDropdownMenuContext(): {
    elementsRef: react.MutableRefObject<(HTMLElement | null)[]>;
    labelsRef: react.MutableRefObject<(string | null)[]>;
    color: "default" | ThemeColor;
    modal: boolean;
    activeIndex: number | null;
    handleSelect: () => void;
    placement: _floating_ui_react_dom.Placement;
    strategy: _floating_ui_react_dom.Strategy;
    middlewareData: _floating_ui_react_dom.MiddlewareData;
    x: number;
    y: number;
    isPositioned: boolean;
    update: () => void;
    floatingStyles: react.CSSProperties;
    refs: {
        reference: react.MutableRefObject<_floating_ui_react_dom.ReferenceType | null>;
        floating: react.MutableRefObject<HTMLElement | null>;
        setReference: (node: _floating_ui_react_dom.ReferenceType | null) => void;
        setFloating: (node: HTMLElement | null) => void;
    } & _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
    elements: {
        reference: _floating_ui_react_dom.ReferenceType | null;
        floating: HTMLElement | null;
    } & _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    context: {
        x: number;
        y: number;
        placement: _floating_ui_react_dom.Placement;
        strategy: _floating_ui_react_dom.Strategy;
        middlewareData: _floating_ui_react_dom.MiddlewareData;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: react.CSSProperties;
        open: boolean;
        onOpenChange: (open: boolean, event?: Event, reason?: _floating_ui_react.OpenChangeReason) => void;
        events: _floating_ui_react.FloatingEvents;
        dataRef: react.MutableRefObject<_floating_ui_react.ContextData>;
        nodeId: string | undefined;
        floatingId: string;
        refs: _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
        elements: _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    };
    getReferenceProps: (userProps?: react.HTMLProps<Element>) => Record<string, unknown>;
    getFloatingProps: (userProps?: react.HTMLProps<HTMLElement>) => Record<string, unknown>;
    getItemProps: (userProps?: Omit<react.HTMLProps<HTMLElement>, "selected" | "active"> & {
        active?: boolean;
        selected?: boolean;
    }) => Record<string, unknown>;
    open: boolean;
    setOpen: (open: boolean) => void;
};

interface Props$u extends ComponentProps<"button"> {
    children: ReactNode;
}
declare function DropdownMenuItem({ children, onClick, ...rest }: Props$u): react_jsx_runtime.JSX.Element;

interface Props$t extends ButtonProps {
    label: string;
    triggerComponent: typeof Button;
}
declare const DropdownMenuNested: (props: Props$t & react.RefAttributes<HTMLButtonElement>) => React.ReactElement | null;

interface Props$s {
    label: string;
    disabled?: boolean;
}
declare const MenuItem: (props: Props$s & ButtonHTMLAttributes<HTMLButtonElement> & react.RefAttributes<HTMLButtonElement>) => React.ReactElement | null;

interface Props$r extends ButtonProps {
    label?: string;
    triggerComponent?: typeof Button;
}
declare const MenuItemWithChildren: (props: Props$r & react.RefAttributes<HTMLButtonElement>) => React.ReactElement | null;

interface Props$q {
    color?: ThemeColor;
    children?: ReactNode;
    className?: string;
}
declare function Flash({ color, children, className }: Props$q): react_jsx_runtime.JSX.Element;

interface Props$p {
    value: string | undefined;
    indices: readonly [number, number][];
    minLength?: number;
}
declare function Highlight({ value, indices, minLength }: Props$p): string | react_jsx_runtime.JSX.Element | undefined;

interface Props$o extends ComponentPropsWithRef<"a"> {
    children: ReactNode;
    ghost?: boolean;
}
declare const Href: (props: Props$o & react.RefAttributes<HTMLAnchorElement>) => React.ReactElement | null;

interface InputProps extends Omit<ComponentPropsWithRef<"input">, "prefix"> {
    variant?: "normal" | "ghost";
    disabled?: boolean;
    prefix?: ReactNode;
    suffix?: ReactNode;
    color?: ThemeColor;
}
declare const inputConfig: {
    container: string;
    input: string;
};
declare const Input: (props: InputProps & react.RefAttributes<HTMLInputElement>) => React.ReactElement | null;

interface CheckboxProps extends ComponentPropsWithRef<"input"> {
    indeterminate?: boolean;
    disabled?: boolean;
    color?: ThemeColor;
}
declare const Checkbox: (props: CheckboxProps & react.RefAttributes<HTMLInputElement>) => React.ReactElement | null;

interface RadioProps extends ComponentPropsWithRef<"input"> {
    disabled?: boolean;
    color?: ThemeColor;
}
declare const Radio: (props: RadioProps & react.RefAttributes<HTMLInputElement>) => React.ReactElement | null;
interface Props$n {
    value: string | null;
    options: {
        label: string;
        value: string;
    }[];
    onChange?: (newValue: string | null) => void;
    disabled?: boolean;
    placement?: "inline" | "inline-grid" | "block";
    className?: string;
    color?: ThemeColor;
}
declare function RadioGroup({ value, options, onChange, placement, disabled, className, color, }: Props$n): react_jsx_runtime.JSX.Element;

interface ToggleProps extends ComponentPropsWithRef<"input"> {
    disabled?: boolean;
    color?: ThemeColor;
}
declare const Toggle: (props: ToggleProps & react.RefAttributes<HTMLInputElement>) => React.ReactElement | null;

interface RangeProps extends Omit<ComponentPropsWithRef<"input">, "value" | "min" | "max" | "step"> {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    showMinMax?: boolean;
    showValue?: boolean;
    ticks?: boolean;
    valuesByTick?: number;
    color?: ThemeColor;
    formatter?: (str: number) => string;
}
declare const Range: (props: RangeProps & react.RefAttributes<HTMLInputElement>) => React.ReactElement | null;

interface ColorProps extends ComponentProps<"button"> {
    withRipple?: boolean;
    value?: string;
    color?: ThemeColor;
    label?: string;
    showValue?: boolean;
    className?: string;
}
declare const Color: (props: ColorProps & react.RefAttributes<HTMLButtonElement>) => React.ReactElement | null;

type Merge<T, U> = Omit<T, keyof U> & U;
type PropsWithAs<P, T extends React.ElementType> = P & { as?: T };
type PolymorphicPropsWithRef<P, T extends React.ElementType> = Merge<
  T extends keyof JSX.IntrinsicElements
    ? React.PropsWithRef<JSX.IntrinsicElements[T]>
    : React.ComponentPropsWithRef<T>,
  PropsWithAs<P, T>
>;

declare global {
  interface GlobalEventHandlersEventMap {
    "contextmenu-custom": CustomEvent;
  }
}

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

interface InputFieldOwnProps {
    label?: ReactNode;
    hint?: ReactNode;
    help?: ReactNode;
    error?: ReactNode | boolean;
    warning?: ReactNode | boolean;
}
declare const defaultElement: (props: InputProps & react.RefAttributes<HTMLInputElement>) => React.ReactElement | null;
type Props$m<E extends ElementType> = PolymorphicPropsWithRef<InputFieldOwnProps, E>;
declare const InputField: <E extends ElementType = typeof defaultElement>(props: Props$m<E>) => ReactNode;

interface Props$l extends ComponentPropsWithoutRef<"svg"> {
    size?: "small" | "medium" | "large";
    color?: ThemeColor;
}
declare function Loader({ size, color, className, ...rest }: Props$l): react_jsx_runtime.JSX.Element;

interface ModalOptions {
  initialOpen?: boolean;
  open?: boolean;
  onOpen?: (open: boolean) => void;
  color?: ThemeColor | "default";
}

interface Props$k extends ModalOptions {
    children?: ReactNode;
}
declare function Modal({ children, ...options }: Props$k): react_jsx_runtime.JSX.Element;

declare const ModalContent: (props: react.ClassAttributes<HTMLDivElement> & react.HTMLAttributes<HTMLDivElement> & react.RefAttributes<HTMLDivElement>) => React.ReactElement | null;

interface Props$j extends HTMLProps<HTMLElement> {
    asChild?: boolean;
}
declare const ModalTrigger: (props: Props$j & react.RefAttributes<HTMLElement>) => React.ReactElement | null;

declare function useModal({ initialOpen, open: controlledOpen, onOpen: setControlledOpen, color, }?: ModalOptions): {
    color: "default" | ThemeColor;
    labelId: string | undefined;
    descriptionId: string | undefined;
    setLabelId: Dispatch<SetStateAction<string | undefined>>;
    setDescriptionId: Dispatch<SetStateAction<string | undefined>>;
    placement: _floating_ui_react.Placement;
    strategy: _floating_ui_react.Strategy;
    middlewareData: _floating_ui_react.MiddlewareData;
    x: number;
    y: number;
    isPositioned: boolean;
    update: () => void;
    floatingStyles: react.CSSProperties;
    refs: {
        reference: react.MutableRefObject<_floating_ui_react_dom.ReferenceType | null>;
        floating: react.MutableRefObject<HTMLElement | null>;
        setReference: (node: _floating_ui_react_dom.ReferenceType | null) => void;
        setFloating: (node: HTMLElement | null) => void;
    } & _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
    elements: {
        reference: _floating_ui_react_dom.ReferenceType | null;
        floating: HTMLElement | null;
    } & _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    context: {
        x: number;
        y: number;
        placement: _floating_ui_react.Placement;
        strategy: _floating_ui_react.Strategy;
        middlewareData: _floating_ui_react.MiddlewareData;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: react.CSSProperties;
        open: boolean;
        onOpenChange: (open: boolean, event?: Event, reason?: _floating_ui_react.OpenChangeReason) => void;
        events: _floating_ui_react.FloatingEvents;
        dataRef: react.MutableRefObject<_floating_ui_react.ContextData>;
        nodeId: string | undefined;
        floatingId: string;
        refs: _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
        elements: _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    };
    getReferenceProps: (userProps?: react.HTMLProps<Element>) => Record<string, unknown>;
    getFloatingProps: (userProps?: react.HTMLProps<HTMLElement>) => Record<string, unknown>;
    getItemProps: (userProps?: Omit<react.HTMLProps<HTMLElement>, "selected" | "active"> & {
        active?: boolean;
        selected?: boolean;
    }) => Record<string, unknown>;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

type ContextType$2 = ReturnType<typeof useModal> | null;
declare const ModalContext: react.Context<ContextType$2>;
declare function useModalContext(): {
    color: "default" | ThemeColor;
    labelId: string | undefined;
    descriptionId: string | undefined;
    setLabelId: react.Dispatch<react.SetStateAction<string | undefined>>;
    setDescriptionId: react.Dispatch<react.SetStateAction<string | undefined>>;
    placement: _floating_ui_react_dom.Placement;
    strategy: _floating_ui_react_dom.Strategy;
    middlewareData: _floating_ui_react_dom.MiddlewareData;
    x: number;
    y: number;
    isPositioned: boolean;
    update: () => void;
    floatingStyles: react.CSSProperties;
    refs: {
        reference: react.MutableRefObject<_floating_ui_react_dom.ReferenceType | null>;
        floating: react.MutableRefObject<HTMLElement | null>;
        setReference: (node: _floating_ui_react_dom.ReferenceType | null) => void;
        setFloating: (node: HTMLElement | null) => void;
    } & _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
    elements: {
        reference: _floating_ui_react_dom.ReferenceType | null;
        floating: HTMLElement | null;
    } & _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    context: {
        x: number;
        y: number;
        placement: _floating_ui_react_dom.Placement;
        strategy: _floating_ui_react_dom.Strategy;
        middlewareData: _floating_ui_react_dom.MiddlewareData;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: react.CSSProperties;
        open: boolean;
        onOpenChange: (open: boolean, event?: Event, reason?: _floating_ui_react.OpenChangeReason) => void;
        events: _floating_ui_react.FloatingEvents;
        dataRef: react.MutableRefObject<_floating_ui_react.ContextData>;
        nodeId: string | undefined;
        floatingId: string;
        refs: _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
        elements: _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    };
    getReferenceProps: (userProps?: react.HTMLProps<Element>) => Record<string, unknown>;
    getFloatingProps: (userProps?: react.HTMLProps<HTMLElement>) => Record<string, unknown>;
    getItemProps: (userProps?: Omit<react.HTMLProps<HTMLElement>, "selected" | "active"> & {
        active?: boolean;
        selected?: boolean;
    }) => Record<string, unknown>;
    open: boolean;
    setOpen: react.Dispatch<react.SetStateAction<boolean>>;
};

interface ModalHeaderProps extends ComponentProps<"h2"> {
    closeButton?: boolean;
}
declare function ModalHeader({ children, className, closeButton, ...props }: ModalHeaderProps): react_jsx_runtime.JSX.Element;
interface ModalDescriptionProps extends ComponentProps<"div"> {
    height?: number;
}
declare function ModalDescription({ children, className, height, ...props }: ModalDescriptionProps): react_jsx_runtime.JSX.Element;
declare function ModalFooter({ children, className, ...props }: ComponentProps<"footer">): react_jsx_runtime.JSX.Element;

interface Props$i {
    children: ReactNode;
}
declare function NotificationsProvider({ children }: Props$i): react_jsx_runtime.JSX.Element;

declare function createNotificationsManager(setNotifications: Dispatch<SetStateAction<Message[]>>): {
    addNotification: (content?: string, { expiration, color, canClose, withLoader, }?: MessageOptions) => string;
    removeNotification: (id: string) => void;
    notifyError: (err: unknown) => void;
};
declare const NotificationsContext: react.Context<{
    addNotification: (content?: string, { expiration, color, canClose, withLoader, }?: MessageOptions) => string;
    removeNotification: (id: string) => void;
    notifyError: (err: unknown) => void;
}>;

declare const useContextNotifications: () => {
    addNotification: (content?: string, { expiration, color, canClose, withLoader, }?: MessageOptions) => string;
    removeNotification: (id: string) => void;
    notifyError: (err: unknown) => void;
};

declare function arrayEquals(a: any, b: any): boolean;

declare function isErrorLike(err: any): err is Error;
declare function parseError(err: any): [string, MessageOptions] | null;

type CustomFetchOptions = Omit<RequestInit, "body"> & {
    body?: BodyInit | {
        [key: string]: unknown;
    };
    urlParams?: {
        [key: string]: string | number;
    };
    query?: {
        [key: string]: unknown;
    };
};
declare function fetchAPI(urlObjOrString: string | URL, enhancedOptions?: CustomFetchOptions, baseUrl?: string, baseOptions?: RequestInit): Promise<any>;
declare class FetchError extends Error {
    status: number;
    data?: unknown | undefined;
    constructor(message: string, status: number, data?: unknown | undefined);
}

type Variant = {
    border: string;
    text: string;
};
declare const colorVariants: {
    [key in ThemeColor]: Variant;
};

declare const useFetch: () => (urlObjOrString: string | URL, enhancedOptions?: CustomFetchOptions) => Promise<any>;

interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpen?: (open: boolean) => void;
  color?: ThemeColor;
  modal?: boolean;
}

interface Props$h extends PopoverOptions {
    children: ReactNode;
}
declare function Popover({ children, ...options }: Props$h): react_jsx_runtime.JSX.Element;

declare const PopoverContent: (props: react.ClassAttributes<HTMLDivElement> & react.HTMLAttributes<HTMLDivElement> & react.RefAttributes<HTMLDivElement>) => React.ReactElement | null;

interface Props$g extends HTMLProps<HTMLElement> {
    asChild?: boolean;
}
declare const PopoverTrigger: (props: Props$g & react.RefAttributes<HTMLElement>) => React.ReactElement | null;

declare function usePopover({ initialOpen, placement, open: controlledOpen, onOpen: setControlledOpen, color, modal, }: PopoverOptions): {
    arrowRef: react.RefObject<HTMLDivElement>;
    color: ThemeColor | undefined;
    modal: boolean;
    labelId: string | undefined;
    descriptionId: string | undefined;
    setLabelId: react.Dispatch<react.SetStateAction<string | undefined>>;
    setDescriptionId: react.Dispatch<react.SetStateAction<string | undefined>>;
    placement: _floating_ui_react.Placement;
    strategy: _floating_ui_react.Strategy;
    middlewareData: _floating_ui_react.MiddlewareData;
    x: number;
    y: number;
    isPositioned: boolean;
    update: () => void;
    floatingStyles: react.CSSProperties;
    refs: {
        reference: react.MutableRefObject<_floating_ui_react_dom.ReferenceType | null>;
        floating: react.MutableRefObject<HTMLElement | null>;
        setReference: (node: _floating_ui_react_dom.ReferenceType | null) => void;
        setFloating: (node: HTMLElement | null) => void;
    } & _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
    elements: {
        reference: _floating_ui_react_dom.ReferenceType | null;
        floating: HTMLElement | null;
    } & _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    context: {
        x: number;
        y: number;
        placement: _floating_ui_react.Placement;
        strategy: _floating_ui_react.Strategy;
        middlewareData: _floating_ui_react.MiddlewareData;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: react.CSSProperties;
        open: boolean;
        onOpenChange: (open: boolean, event?: Event, reason?: _floating_ui_react.OpenChangeReason) => void;
        events: _floating_ui_react.FloatingEvents;
        dataRef: react.MutableRefObject<_floating_ui_react.ContextData>;
        nodeId: string | undefined;
        floatingId: string;
        refs: _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
        elements: _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    };
    getReferenceProps: (userProps?: react.HTMLProps<Element>) => Record<string, unknown>;
    getFloatingProps: (userProps?: react.HTMLProps<HTMLElement>) => Record<string, unknown>;
    getItemProps: (userProps?: Omit<react.HTMLProps<HTMLElement>, "selected" | "active"> & {
        active?: boolean;
        selected?: boolean;
    }) => Record<string, unknown>;
    open: boolean;
    setOpen: (open: boolean) => void;
};

type ContextType$1 = ReturnType<typeof usePopover> | null;
declare const PopoverContext: react.Context<ContextType$1>;
declare function usePopoverContext(): {
    arrowRef: react.RefObject<HTMLDivElement>;
    color: ThemeColor | undefined;
    modal: boolean;
    labelId: string | undefined;
    descriptionId: string | undefined;
    setLabelId: react.Dispatch<react.SetStateAction<string | undefined>>;
    setDescriptionId: react.Dispatch<react.SetStateAction<string | undefined>>;
    placement: _floating_ui_react_dom.Placement;
    strategy: _floating_ui_react_dom.Strategy;
    middlewareData: _floating_ui_react_dom.MiddlewareData;
    x: number;
    y: number;
    isPositioned: boolean;
    update: () => void;
    floatingStyles: react.CSSProperties;
    refs: {
        reference: react.MutableRefObject<_floating_ui_react_dom.ReferenceType | null>;
        floating: react.MutableRefObject<HTMLElement | null>;
        setReference: (node: _floating_ui_react_dom.ReferenceType | null) => void;
        setFloating: (node: HTMLElement | null) => void;
    } & _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
    elements: {
        reference: _floating_ui_react_dom.ReferenceType | null;
        floating: HTMLElement | null;
    } & _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    context: {
        x: number;
        y: number;
        placement: _floating_ui_react_dom.Placement;
        strategy: _floating_ui_react_dom.Strategy;
        middlewareData: _floating_ui_react_dom.MiddlewareData;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: react.CSSProperties;
        open: boolean;
        onOpenChange: (open: boolean, event?: Event, reason?: _floating_ui_react.OpenChangeReason) => void;
        events: _floating_ui_react.FloatingEvents;
        dataRef: react.MutableRefObject<_floating_ui_react.ContextData>;
        nodeId: string | undefined;
        floatingId: string;
        refs: _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
        elements: _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    };
    getReferenceProps: (userProps?: react.HTMLProps<Element>) => Record<string, unknown>;
    getFloatingProps: (userProps?: react.HTMLProps<HTMLElement>) => Record<string, unknown>;
    getItemProps: (userProps?: Omit<react.HTMLProps<HTMLElement>, "selected" | "active"> & {
        active?: boolean;
        selected?: boolean;
    }) => Record<string, unknown>;
    open: boolean;
    setOpen: (open: boolean) => void;
};

interface PopoverHeaderProps extends ComponentProps<"h2"> {
    closeButton?: boolean;
}
declare function PopoverHeader({ children, closeButton, className, ...props }: PopoverHeaderProps): react_jsx_runtime.JSX.Element;
declare function PopoverDescription({ children, className, ...props }: ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function PopoverFooter({ children, className, ...props }: ComponentProps<"footer">): react_jsx_runtime.JSX.Element;

interface Props$f {
    children: ReactNode;
}
declare const Portal: ({ children }: Props$f) => react.ReactPortal;

interface Props$e extends ComponentProps<"div"> {
    name: string;
    position: "top" | "bottom" | "left" | "right";
    initialValue?: number;
}
declare function ResizeArea({ name, position, initialValue, className, ...rest }: Props$e): react_jsx_runtime.JSX.Element;

interface Props$d extends ComponentPropsWithoutRef<"div"> {
    horizontal?: boolean;
}
declare function Scroll({ horizontal, className, children, ...rest }: Props$d): react_jsx_runtime.JSX.Element;

type SnackProps = Partial<Message> & {
    onRemove?: () => void;
};
declare function Snack({ expiration, content, color, withLoader, canClose, onRemove, }: SnackProps): react_jsx_runtime.JSX.Element;

interface SortableItem<I> {
  /** The unique id associated with your item. It's recommended this is the same as the key prop for your list item. */
  id: string | number;
  /** When true, the item is selected using MultiDrag */
  selected?: boolean;
  /** When true, the item is deemed "chosen", which basically just a mousedown event. */
  chosen?: boolean;
  /** When true, it will not be possible to pick this item up in the list. */
  filtered?: boolean;

  data: I;
}

declare function Sortable<T extends ItemInterface>({ children, list, setList, ...rest }: ReactSortableProps<T>): react_jsx_runtime.JSX.Element;

interface Props$c extends ComponentPropsWithoutRef<"li"> {
    icon?: ReactNode;
    status?: "done" | "current" | "todo";
    /** choose center if content height is less than ll-circle height */
    align?: "start" | "center";
    markerClassName?: string;
    contentClassName?: string;
}
declare function Step({ status, className, children, markerClassName, contentClassName, align, icon, ...rest }: Props$c): react_jsx_runtime.JSX.Element;

interface Props$b extends ComponentPropsWithoutRef<"ul"> {
    direction?: "horizontal" | "vertical";
    lineStyle?: "solid" | "dashed" | "dotted";
    markerType?: "circle" | "bullet";
    /**
     * if your Step is multiline keep it false
     * better render and add line-space
     *
     * if your Steps are Sortable and eash Step si only one line
     * and steps are vertical
     * set it to true, line will not be animated when sorting
     */
    associateLineWithStep?: boolean;
}
declare function Steps({ direction, lineStyle, markerType, associateLineWithStep, className, ...rest }: Props$b): react_jsx_runtime.JSX.Element;

declare function getIndexLetter(index: number): string;

interface Props$a extends ComponentProps<"table"> {
    children: ReactNode;
}
declare function Table({ children, ...props }: Props$a): react_jsx_runtime.JSX.Element;

interface Props$9 {
    children: ReactNode;
}
declare function TableBody({ children, ...props }: Props$9): react_jsx_runtime.JSX.Element;

interface Props$8 extends ComponentProps<"td"> {
    children: ReactNode;
    label?: ReactNode | string;
}
declare function TableCell({ children, className, label, ...props }: Props$8): react_jsx_runtime.JSX.Element;

interface Props$7 extends ComponentProps<"thead"> {
    children: ReactNode;
}
declare function TableHeader({ children, className, ...props }: Props$7): react_jsx_runtime.JSX.Element;

interface Props$6 extends ComponentProps<"th"> {
    children: ReactNode;
}
declare function TableHeaderCell({ children, className, ...props }: Props$6): react_jsx_runtime.JSX.Element;

interface Props$5 extends ComponentProps<"tr"> {
    children: ReactNode;
}
declare function TableRow({ children, className, ...props }: Props$5): react_jsx_runtime.JSX.Element;

interface Props$4 extends ComponentProps<"tfoot"> {
    children: ReactNode;
}
declare function TableFooter({ children, ...props }: Props$4): react_jsx_runtime.JSX.Element;

interface Tab {
    id: string | number;
    title: ReactNode;
    content?: ReactNode;
}
interface Props$3 {
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
declare function Tabs({ className, listClassName, contentClassName, tabs, value, onChange, fullWidth, stickyTabs, children, }: Props$3): react_jsx_runtime.JSX.Element;

interface TextareaProps extends ComponentProps<"textarea"> {
    variant?: "normal" | "ghost";
    color?: ThemeColor;
}
declare const Textarea: (props: TextareaProps & react.RefAttributes<HTMLTextAreaElement>) => React.ReactElement | null;

interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpen?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  color?: ThemeColor;
  contentClassName?: string;
}

interface Props$2 extends TooltipOptions {
    children: ReactNode;
}
declare function Tooltip({ children, ...options }: Props$2): react_jsx_runtime.JSX.Element;

declare const TooltipContent: (props: react.ClassAttributes<HTMLDivElement> & react.HTMLAttributes<HTMLDivElement> & react.RefAttributes<HTMLDivElement>) => React.ReactElement | null;

interface Props$1 extends HTMLProps<HTMLElement> {
    asChild?: boolean;
}
declare const TooltipTrigger: (props: Props$1 & react.RefAttributes<HTMLElement>) => React.ReactElement | null;

declare function useTooltip({ initialOpen, placement, open: controlledOpen, onOpen: setControlledOpen, openDelay, closeDelay, color, }?: TooltipOptions): {
    arrowRef: react.RefObject<HTMLDivElement>;
    color: ThemeColor;
    placement: _floating_ui_react.Placement;
    strategy: _floating_ui_react.Strategy;
    middlewareData: _floating_ui_react.MiddlewareData;
    x: number;
    y: number;
    isPositioned: boolean;
    update: () => void;
    floatingStyles: react.CSSProperties;
    refs: {
        reference: react.MutableRefObject<_floating_ui_react_dom.ReferenceType | null>;
        floating: react.MutableRefObject<HTMLElement | null>;
        setReference: (node: _floating_ui_react_dom.ReferenceType | null) => void;
        setFloating: (node: HTMLElement | null) => void;
    } & _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
    elements: {
        reference: _floating_ui_react_dom.ReferenceType | null;
        floating: HTMLElement | null;
    } & _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    context: {
        x: number;
        y: number;
        placement: _floating_ui_react.Placement;
        strategy: _floating_ui_react.Strategy;
        middlewareData: _floating_ui_react.MiddlewareData;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: react.CSSProperties;
        open: boolean;
        onOpenChange: (open: boolean, event?: Event, reason?: _floating_ui_react.OpenChangeReason) => void;
        events: _floating_ui_react.FloatingEvents;
        dataRef: react.MutableRefObject<_floating_ui_react.ContextData>;
        nodeId: string | undefined;
        floatingId: string;
        refs: _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
        elements: _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    };
    getReferenceProps: (userProps?: react.HTMLProps<Element>) => Record<string, unknown>;
    getFloatingProps: (userProps?: react.HTMLProps<HTMLElement>) => Record<string, unknown>;
    getItemProps: (userProps?: Omit<react.HTMLProps<HTMLElement>, "selected" | "active"> & {
        active?: boolean;
        selected?: boolean;
    }) => Record<string, unknown>;
    open: boolean;
    setOpen: ((open: boolean) => void) | undefined;
};

type ContextType = ReturnType<typeof useTooltip> | null;
declare const TooltipContext: react.Context<ContextType>;
declare function useTooltipContext(): {
    arrowRef: react.RefObject<HTMLDivElement>;
    color: ThemeColor;
    placement: _floating_ui_react_dom.Placement;
    strategy: _floating_ui_react_dom.Strategy;
    middlewareData: _floating_ui_react_dom.MiddlewareData;
    x: number;
    y: number;
    isPositioned: boolean;
    update: () => void;
    floatingStyles: react.CSSProperties;
    refs: {
        reference: react.MutableRefObject<_floating_ui_react_dom.ReferenceType | null>;
        floating: react.MutableRefObject<HTMLElement | null>;
        setReference: (node: _floating_ui_react_dom.ReferenceType | null) => void;
        setFloating: (node: HTMLElement | null) => void;
    } & _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
    elements: {
        reference: _floating_ui_react_dom.ReferenceType | null;
        floating: HTMLElement | null;
    } & _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    context: {
        x: number;
        y: number;
        placement: _floating_ui_react_dom.Placement;
        strategy: _floating_ui_react_dom.Strategy;
        middlewareData: _floating_ui_react_dom.MiddlewareData;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: react.CSSProperties;
        open: boolean;
        onOpenChange: (open: boolean, event?: Event, reason?: _floating_ui_react.OpenChangeReason) => void;
        events: _floating_ui_react.FloatingEvents;
        dataRef: react.MutableRefObject<_floating_ui_react.ContextData>;
        nodeId: string | undefined;
        floatingId: string;
        refs: _floating_ui_react.ExtendedRefs<_floating_ui_react.ReferenceType>;
        elements: _floating_ui_react.ExtendedElements<_floating_ui_react.ReferenceType>;
    };
    getReferenceProps: (userProps?: react.HTMLProps<Element>) => Record<string, unknown>;
    getFloatingProps: (userProps?: react.HTMLProps<HTMLElement>) => Record<string, unknown>;
    getItemProps: (userProps?: Omit<react.HTMLProps<HTMLElement>, "selected" | "active"> & {
        active?: boolean;
        selected?: boolean;
    }) => Record<string, unknown>;
    open: boolean;
    setOpen: ((open: boolean) => void) | undefined;
};

interface Props extends TooltipOptions {
    children: ReactNode;
    content: ReactNode;
}
declare function SimpleTooltip({ content, children, contentClassName, ...options }: Props): react_jsx_runtime.JSX.Element;

/**
 * This hook accepts a ref to any element and adds a click event handler that creates ripples when click
 */
declare const useRipple: <T extends HTMLElement>(ref: react__default.RefObject<T>) => react_jsx_runtime.JSX.Element[];

declare const useIsMounted: () => () => boolean;

declare const useCombinedRefs: <T extends unknown>(...refs: (Ref<T> | undefined)[]) => Ref<T>;

declare function useIsClosing(initialValue?: boolean, delay?: number): {
    isOpen: boolean;
    isClosing: boolean;
    setIsOpen: (newState: boolean) => void;
};

declare function usePrevious<T>(value: T): T | undefined;

declare function useEventCallback<Args extends unknown[], R>(callback: ((...args: Args) => R) | null): (...args: Args) => R | undefined;

declare function useDebounce<T>(value: T, delay?: number): [T, Dispatch<SetStateAction<T>>];
declare function useRefDebounce<T>(value: T, delay?: number): MutableRefObject<T>;
declare function useStateDebounce<T>(initialValue: T, delay?: number): [T, T, (initialValue: SetStateAction<T>, immediate?: boolean) => void];

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>;
declare function useCopyToClipboard(): [CopiedValue, CopyFn];

declare function useEventListener<K extends keyof MediaQueryListEventMap>(eventName: K, handler: (event: MediaQueryListEventMap[K]) => void, element: RefObject<MediaQueryList>, options?: boolean | AddEventListenerOptions): void;
declare function useEventListener<K extends keyof WindowEventMap>(eventName: K, handler: (event: WindowEventMap[K]) => void, element?: undefined, options?: boolean | AddEventListenerOptions): void;
declare function useEventListener<K extends keyof HTMLElementEventMap & keyof SVGElementEventMap, T extends Element = K extends keyof HTMLElementEventMap ? HTMLDivElement : SVGElement>(eventName: K, handler: ((event: HTMLElementEventMap[K]) => void) | ((event: SVGElementEventMap[K]) => void), element: RefObject<T>, options?: boolean | AddEventListenerOptions): void;
declare function useEventListener<K extends keyof DocumentEventMap>(eventName: K, handler: (event: DocumentEventMap[K]) => void, element: RefObject<Document>, options?: boolean | AddEventListenerOptions): void;

type EventType = "mousedown" | "mouseup" | "touchstart" | "touchend" | "focusin" | "focusout";
declare function useOnClickOutside<T extends HTMLElement = HTMLElement>(ref: RefObject<T> | RefObject<T>[], handler: (event: MouseEvent | TouchEvent | FocusEvent) => void, eventType?: EventType, eventListenerOptions?: AddEventListenerOptions): void;

declare const useIsomorphicLayoutEffect: typeof useEffect;

interface PentatrionTwOptions {
    vars?: boolean;
    base?: boolean;
    components?: boolean;
    componentsInputOutline?: boolean;
    componentsResizeArea?: boolean;
    componentsStep?: boolean;
    utilities?: boolean;
    utilitiesDialog?: boolean;
}
declare const pentatrionTw: {
    (options: PentatrionTwOptions): {
        handler: tailwindcss_types_config.PluginCreator;
        config?: Partial<tailwindcss_types_config.Config>;
    };
    __isOptionsFunction: true;
};

export { _default as Autocomplete, _default$1 as AutocompleteOption, type AutocompleteProps, Badge, Button, ButtonGroup, type ButtonProps, Checkbox, Code, Color, ContextMenu, ContextMenuItem, type ContextMenuItemMouseEvent, type CustomFetchOptions, Dialog, DropdownMenu, DropdownMenuContent, DropdownMenuContext, DropdownMenuItem, DropdownMenuNested, type DropdownMenuOptions, DropdownMenuTrigger, FetchError, Flash, Highlight, Href, Input, InputField, LazyAutocomplete, LinkButton, Loader, MenuItem, MenuItemWithChildren, Modal, ModalContent, ModalContext, ModalDescription, ModalFooter, ModalHeader, type ModalOptions, ModalTrigger, type NoDataOption, NotificationsContext, NotificationsProvider, type Option, type OptionLike, Popover, PopoverContent, PopoverContext, PopoverDescription, PopoverFooter, PopoverHeader, type PopoverOptions, PopoverTrigger, Portal, Radio, RadioGroup, Range, ResizeArea, Scroll, Select, SelectContext, SelectOption, SelectSelection, type SelectSelectionProps, SimpleAutocomplete, SimpleTooltip, Snack, Sortable, type SortableItem, Step, Steps, Table, TableBody, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow, Tabs, Textarea, type ThemeColor, Toggle, Tooltip, TooltipContent, TooltipContext, TooltipTrigger, arrayEquals, buttonVariants, cardConfig, colorVariants, createNotificationsManager, dialogVariants, fetchAPI, getIndexLetter, getOptionLabel, getOptionValue, inputConfig, isErrorLike, parseError, pentatrionTw, useAutocomplete, useCombinedRefs, useContextNotifications, useCopyToClipboard, useDebounce, useDropdownMenu, useDropdownMenuContext, useEventCallback, useEventListener, useFetch, useIsClosing, useIsMounted, useIsomorphicLayoutEffect, useModal, useModalContext, useOnClickOutside, usePopover, usePopoverContext, usePrevious, useRefDebounce, useRipple, useSelect, useStateDebounce, useTooltip, useTooltipContext };
