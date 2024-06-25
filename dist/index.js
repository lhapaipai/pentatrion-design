// components/autocomplete/Autocomplete.tsx
import {
  useCallback as useCallback7,
  useMemo,
  useRef as useRef9,
  useState as useState5,
  forwardRef as forwardRef4
} from "react";

// components/autocomplete/AutocompleteOption.tsx
import { memo, useId } from "react";
import { useListItem } from "@floating-ui/react";
import clsx from "clsx";

// components/autocomplete/util.ts
function getOptionLabel(option) {
  switch (option.type) {
    case "Feature":
      return option.properties.label;
    default:
      return option.label;
  }
}
function getOptionValue(option) {
  switch (option.type) {
    case "Feature":
      return option.properties.id;
    default:
      return option.value;
  }
}

// components/autocomplete/AutocompleteOption.tsx
import { jsx } from "react/jsx-runtime";
function AutocompleteOption(props) {
  const label = getOptionLabel(props);
  const id = useId();
  const { activeIndex, selection, getItemProps, handleSelect } = useAutocomplete();
  const { ref, index } = useListItem({ label });
  const isActive = activeIndex === index;
  const isSelected = selection ? getOptionValue(selection) === getOptionValue(props) : false;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx("option", isSelected ? "bg-gray-2" : isActive && "bg-gray-1"),
      ref,
      role: "option",
      id,
      "aria-selected": isActive,
      ...getItemProps({
        onClick: () => handleSelect(index)
      }),
      children: label
    }
  );
}
var AutocompleteOption_default = memo(AutocompleteOption);

// components/autocomplete/Autocomplete.tsx
import {
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole
} from "@floating-ui/react";

// components/autocomplete/useAutocompleteContext.ts
import { createContext, useContext } from "react";
var AutocompleteContext = createContext(null);
function useAutocomplete() {
  const context = useContext(AutocompleteContext);
  if (context === null) {
    throw new Error("Autocomplete components must be wrapped in <Autocomplete>");
  }
  return context;
}

// components/autocomplete/Autocomplete.tsx
import clsx8 from "clsx";

// hooks/useRipple.tsx
import { useEffect, useState } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var useRipple = (ref) => {
  const [ripples, setRipples] = useState([]);
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (ref.current) {
        const elem = ref.current;
        const rect = elem.getBoundingClientRect();
        const left = (e.clientX ?? 0) - rect.left;
        const top = (e.clientY ?? 0) - rect.top;
        const height = elem.clientHeight;
        const width = elem.clientWidth;
        const diameter = Math.max(width, height);
        setRipples((r) => [
          ...r,
          {
            top: top - diameter / 2,
            left: left - diameter / 2,
            height: Math.max(width, height),
            width: Math.max(width, height)
          }
        ]);
      }
    };
    if (ref.current) {
      const elem = ref.current;
      elem.addEventListener("pointerdown", handlePointerDown);
      return () => {
        elem.removeEventListener("pointerdown", handlePointerDown);
      };
    }
  }, [ref]);
  const [_debounced] = useDebounce(ripples, 1e3);
  useEffect(() => {
    if (_debounced.length) {
      setRipples([]);
    }
  }, [_debounced]);
  return ripples?.map((style, i) => {
    return /* @__PURE__ */ jsx2(
      "span",
      {
        "data-testid": "ripple",
        className: "motion-safe:animate-ripple",
        style: {
          ...style,
          //should be absolutely positioned
          position: "absolute",
          backgroundColor: "#FFFFFF",
          opacity: "25%",
          transform: "scale(0)",
          borderRadius: "50%"
        }
      },
      i
    );
  });
};

// hooks/useIsMounted.ts
import { useCallback, useEffect as useEffect2, useRef } from "react";
var useIsMounted = () => {
  const mountedRef = useRef(false);
  useEffect2(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return useCallback(() => {
    return mountedRef.current;
  }, []);
};

// hooks/useCombinedRefs.ts
import { useCallback as useCallback2 } from "react";
var useCombinedRefs = (...refs) => useCallback2(
  (element) => refs.forEach((ref) => {
    if (!ref) {
      return;
    }
    if (typeof ref === "function") {
      return ref(element);
    }
    ref.current = element;
  }),
  refs
);

// hooks/useIsClosing.ts
import { useCallback as useCallback3, useEffect as useEffect3, useRef as useRef2, useState as useState2 } from "react";
function useIsClosing(initialValue = false, delay = 500) {
  const [[isOpen, isClosing], setState] = useState2([initialValue, false]);
  const isMounted = useRef2(false);
  useEffect3(() => {
    isMounted.current = true;
    return () => void (isMounted.current = false);
  }, []);
  const setIsOpen = useCallback3(
    (newState) => {
      if (newState) {
        setState([true, false]);
      } else {
        setState([true, true]);
        setTimeout(() => {
          isMounted.current && setState([false, false]);
        }, delay);
      }
    },
    [delay]
  );
  return { isOpen, isClosing, setIsOpen };
}

// hooks/usePrevious.ts
import { useEffect as useEffect4, useRef as useRef3 } from "react";
function usePrevious(value) {
  const ref = useRef3();
  useEffect4(() => {
    ref.current = value;
  });
  return ref.current;
}

// hooks/useEventCallback.ts
import { useCallback as useCallback4, useRef as useRef4 } from "react";
function useEventCallback(callback) {
  const ref = useRef4(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  ref.current = callback;
  return useCallback4((...args) => ref.current?.(...args), [ref]);
}

// hooks/useDebounce.ts
import {
  useCallback as useCallback5,
  useEffect as useEffect5,
  useRef as useRef5,
  useState as useState3
} from "react";
function useDebounce(value, delay) {
  const [debouncedValue, setImmediateValue] = useState3(value);
  useEffect5(() => {
    const timer = setTimeout(() => setImmediateValue(value), delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return [debouncedValue, setImmediateValue];
}
function useRefDebounce(value, delay) {
  const debouncedValueRef = useRef5(value);
  useEffect5(() => {
    const timer = setTimeout(() => {
      debouncedValueRef.current = value;
    }, delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValueRef;
}
function useStateDebounce(initialValue, delay) {
  const [value, setImmediateValue] = useState3(initialValue);
  const [debouncedValue, setDebouncedValue] = useState3(initialValue);
  const setValue = useCallback5((value2, immediate = false) => {
    setImmediateValue(value2);
    if (immediate) {
      setDebouncedValue(value2);
    }
  }, []);
  useEffect5(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return [value, debouncedValue, setValue];
}

// hooks/useCopyToClipboard.ts
import { useCallback as useCallback6, useState as useState4 } from "react";
function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState4(null);
  const copy = useCallback6(async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
      return false;
    }
  }, []);
  return [copiedText, copy];
}

// hooks/useEventListener.ts
import { useEffect as useEffect7, useRef as useRef6 } from "react";

// hooks/useIsomorphicLayoutEffect.ts
import { useEffect as useEffect6, useLayoutEffect } from "react";
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect6;

// hooks/useEventListener.ts
function useEventListener(eventName, handler, element, options) {
  const savedHandler = useRef6(handler);
  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect7(() => {
    const targetElement = element?.current ?? window;
    if (!(targetElement && targetElement.addEventListener)) return;
    const listener = (event) => {
      savedHandler.current(event);
    };
    targetElement.addEventListener(eventName, listener, options);
    return () => {
      targetElement.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}

// hooks/useOnClickOutside.ts
function useOnClickOutside(ref, handler, eventType = "mousedown", eventListenerOptions = {}) {
  useEventListener(
    eventType,
    (event) => {
      const target = event.target;
      if (!target || !target.isConnected) {
        return;
      }
      const isOutside = Array.isArray(ref) ? ref.filter((r) => Boolean(r.current)).every((r) => r.current && !r.current.contains(target)) : ref.current && !ref.current.contains(target);
      if (isOutside) {
        handler(event);
      }
    },
    void 0,
    eventListenerOptions
  );
}

// components/button/Button.tsx
import {
  forwardRef,
  useImperativeHandle,
  useRef as useRef7
} from "react";
import clsx3 from "clsx";

// components/loader/Loader.tsx
import { useId as useId2 } from "react";
import clsx2 from "clsx";

// lib/arrUtil.ts
function arrayEquals(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
}

// lib/error.ts
function isErrorLike(err) {
  if (err instanceof Error) {
    return true;
  } else if (err.name !== void 0 && err.message !== void 0) {
    return true;
  }
  return false;
}
function parseError(err) {
  if (isErrorLike(err)) {
    return [err.message || "An error occured", { color: "red" }];
  }
  return null;
}

// lib/fetch.ts
async function fetchAPI(urlObjOrString, enhancedOptions = {}, baseUrl, baseOptions) {
  const { urlParams, query, body, ...rest } = enhancedOptions;
  let options = rest;
  let url;
  if (urlObjOrString instanceof URL) {
    url = urlObjOrString;
  } else {
    const origin = baseUrl ? new URL(baseUrl).origin : window.location.origin;
    let prefix = baseUrl ? new URL(baseUrl).pathname : "";
    if (prefix === "/") {
      prefix = "";
    }
    url = new URL(`${prefix}${urlObjOrString}`, origin);
  }
  if (urlParams) {
    for (const [name, value] of Object.entries(urlParams)) {
      url.pathname = url.pathname.replace(`%7B${name}%7D`, value.toString());
    }
  }
  if (query) {
    for (const [name, value] of Object.entries(query)) {
      url.searchParams.set(
        name,
        typeof value === "object" ? JSON.stringify(value) : value.toString()
      );
    }
  }
  if (body && typeof body !== "string" && !(body instanceof FormData)) {
    options.headers = {
      ...options.headers = {},
      "Content-Type": "application/json"
    };
    options.body = JSON.stringify(body);
  }
  if (baseOptions) {
    const { headers: baseHeaders = {}, ...baseRest } = baseOptions;
    options = {
      ...baseRest,
      ...options,
      headers: {
        ...baseHeaders,
        ...options.headers
      }
    };
  }
  const response = await fetch(url.toString(), options);
  if (response.status === 204) {
    return null;
  }
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json") || contentType?.includes("application/geo+json")) {
    const dataJson = await response.json();
    if (response.ok) {
      return dataJson;
    }
    let errorMessage = "request Error";
    if (dataJson.message) {
      errorMessage = dataJson.message;
    }
    if (dataJson.error?.message) {
      errorMessage = dataJson.error?.message;
    }
    throw new FetchError(errorMessage, response.status, dataJson);
  }
  const dataText = await response.text();
  if (response.ok) {
    return dataText;
  }
  throw new FetchError(`${response.status} ${response.statusText}`, response.status, dataText);
}
var FetchError = class extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "FetchError";
  }
};

// lib/tailwindVariants.ts
var colorVariants = {
  yellow: {
    border: "border-yellow-3",
    text: "text-yellow-4"
  },
  gray: {
    border: "border-gray-3",
    text: "text-gray-4"
  },
  red: {
    border: "border-red-3",
    text: "text-red-4"
  },
  orange: {
    border: "border-orange-3",
    text: "text-orange-4"
  },
  green: {
    border: "border-green-3",
    text: "text-green-4"
  },
  blue: {
    border: "border-blue-3",
    text: "text-blue-4"
  }
};

// components/loader/Loader.tsx
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var sizeConfig = {
  small: "w-6 h-6 text-base",
  medium: "w-8 h-8 text-[2rem]",
  large: "w-12 h-12 text-[3rem]"
};
var trackStyle = {
  strokeLinecap: "round",
  strokeWidth: 2
};
var circleStyle = {
  strokeLinecap: "round",
  strokeWidth: 2,
  /**
   * $total-length: 43.699; // total length of path, calculated by getTotalLength() in JS
   * $looping-percent: 40;
   * $looping-length: math.div($looping-percent * $total-length, 100) = 17.464;
   * stroke-dasharray: #{$looping-length * 1px}, #{($total-length - $looping-length) * 1px};
   */
  strokeDasharray: "17.45px, 26.21px"
};
function Loader({ size: size4 = "medium", color = "blue", className, ...rest }) {
  const id = useId2();
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      className: clsx2("inline-block", sizeConfig[size4], colorVariants[color].text, className),
      viewBox: "0 0 16 16",
      ...rest,
      children: [
        /* @__PURE__ */ jsx3("defs", { children: /* @__PURE__ */ jsx3("circle", { id, cx: "8", cy: "8", r: "7" }) }),
        /* @__PURE__ */ jsx3("use", { href: `#${id}`, className: "opacity-25 fill-none stroke-current", style: trackStyle }),
        /* @__PURE__ */ jsx3(
          "use",
          {
            href: `#${id}`,
            className: "fill-none stroke-current animate-loader-stroke",
            style: circleStyle
          }
        )
      ]
    }
  );
}

// components/button/Button.tsx
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var buttonVariants = {
  size(icon, size4) {
    if (size4 === "custom") {
      return false;
    }
    switch (size4) {
      case "small":
        return clsx3("text-sm h-6", icon ? "min-w-6 [&_i]:w-6" : "px-2");
      case "medium":
        return clsx3("h-8", icon ? "min-w-8 [&_i]:w-8" : "px-4");
      case "large":
        return clsx3(
          "h-12",
          icon ? "text-2xl min-w-12 [&_i]:w-12" : "text-xl px-8"
        );
    }
  },
  variant: {
    contained(color) {
      return clsx3(
        "shadow hover:shadow-md focus:shadow-md active-full:shadow-lg outline-offset-0",
        {
          yellow: "text-yellow-text bg-yellow-3 hover:bg-yellow-4 active-full:bg-yellow-5 focus-visible:outline-yellow-5",
          gray: "text-gray-text bg-gray-3 hover:bg-gray-4 active-full:bg-gray-5 focus-visible:outline-gray-5",
          red: "text-red-text bg-red-3 hover:bg-red-4 active-full:bg-red-5 focus-visible:outline-red-5",
          orange: "text-orange-text bg-orange-3 hover:bg-orange-4 active-full:bg-orange-5 focus-visible:outline-orange-5",
          green: "text-green-text bg-green-3 hover:bg-green-4 active-full:bg-green-5 focus-visible:outline-green-5",
          blue: "text-blue-text bg-blue-3 hover:bg-blue-4 active-full:bg-blue-5 focus-visible:outline-blue-5"
        }[color]
      );
    },
    light(color) {
      return clsx3(
        "shadow hover:shadow-md focus:shadow-md active-full:shadow-lg outline-offset-0 bg-gray-0",
        {
          yellow: "text-gray-text hover:text-yellow-text hover:bg-yellow-3 active-full:bg-yellow-4 dark:active-full:bg-yellow-4 focus-visible:outline-yellow-4",
          gray: "text-gray-text hover:text-gray-text hover:bg-gray-3 active-full:bg-gray-4 dark:active-full:bg-gray-4/50 focus-visible:outline-gray-4",
          red: "text-gray-text hover:text-red-text hover:bg-red-3 active-full:bg-red-4 dark:active-full:bg-red-4/50 focus-visible:outline-red-4",
          orange: "text-gray-text hover:text-orange-text hover:bg-orange-3 active-full:bg-orange-4 dark:active-full:bg-orange-4/50 focus-visible:outline-orange-4",
          green: "text-gray-text hover:text-green-text hover:bg-green-3 active-full:bg-green-4 dark:active-full:bg-green-4/50 focus-visible:outline-green-4",
          blue: "text-gray-text hover:text-blue-text hover:bg-blue-3 active-full:bg-blue-4 dark:active-full:bg-blue-4/50 focus-visible:outline-blue-4"
        }[color]
      );
    },
    outlined(color) {
      return clsx3(
        "bg-gray-0 text-gray-7 outline outline-2 outline-offset-[-2px] focus-visible:ring-2 active-full:shadow-md",
        {
          yellow: "hover:bg-yellow-1/50 active-full:bg-yellow-2/50 outline-yellow-5 focus-visible:ring-yellow-4",
          gray: "hover:bg-gray-1 active-full:bg-gray-2 outline-gray-5 focus-visible:ring-gray-4",
          red: "hover:bg-red-1/50 active-full:bg-red-2/50 outline-red-5 focus-visible:ring-red-4",
          orange: "hover:bg-orange-1/50 active-full:bg-orange-2/50 outline-orange-5 focus-visible:ring-orange-4",
          green: "hover:bg-green-1/50 active-full:bg-green-2/50 outline-green-5 focus-visible:ring-green-4",
          blue: "hover:bg-blue-1/50 active-full:bg-blue-2/50 outline-blue-5 focus-visible:ring-blue-4"
        }[color]
      );
    },
    text(color) {
      return clsx3(
        "bg-transparent active-full:shadow-sm outline-offset-0",
        {
          yellow: "hover:bg-yellow-1/50 active-full:bg-yellow-2/25 text-yellow-4 hover:text-yellow-5 focus-visible:outline-yellow-5",
          gray: "hover:bg-gray-1 active-full:bg-gray-2 text-gray-5 hover:text-gray-6 active-full:text-gray-7 focus-visible:outline-gray-5",
          red: "hover:bg-red-1/50 active-full:bg-red-2/50 text-red-4 hover:text-red-5 focus-visible:outline-red-5",
          orange: "hover:bg-orange-1/50 active-full:bg-orange-2/50 text-orange-4 hover:text-orange-5 focus-visible:outline-orange-5",
          green: "hover:bg-green-1/50 active-full:bg-green-2/50 text-green-4 hover:text-green-5 focus-visible:outline-green-5",
          blue: "hover:bg-blue-1/50 active-full:bg-blue-2/50 text-blue-4 hover:text-blue-5 focus-visible:outline-blue-5"
        }[color]
      );
    },
    ghost(color) {
      return clsx3(
        "bg-transparent outline-offset-0",
        {
          yellow: "text-yellow-4 hover:text-yellow-5",
          gray: "text-gray-5 hover:text-gray-6 active-full:text-gray-7",
          red: "text-red-4 hover:text-red-5",
          orange: "text-orange-4 hover:text-orange-5",
          green: "text-green-4 hover:text-green-5",
          blue: "text-blue-4 hover:text-blue-5"
        }[color]
      );
    }
  }
};
var Button = forwardRef(
  ({
    withRipple = true,
    variant = "contained",
    loading,
    color = "yellow",
    size: size4 = "medium",
    focusable = true,
    fullWidth,
    className,
    disabled,
    children,
    selected = false,
    icon = false,
    ...props
  }, ref) => {
    const inputRef = useRef7(null);
    useImperativeHandle(
      ref,
      () => inputRef.current
    );
    const notClickable = loading || disabled;
    const ripples = useRipple(inputRef);
    return /* @__PURE__ */ jsxs2(
      "button",
      {
        tabIndex: focusable ? 0 : -1,
        role: "button",
        ref: inputRef,
        className: clsx3(
          "relative inline-flex cursor-pointer items-center overflow-clip border-0 text-center leading-5 no-underline duration-300 focus-visible:outline focus-visible:outline-2 motion-safe:transition-color-shadow",
          icon ? "rounded-full" : "rounded-2xl",
          className,
          buttonVariants.size(icon, size4),
          buttonVariants.variant[variant](color),
          icon && "justify-center [&_:last-child:not(i,img,svg)]:pr-4",
          fullWidth && "w-full",
          selected && "active",
          notClickable && "disabled"
        ),
        "data-variant": variant,
        disabled,
        "aria-busy": loading,
        ...props,
        children: [
          !notClickable && withRipple && ripples,
          children,
          loading !== void 0 && /* @__PURE__ */ jsx4("span", { className: "", children: /* @__PURE__ */ jsx4(
            Loader,
            {
              color,
              size: "small",
              className: clsx3("-mr-2 ml-2", !loading && "invisible")
            }
          ) })
        ]
      }
    );
  }
);

// components/button/ButtonGroup.tsx
import clsx4 from "clsx";
import { jsx as jsx5 } from "react/jsx-runtime";
var buttonGroupVariants = {
  horizontal: "[&_:not(:first-child)]:rounded-bl-none [&_:not(:last-child)]:rounded-tr-none [&_[data-variant='outlined']]:-mx-[1px]",
  vertical: "flex flex-col [&_:not(:first-child)]:rounded-tr-none [&_:not(:last-child)]:rounded-bl-none [&_[data-variant='outlined']]:-my-[1px]"
};
function ButtonGroup({ children, className, direction = "horizontal" }) {
  return /* @__PURE__ */ jsx5(
    "div",
    {
      className: clsx4(
        "ll-button-group [&_:not(:first-child)]:rounded-tl-none [&_:not(:last-child)]:rounded-br-none",
        buttonGroupVariants[direction],
        `direction-${direction}`,
        className
      ),
      children
    }
  );
}

// components/button/LinkButton.tsx
import {
  forwardRef as forwardRef2,
  useImperativeHandle as useImperativeHandle2,
  useRef as useRef8
} from "react";
import clsx5 from "clsx";
import { jsxs as jsxs3 } from "react/jsx-runtime";
var LinkButton = forwardRef2(
  function LinkButton2({
    withRipple = true,
    variant = "contained",
    color = "yellow",
    size: size4 = "medium",
    focusable = true,
    fullWidth,
    className,
    children,
    selected = false,
    icon = false,
    href,
    ...props
  }, ref) {
    const anchorRef = useRef8(null);
    useImperativeHandle2(
      ref,
      () => anchorRef.current
    );
    const ripples = useRipple(anchorRef);
    return /* @__PURE__ */ jsxs3(
      "a",
      {
        tabIndex: focusable ? 0 : -1,
        role: "button",
        href,
        ref: anchorRef,
        className: clsx5(
          "relative inline-flex cursor-pointer items-center overflow-clip border-0 text-center leading-5 no-underline duration-300 focus-visible:outline focus-visible:outline-2 motion-safe:transition-color-shadow",
          icon ? "rounded-full" : "rounded-2xl",
          className,
          buttonVariants.size(icon, size4),
          buttonVariants.variant[variant](color),
          icon && "justify-center [&_:last-child:not(i,img)]:pr-4",
          fullWidth && "w-full",
          selected && "active"
        ),
        "data-variant": variant,
        ...props,
        children: [
          withRipple && ripples,
          children
        ]
      }
    );
  }
);

// components/dialog/Dialog.tsx
import clsx6 from "clsx";
import { jsx as jsx6 } from "react/jsx-runtime";
var dialogVariants = {
  color(color) {
    if (!color) {
      return "bg-gray-0";
    }
    return clsx6(
      "border-t-4",
      {
        yellow: "border-t-yellow-3 bg-gray-0",
        gray: "border-t-gray-3 bg-gray-0",
        red: "border-t-red-3 bg-red-1",
        blue: "border-t-blue-3 bg-blue-1",
        green: "border-t-green-3 bg-green-1",
        orange: "border-t-orange-3 bg-orange-1"
      }[color]
    );
  }
};
function Dialog({ placement, color, children, className, ...rest }) {
  return /* @__PURE__ */ jsx6(
    "div",
    {
      className: clsx6(
        "rounded-2xl relative shadow dark:shadow-dark",
        dialogVariants.color(color),
        className
      ),
      "data-placement": placement,
      "data-color": color,
      ...rest,
      children
    }
  );
}

// components/input/Input.tsx
import { forwardRef as forwardRef3 } from "react";
import clsx7 from "clsx";
import { jsx as jsx7, jsxs as jsxs4 } from "react/jsx-runtime";
var inputConfig = {
  container: "p8n-input-text rounded-2xl outline-offset-[-1px] flex ",
  input: "h-8 flex-1 appearance-none outline-none filter-none min-w-0 bg-transparent"
};
var Input = forwardRef3(
  ({ variant = "normal", color = "yellow", disabled = false, prefix, suffix, className, ...rest }, ref) => {
    return /* @__PURE__ */ jsxs4(
      "div",
      {
        "data-color": color,
        "data-variant": variant,
        className: clsx7(inputConfig.container, disabled && "disabled", className),
        children: [
          prefix && /* @__PURE__ */ jsx7(
            "div",
            {
              className: clsx7([
                "flex-center relative",
                typeof prefix === "string" && "mx-2 select-none text-gray-6"
              ]),
              children: prefix
            }
          ),
          /* @__PURE__ */ jsx7(
            "input",
            {
              ref,
              className: clsx7(inputConfig.input, !prefix && "pl-4", !suffix && "pr-4"),
              ...rest,
              disabled
            }
          ),
          suffix && /* @__PURE__ */ jsx7(
            "div",
            {
              className: clsx7([
                "flex-center relative",
                typeof suffix === "string" && "mx-2 select-none text-gray-6"
              ]),
              children: suffix
            }
          )
        ]
      }
    );
  }
);

// components/autocomplete/Autocomplete.tsx
import { jsx as jsx8, jsxs as jsxs5 } from "react/jsx-runtime";
import { createElement } from "react";
function Autocomplete({
  className,
  icon = true,
  color = "yellow",
  selectionSuffix,
  noSearchSuffix,
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
  selectOnFocus = true
}, inputRef) {
  const [isOpen, setIsOpen] = useState5(false);
  const [activeIndex, setActiveIndex] = useState5(null);
  const onChangeSearchValueStable = useEventCallback(onChangeSearchValue);
  const onChangeSelectionStable = useEventCallback(onChangeSelection);
  const OptionComponent = autocompleteOptionComponent ?? AutocompleteOption_default;
  const listRef = useRef9([]);
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
            width: `${Math.max(130, rects.reference.width)}px`
          });
          const firstChild = elements.floating.firstElementChild;
          if (firstChild) {
            firstChild.style.maxHeight = `${Math.min(availableHeight, 288)}px`;
          }
        },
        padding: 10
      })
    ]
  });
  const role = useRole(context, { role: "listbox" });
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    /* we want the real focus to stay on the input, so focus associated to active items is simulated */
    virtual: true,
    loop: true
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [role, dismiss, listNav]
  );
  function handleChangeSearchValue(e) {
    const value = e.target.value;
    onChangeSearchValueStable(value, false);
    if (value !== searchValue && selection !== null) {
      onChangeSelectionStable(null);
      setActiveIndex(null);
      return;
    }
    if (value) {
      setIsOpen(true);
      setActiveIndex(listRef.current[0] ? 0 : null);
    } else {
      setIsOpen(false);
      setActiveIndex(null);
    }
  }
  const handleSelect = useCallback7(
    (index) => {
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
    [options, onChangeSelectionStable, onChangeSearchValueStable]
  );
  const autocompleteContext = useMemo(
    () => ({
      activeIndex,
      selection,
      getItemProps,
      handleSelect
    }),
    [activeIndex, selection, getItemProps, handleSelect]
  );
  return /* @__PURE__ */ jsxs5("div", { className, children: [
    /* @__PURE__ */ jsxs5(
      "div",
      {
        className: clsx8(inputConfig.container),
        ref: refs.setReference,
        "data-color": color,
        children: [
          icon !== false && /* @__PURE__ */ jsxs5("div", { className: "relative flex-center", children: [
            loading && /* @__PURE__ */ jsx8(
              Loader,
              {
                size: "medium",
                color: "gray",
                className: "absolute left-0 top-0"
              }
            ),
            icon === true ? /* @__PURE__ */ jsx8("span", { className: "h-8 w-8 flex-center", children: /* @__PURE__ */ jsx8("i", { className: "fe-search" }) }) : icon
          ] }),
          /* @__PURE__ */ jsx8(
            "input",
            {
              spellCheck: "false",
              className: clsx8(inputConfig.input, icon === false && "pl-4"),
              ref: inputRef,
              type: "search",
              value: searchValue,
              placeholder,
              "aria-autocomplete": "list",
              ...getReferenceProps({
                onFocus() {
                  if (selectOnFocus) {
                    document.activeElement?.select();
                  }
                },
                onChange: handleChangeSearchValue,
                onMouseDown() {
                  if (options.length === 0) {
                    return;
                  }
                  setIsOpen((isOpen2) => !isOpen2);
                },
                onKeyDown(e) {
                  if (e.key === "Enter" && activeIndex != null) {
                    handleSelect(activeIndex);
                  }
                }
              })
            }
          ),
          /* @__PURE__ */ jsxs5("div", { className: "relative flex-center", children: [
            selection && selectionSuffix,
            clearSearchButton && (searchValue.trim() !== "" || selection !== null) && /* @__PURE__ */ jsx8(
              Button,
              {
                withRipple: false,
                icon: true,
                color: "gray",
                variant: "text",
                onClick: () => {
                  setIsOpen(false);
                  onChangeSelectionStable(null);
                  setActiveIndex(null);
                  onChangeSearchValueStable("", true);
                },
                children: /* @__PURE__ */ jsx8("i", { className: "fe-cancel" })
              }
            ),
            icon === false && loading && /* @__PURE__ */ jsx8(Loader, { size: "medium", color: "gray" }),
            !selection && searchValue === "" && noSearchSuffix
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx8(FloatingPortal, { children: /* @__PURE__ */ jsx8(AutocompleteContext.Provider, { value: autocompleteContext, children: isOpen && /* @__PURE__ */ jsx8(
      FloatingFocusManager,
      {
        disabled: selectOnFocus,
        context,
        initialFocus: -1,
        visuallyHiddenDismiss: true,
        children: /* @__PURE__ */ jsx8(
          "div",
          {
            className: "z-dialog outline-none",
            ref: refs.setFloating,
            style: floatingStyles,
            ...getFloatingProps(),
            children: /* @__PURE__ */ jsx8(
              Dialog,
              {
                placement: context.placement,
                className: "overflow-auto motion-safe:animate-fade-in-list",
                children: /* @__PURE__ */ jsx8(FloatingList, { elementsRef: listRef, children: options.map((option) => {
                  return /* @__PURE__ */ createElement(
                    OptionComponent,
                    {
                      ...option,
                      key: getOptionValue(option)
                    }
                  );
                }) })
              }
            )
          }
        )
      }
    ) }) })
  ] });
}
var Autocomplete_default = forwardRef4(Autocomplete);

// components/autocomplete/SimpleAutocomplete.tsx
import { useLayoutEffect as useLayoutEffect2, useRef as useRef10, useState as useState6 } from "react";
import { jsx as jsx9 } from "react/jsx-runtime";
function SimpleAutocomplete({
  options,
  selection = null,
  onChangeSelection,
  ...rest
}) {
  const onChangeSelectionStable = useEventCallback(onChangeSelection);
  const [searchValue, setSearchValue] = useState6(selection ? getOptionLabel(selection) : "");
  const searchValueRef = useRef10(searchValue);
  searchValueRef.current = searchValue;
  const inputRef = useRef10(null);
  useLayoutEffect2(() => {
    if (selection === null) {
      if (document.activeElement !== inputRef.current) {
        setSearchValue("");
      }
      return;
    }
    const selectionLabel = getOptionLabel(selection);
    if (searchValueRef.current !== getOptionLabel(selection)) {
      setSearchValue(selectionLabel);
    }
  }, [selection, setSearchValue]);
  const filteredOptions = selection !== null ? [] : options.filter((option) => {
    const optionLabel = getOptionLabel(option);
    return optionLabel.toLowerCase().startsWith(searchValue.toLowerCase());
  });
  return /* @__PURE__ */ jsx9(
    Autocomplete_default,
    {
      ref: inputRef,
      searchValue,
      onChangeSearchValue: setSearchValue,
      selection,
      onChangeSelection: onChangeSelectionStable,
      options: filteredOptions,
      ...rest
    }
  );
}

// components/autocomplete/LazyAutocomplete.tsx
import { useCallback as useCallback8, useEffect as useEffect8, useLayoutEffect as useLayoutEffect3, useRef as useRef11, useState as useState7 } from "react";
import { jsx as jsx10 } from "react/jsx-runtime";
function LazyAutocomplete({
  onChangeSearchValueCallback,
  debounce = 5e3,
  selection = null,
  onChangeSelection,
  ...rest
}) {
  const onChangeSelectionStable = useEventCallback(onChangeSelection);
  const onChangeSearchValueCallbackStable = useEventCallback(onChangeSearchValueCallback);
  const [searchValue, searchValueDebounced, setSearchValue] = useStateDebounce(
    selection ? getOptionLabel(selection) : "",
    debounce
  );
  const searchValueRef = useRef11(searchValue);
  searchValueRef.current = searchValue;
  const inputRef = useRef11(null);
  const [loading, setLoading] = useState7(false);
  const [options, setOptions] = useState7([]);
  const handleChangeSelection = useCallback8(
    (selection2) => {
      onChangeSelectionStable(selection2);
      if (selection2) {
        setOptions([]);
      }
    },
    [onChangeSelectionStable]
  );
  useLayoutEffect3(() => {
    if (selection === null) {
      if (document.activeElement !== inputRef.current) {
        setSearchValue("", true);
      }
      return;
    }
    const selectionLabel = getOptionLabel(selection);
    if (searchValueRef.current !== selectionLabel) {
      setSearchValue(selectionLabel, true);
    }
  }, [selection, setSearchValue]);
  useEffect8(() => {
    let abort = false;
    if (selection) {
      return;
    }
    if (searchValueDebounced.trim() === "") {
      setOptions([]);
      return;
    }
    setLoading(true);
    onChangeSearchValueCallbackStable(searchValueDebounced)?.then((newOptions) => {
      setLoading(false);
      if (!abort) {
        setOptions(newOptions);
      }
    }).catch(() => {
      setLoading(false);
    });
    return () => {
      setLoading(false);
      abort = true;
    };
  }, [selection, searchValueDebounced, onChangeSearchValueCallbackStable]);
  return /* @__PURE__ */ jsx10(
    Autocomplete_default,
    {
      ref: inputRef,
      searchValue,
      onChangeSearchValue: (newValue, immediate) => {
        setSearchValue(newValue, immediate || newValue === "" ? true : false);
      },
      selection,
      onChangeSelection: handleChangeSelection,
      options,
      loading,
      ...rest
    }
  );
}

// components/badge/Badge.tsx
import clsx11 from "clsx";

// components/href/Href.tsx
import { forwardRef as forwardRef5 } from "react";
import clsx9 from "clsx";
import { jsx as jsx11 } from "react/jsx-runtime";
var Href = forwardRef5(
  ({ href = "#", ghost = false, children, className, ...rest }, ref) => {
    return /* @__PURE__ */ jsx11(
      "a",
      {
        ref,
        href,
        className: clsx9("link", ghost && "ghost-link", className),
        ...rest,
        children
      }
    );
  }
);

// components/tooltip/Tooltip.tsx
import { jsx as jsx12 } from "react/jsx-runtime";
function Tooltip({ children, ...options }) {
  const tooltip = useTooltip(options);
  return /* @__PURE__ */ jsx12(TooltipContext.Provider, { value: tooltip, children });
}

// components/tooltip/TooltipContent.tsx
import { forwardRef as forwardRef6 } from "react";
import { FloatingPortal as FloatingPortal2, useMergeRefs } from "@floating-ui/react";
import clsx10 from "clsx";

// components/dialog/util.ts
function getSide(placement) {
  return placement.split("-")[0];
}
function computeArrowStyle({ middlewareData, placement }) {
  if (!middlewareData.arrow) {
    return {
      display: "none"
    };
  }
  const { x, y } = middlewareData.arrow;
  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
  }[getSide(placement)];
  return {
    left: x != null ? `${x}px` : "",
    top: y != null ? `${y}px` : "",
    [staticSide]: "-6px"
  };
}

// components/tooltip/TooltipContent.tsx
import { jsx as jsx13, jsxs as jsxs6 } from "react/jsx-runtime";
var TooltipContent = forwardRef6(
  ({ style, children, className, ...props }, propRef) => {
    const context = useTooltipContext();
    const ref = useMergeRefs([context.refs.setFloating, propRef]);
    if (!context.open) {
      return null;
    }
    return /* @__PURE__ */ jsx13(FloatingPortal2, { children: /* @__PURE__ */ jsx13(
      "div",
      {
        ref,
        className: clsx10(
          "z-tooltip outline-none",
          context.middlewareData.hide?.referenceHidden && "invisible"
        ),
        style: { ...context.floatingStyles, ...style },
        ...context.getFloatingProps(props),
        children: /* @__PURE__ */ jsxs6(
          Dialog,
          {
            placement: context.placement,
            className: clsx10(
              "max-w-80 px-2 py-1 text-sm motion-safe:animate-fade-in",
              className
            ),
            color: context.color,
            children: [
              children,
              /* @__PURE__ */ jsx13(
                "div",
                {
                  ref: context.arrowRef,
                  style: computeArrowStyle(context),
                  className: "p8n-arrow"
                }
              )
            ]
          }
        )
      }
    ) });
  }
);

// components/tooltip/TooltipTrigger.tsx
import { cloneElement, forwardRef as forwardRef7, isValidElement } from "react";
import { useMergeRefs as useMergeRefs2 } from "@floating-ui/react";
import { jsx as jsx14 } from "react/jsx-runtime";
var TooltipTrigger = forwardRef7(
  ({ children, asChild = false, ...props }, propRef) => {
    const context = useTooltipContext();
    const childrenRef = children.ref;
    const ref = useMergeRefs2([context.refs.setReference, propRef, childrenRef]);
    if (asChild && isValidElement(children)) {
      return cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...children.props,
          "data-state": context.open ? "open" : "closed"
        })
      );
    }
    return /* @__PURE__ */ jsx14("abbr", { ref, ...context.getReferenceProps(props), children });
  }
);

// components/tooltip/useTooltip.ts
import { useMemo as useMemo2, useRef as useRef12, useState as useState8 } from "react";
import {
  arrow,
  autoUpdate as autoUpdate2,
  flip as flip2,
  hide,
  offset as offset2,
  shift,
  useDismiss as useDismiss2,
  useFloating as useFloating2,
  useFocus,
  useHover,
  useInteractions as useInteractions2,
  useRole as useRole2
} from "@floating-ui/react";
var arrowWidth = 16;
function useTooltip({
  initialOpen = false,
  placement = "top",
  open: controlledOpen,
  onOpen: setControlledOpen,
  openDelay = 500,
  closeDelay = 500,
  color = "yellow"
} = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState8(initialOpen);
  const isUncontrolled = controlledOpen === null || controlledOpen === void 0;
  const open = isUncontrolled ? uncontrolledOpen : controlledOpen;
  const setOpen = isUncontrolled ? setUncontrolledOpen : setControlledOpen;
  const arrowRef = useRef12(null);
  const offsetVal = arrowWidth / 2;
  const data = useFloating2({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate2,
    middleware: [
      offset2(offsetVal),
      flip2(),
      shift({ padding: 5 }),
      arrow({
        element: arrowRef,
        padding: 12
      }),
      hide({
        padding: 20
      })
    ]
  });
  const { context } = data;
  const hover = useHover(context, {
    move: false,
    enabled: isUncontrolled,
    delay: {
      open: openDelay || 1,
      close: closeDelay
    }
  });
  const focus = useFocus(context, {
    enabled: isUncontrolled
  });
  const dismiss = useDismiss2(context);
  const role = useRole2(context, { role: "tooltip" });
  const interactions = useInteractions2([hover, focus, dismiss, role]);
  return useMemo2(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      arrowRef,
      color
    }),
    [open, setOpen, color, interactions, data]
  );
}

// components/tooltip/useTooltipContext.ts
import { createContext as createContext2, useContext as useContext2 } from "react";
var TooltipContext = createContext2(null);
function useTooltipContext() {
  const context = useContext2(TooltipContext);
  if (context === null) {
    throw new Error("Tooltip components must be wrapped in <Tooltip />");
  }
  return context;
}

// components/tooltip/SimpleTooltip.tsx
import { isValidElement as isValidElement2 } from "react";
import { jsx as jsx15, jsxs as jsxs7 } from "react/jsx-runtime";
function SimpleTooltip({ content, children, contentClassName, ...options }) {
  return /* @__PURE__ */ jsxs7(Tooltip, { ...options, children: [
    /* @__PURE__ */ jsx15(TooltipContent, { className: contentClassName, children: content }),
    /* @__PURE__ */ jsx15(TooltipTrigger, { asChild: isValidElement2(children), children })
  ] });
}

// components/badge/Badge.tsx
import { jsx as jsx16, jsxs as jsxs8 } from "react/jsx-runtime";
function Badge({
  children,
  className,
  onRemove,
  onClick,
  tooltip,
  url,
  color = "yellow"
}) {
  const badge = /* @__PURE__ */ jsxs8(
    "span",
    {
      className: clsx11(
        "ll-badge",
        "inline-flex w-fit items-stretch overflow-hidden rounded-full text-xs shadow",
        buttonVariants.variant.contained(color),
        // badgeVariants.color[color],
        // `variant-solid-${color}`,
        // `text-${color}-4`,
        className
      ),
      children: [
        onClick ? /* @__PURE__ */ jsx16("button", { className: "px-2", onClick, children }) : /* @__PURE__ */ jsx16("span", { className: "px-2", children }),
        onRemove && /* @__PURE__ */ jsx16(
          "button",
          {
            className: "remove rounded-r-full pl-0.5 pr-1",
            onClick: onRemove,
            children: /* @__PURE__ */ jsx16("i", { className: "fe-cancel" })
          }
        )
      ]
    }
  );
  const wrappedBadge = url ? /* @__PURE__ */ jsx16(Href, { href: url, ghost: true, children: badge }) : badge;
  if (!tooltip) {
    return wrappedBadge;
  }
  return /* @__PURE__ */ jsxs8(Tooltip, { children: [
    /* @__PURE__ */ jsx16(TooltipContent, { children: tooltip }),
    /* @__PURE__ */ jsx16(TooltipTrigger, { asChild: true, children: wrappedBadge })
  ] });
}

// components/card/config.ts
var cardConfig = {
  item: "p-2 bg-gray-1 rounded-2xl",
  group: "grid grid-cols-2 gap-4"
};

// components/code/Code.tsx
import clsx12 from "clsx";
import { jsx as jsx17 } from "react/jsx-runtime";
function Code({ children, className }) {
  return /* @__PURE__ */ jsx17("code", { className: clsx12("px-1 rounded m-[1px] bg-gray-1 border border-gray-2", className), children });
}

// components/context-menu/ContextMenu.tsx
import {
  Children,
  cloneElement as cloneElement2,
  isValidElement as isValidElement3,
  useEffect as useEffect9,
  useRef as useRef13,
  useState as useState9
} from "react";
import {
  FloatingFocusManager as FloatingFocusManager2,
  FloatingPortal as FloatingPortal3,
  autoUpdate as autoUpdate3,
  flip as flip3,
  offset as offset3,
  shift as shift2,
  size as size2,
  useDismiss as useDismiss3,
  useFloating as useFloating3,
  useInteractions as useInteractions3,
  useListNavigation as useListNavigation2,
  useRole as useRole3,
  useTypeahead
} from "@floating-ui/react";
import { jsx as jsx18 } from "react/jsx-runtime";
function ContextMenu({ targetRef, children, style, eventName = "contextmenu" }) {
  const [activeIndex, setActiveIndex] = useState9(null);
  const [isOpen, setIsOpen] = useState9(false);
  const isOpenDebounceRef = useRefDebounce(isOpen, 200);
  const contextEvent = useRef13(null);
  const listItemsRef = useRef13([]);
  const listContentRef = useRef13(
    Children.map(
      children,
      (child) => isValidElement3(child) ? child.props.label : null
    )
  );
  const { refs, floatingStyles, context } = useFloating3({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset3({ mainAxis: 5, alignmentAxis: 4 }),
      flip3(),
      size2({
        apply({ elements, availableHeight }) {
          const firstChild = elements.floating.firstElementChild;
          if (firstChild) {
            firstChild.style.maxHeight = `${Math.min(availableHeight, 300)}px`;
          }
        },
        padding: 10
      }),
      shift2({ padding: 10 })
    ],
    /**
     * it is better to be less demanding on small screen sizes to see the content displayed correctly
     */
    placement: window.matchMedia("(min-width: 700px)").matches ? "right-start" : void 0,
    strategy: "fixed",
    whileElementsMounted: autoUpdate3
  });
  const role = useRole3(context, { role: "menu" });
  const dismiss = useDismiss3(context);
  const listNavigation = useListNavigation2(context, {
    listRef: listItemsRef,
    onNavigate: setActiveIndex,
    activeIndex
  });
  const typeahead = useTypeahead(context, {
    enabled: isOpen,
    listRef: listContentRef,
    onMatch: setActiveIndex,
    activeIndex
  });
  const { getFloatingProps, getItemProps } = useInteractions3([
    role,
    dismiss,
    listNavigation,
    typeahead
  ]);
  const onContextMenuStable = useEventCallback(function onContextMenu(e) {
    e.preventDefault();
    const isEmulatedContextMenu = e.type !== "contextmenu" && e.detail.emulated;
    if (isEmulatedContextMenu && isOpenDebounceRef.current) {
      return;
    }
    const originalEvent = e instanceof MouseEvent ? e : e.detail.originalEvent;
    contextEvent.current = e;
    refs.setPositionReference({
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: originalEvent.clientX,
          y: originalEvent.clientY,
          top: originalEvent.clientY,
          right: originalEvent.clientX,
          bottom: originalEvent.clientY,
          left: originalEvent.clientX
        };
      }
    });
    setIsOpen(true);
    isOpenDebounceRef.current = true;
  });
  useEffect9(() => {
    const stableTarget = targetRef?.current ?? document.documentElement;
    console.log("add contextmenu", targetRef);
    stableTarget.addEventListener(eventName, onContextMenuStable);
    return () => {
      console.log("remove contextmenu", targetRef);
      stableTarget.removeEventListener(eventName, onContextMenuStable);
    };
  }, [eventName, onContextMenuStable, targetRef]);
  return /* @__PURE__ */ jsx18(FloatingPortal3, { children: isOpen && /* @__PURE__ */ jsx18(FloatingFocusManager2, { context, initialFocus: refs.floating, children: /* @__PURE__ */ jsx18(
    "div",
    {
      className: "z-dialog outline-none",
      ref: refs.setFloating,
      style: { ...floatingStyles, ...style },
      ...getFloatingProps(),
      children: /* @__PURE__ */ jsx18(Dialog, { placement: context.placement, className: "z-context-menu max-h-80 overflow-auto", children: Children.map(
        children,
        (child, index) => isValidElement3(child) && cloneElement2(
          child,
          getItemProps({
            tabIndex: activeIndex === index ? 0 : -1,
            ref(node) {
              listItemsRef.current[index] = node;
            },
            onMouseUp() {
              child.props.onClick?.(contextEvent.current);
              setIsOpen(false);
            }
          })
        )
      ) })
    }
  ) }) });
}

// components/context-menu/ContextMenuItem.tsx
import { forwardRef as forwardRef8 } from "react";
import clsx13 from "clsx";
import { jsx as jsx19, jsxs as jsxs9 } from "react/jsx-runtime";
var ContextMenuItem = forwardRef8(
  ({ label, disabled, icon, className, ...props }, ref) => {
    return /* @__PURE__ */ jsxs9(
      "button",
      {
        ...props,
        className: clsx13(["option", className]),
        ref,
        role: "menuitem",
        disabled,
        children: [
          icon,
          /* @__PURE__ */ jsx19("span", { className: "content", children: label })
        ]
      }
    );
  }
);

// components/dropdown-menu/DropdownMenu.tsx
import { jsx as jsx20 } from "react/jsx-runtime";
function DropdownMenu({ children, ...options }) {
  const popover = useDropdownMenu(options);
  return /* @__PURE__ */ jsx20(DropdownMenuContext.Provider, { value: popover, children });
}

// components/dropdown-menu/DropdownMenuContent.tsx
import { forwardRef as forwardRef9 } from "react";
import {
  FloatingFocusManager as FloatingFocusManager3,
  FloatingList as FloatingList2,
  FloatingPortal as FloatingPortal4,
  useMergeRefs as useMergeRefs3
} from "@floating-ui/react";
import clsx14 from "clsx";
import { jsx as jsx21 } from "react/jsx-runtime";
var DropdownMenuContent = forwardRef9(({ style, children, ...props }, propRef) => {
  const context = useDropdownMenuContext();
  const floatingContext = context.context;
  const ref = useMergeRefs3([context.refs.setFloating, propRef]);
  if (!context.open) {
    return null;
  }
  return /* @__PURE__ */ jsx21(FloatingPortal4, { children: /* @__PURE__ */ jsx21(FloatingFocusManager3, { context: floatingContext, modal: context.modal, children: /* @__PURE__ */ jsx21(
    "div",
    {
      ref,
      className: "outline-none",
      style: { ...context.floatingStyles, ...style },
      ...context.getFloatingProps(props),
      children: /* @__PURE__ */ jsx21(
        Dialog,
        {
          placement: context.placement,
          className: clsx14(
            `border-${context.color}-2`,
            "motion-safe:animate-fade-in-list"
          ),
          children: /* @__PURE__ */ jsx21("div", { className: "box", children: /* @__PURE__ */ jsx21(
            FloatingList2,
            {
              elementsRef: context.elementsRef,
              labelsRef: context.labelsRef,
              children
            }
          ) })
        }
      )
    }
  ) }) });
});

// components/dropdown-menu/DropdownMenuTrigger.tsx
import { cloneElement as cloneElement3, forwardRef as forwardRef10, isValidElement as isValidElement4 } from "react";
import { useMergeRefs as useMergeRefs4 } from "@floating-ui/react";
import { jsx as jsx22 } from "react/jsx-runtime";
var DropdownMenuTrigger = forwardRef10(
  ({ children, asChild = false, ...props }, propRef) => {
    const context = useDropdownMenuContext();
    const childrenRef = children.ref;
    const ref = useMergeRefs4([context.refs.setReference, propRef, childrenRef]);
    if (asChild && isValidElement4(children)) {
      return cloneElement3(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...children.props,
          "data-state": context.open ? "open" : "closed"
        })
      );
    }
    return /* @__PURE__ */ jsx22(
      Button,
      {
        variant: "outlined",
        ref,
        "data-state": context.open ? "open" : "closed",
        ...context.getReferenceProps(props),
        children
      }
    );
  }
);

// components/dropdown-menu/useDropdownMenu.tsx
import { useCallback as useCallback9, useMemo as useMemo3, useRef as useRef14, useState as useState10 } from "react";
import {
  autoUpdate as autoUpdate4,
  flip as flip4,
  offset as offset4,
  shift as shift3,
  useClick,
  useDismiss as useDismiss4,
  useFloating as useFloating4,
  useInteractions as useInteractions4,
  useListNavigation as useListNavigation3,
  useRole as useRole4,
  useTypeahead as useTypeahead2
} from "@floating-ui/react";
var arrowWidth2 = 12;
function useDropdownMenu({
  initialOpen = false,
  placement = "bottom",
  open: controlledOpen,
  onOpen: setControlledOpen,
  color = "default",
  modal = false
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState10(initialOpen);
  const isUncontrolled = controlledOpen === null || controlledOpen === void 0;
  const open = isUncontrolled ? uncontrolledOpen : controlledOpen;
  const setOpen = isUncontrolled ? setUncontrolledOpen : setControlledOpen;
  const [activeIndex, setActiveIndex] = useState10(null);
  const elementsRef = useRef14([]);
  const labelsRef = useRef14([]);
  const offsetVal = 2 + arrowWidth2 / 2;
  const data = useFloating4({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate4,
    middleware: [
      offset4(offsetVal),
      flip4({
        // crossAxis: placement.includes('-'),
        // fallbackAxisSideDirection: "end",
      }),
      shift3({ padding: 5 })
    ]
  });
  const { context } = data;
  const click = useClick(context, {
    // TODO verify if use case to disable it
    // enabled: isUncontrolled,
  });
  const dismiss = useDismiss4(context);
  const role = useRole4(context);
  const listNav = useListNavigation3(context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true
  });
  const handleSelect = useCallback9(() => {
    setOpen(false);
  }, [setOpen]);
  function handleTypeaheadMatch(index) {
    if (open) {
      setActiveIndex(index);
    } else {
      handleSelect();
    }
  }
  const typeahead = useTypeahead2(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: handleTypeaheadMatch
  });
  const interactions = useInteractions4([click, dismiss, role, listNav, typeahead]);
  return useMemo3(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      elementsRef,
      labelsRef,
      color,
      modal,
      activeIndex,
      handleSelect
    }),
    [
      open,
      setOpen,
      interactions,
      data,
      color,
      modal,
      activeIndex,
      // getItemProps,
      handleSelect
    ]
  );
}

// components/dropdown-menu/useDropdownMenuContext.ts
import { createContext as createContext3, useContext as useContext3 } from "react";
var DropdownMenuContext = createContext3(null);
function useDropdownMenuContext() {
  const context = useContext3(DropdownMenuContext);
  if (context === null) {
    throw new Error("DropdownMenu components must be wrapped in <DropdownMenu />");
  }
  return context;
}

// components/dropdown-menu/DropdownMenuItem.tsx
import { useListItem as useListItem2 } from "@floating-ui/react";
import clsx15 from "clsx";
import { jsx as jsx23 } from "react/jsx-runtime";
function DropdownMenuItem({ children, onClick, ...rest }) {
  const { activeIndex, getItemProps, handleSelect } = useDropdownMenuContext();
  const { ref, index } = useListItem2({ label: children?.toString() });
  const isActive = activeIndex === index;
  return /* @__PURE__ */ jsx23(
    "button",
    {
      className: clsx15("option", isActive && "bg-gray-1"),
      ref,
      role: "option",
      "aria-selected": isActive,
      tabIndex: isActive ? 0 : -1,
      ...getItemProps({
        ...rest,
        onClick: (e) => {
          onClick?.(e);
          handleSelect();
        }
      }),
      children
    }
  );
}

// components/dropdown-menu-nested/DropdownMenuNested.tsx
import { forwardRef as forwardRef11 } from "react";
import { FloatingTree } from "@floating-ui/react";
import { jsx as jsx24 } from "react/jsx-runtime";
var DropdownMenuNested = forwardRef11((props, ref) => {
  return /* @__PURE__ */ jsx24(FloatingTree, { children: /* @__PURE__ */ jsx24(MenuItemWithChildren, { ...props, ref }) });
});

// components/dropdown-menu-nested/MenuItem.tsx
import { useFloatingTree, useListItem as useListItem3, useMergeRefs as useMergeRefs5 } from "@floating-ui/react";
import { forwardRef as forwardRef12, useContext as useContext4 } from "react";

// components/dropdown-menu-nested/MenuContext.ts
import { createContext as createContext4 } from "react";
var MenuContext = createContext4({
  getItemProps: () => ({}),
  activeIndex: null,
  setActiveIndex: () => {
  },
  setHasFocusInside: () => {
  },
  isOpen: false
});

// components/dropdown-menu-nested/MenuItem.tsx
import { jsx as jsx25 } from "react/jsx-runtime";
var MenuItem = forwardRef12(({ label, disabled, ...props }, forwardedRef) => {
  const menu = useContext4(MenuContext);
  const item = useListItem3({ label: disabled ? null : label });
  const tree = useFloatingTree();
  const isActive = item.index === menu.activeIndex;
  return /* @__PURE__ */ jsx25(
    "button",
    {
      ...props,
      ref: useMergeRefs5([item.ref, forwardedRef]),
      type: "button",
      role: "menuitem",
      className: "option",
      tabIndex: isActive ? 0 : -1,
      disabled,
      ...menu.getItemProps({
        onClick(event) {
          props.onClick?.(event);
          tree?.events.emit("click");
        },
        onFocus(event) {
          props.onFocus?.(event);
          menu.setHasFocusInside(true);
        }
      }),
      children: label
    }
  );
});

// components/dropdown-menu-nested/MenuItemWithChildren.tsx
import {
  FloatingFocusManager as FloatingFocusManager4,
  FloatingList as FloatingList3,
  FloatingNode,
  FloatingPortal as FloatingPortal5,
  autoUpdate as autoUpdate5,
  flip as flip5,
  offset as offset5,
  safePolygon,
  shift as shift4,
  useClick as useClick2,
  useDismiss as useDismiss5,
  useFloating as useFloating5,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree as useFloatingTree2,
  useHover as useHover2,
  useInteractions as useInteractions5,
  useListItem as useListItem4,
  useListNavigation as useListNavigation4,
  useMergeRefs as useMergeRefs6,
  useRole as useRole5,
  useTypeahead as useTypeahead3
} from "@floating-ui/react";
import { forwardRef as forwardRef13, useContext as useContext5, useEffect as useEffect10, useRef as useRef15, useState as useState11 } from "react";
import clsx16 from "clsx";
import { jsx as jsx26, jsxs as jsxs10 } from "react/jsx-runtime";
var MenuItemWithChildren = forwardRef13(
  ({ children, label, triggerComponent: TriggerComponent = Button, ...props }, forwardedRef) => {
    const [isOpen, setIsOpen] = useState11(false);
    const [hasFocusInside, setHasFocusInside] = useState11(false);
    const [activeIndex, setActiveIndex] = useState11(null);
    const elementsRef = useRef15([]);
    const labelsRef = useRef15([]);
    const parent = useContext5(MenuContext);
    const tree = useFloatingTree2();
    const nodeId = useFloatingNodeId();
    const parentId = useFloatingParentNodeId();
    const item = useListItem4();
    const isNested = parentId != null;
    const { floatingStyles, refs, context } = useFloating5({
      nodeId,
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: isNested ? "right-start" : "bottom-start",
      middleware: [
        offset5({ mainAxis: isNested ? -8 : 10, alignmentAxis: isNested ? 0 : 0 }),
        flip5(),
        shift4()
      ],
      whileElementsMounted: autoUpdate5
    });
    const hover = useHover2(context, {
      enabled: isNested,
      delay: { open: 75 },
      handleClose: safePolygon({ blockPointerEvents: true })
    });
    const click = useClick2(context, {
      event: "mousedown",
      toggle: !isNested,
      ignoreMouse: isNested
    });
    const role = useRole5(context, { role: "menu" });
    const dismiss = useDismiss5(context, { bubbles: true });
    const listNavigation = useListNavigation4(context, {
      listRef: elementsRef,
      activeIndex,
      nested: isNested,
      onNavigate: setActiveIndex
    });
    const typeahead = useTypeahead3(context, {
      listRef: labelsRef,
      onMatch: isOpen ? setActiveIndex : void 0,
      activeIndex
    });
    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions5([
      hover,
      click,
      role,
      dismiss,
      listNavigation,
      typeahead
    ]);
    useEffect10(() => {
      if (!tree) return;
      function handleTreeClick() {
        setIsOpen(false);
      }
      function onSubMenuOpen(event) {
        if (event.nodeId !== nodeId && event.parentId === parentId) {
          setIsOpen(false);
        }
      }
      tree.events.on("click", handleTreeClick);
      tree.events.on("menuopen", onSubMenuOpen);
      return () => {
        tree.events.off("click", handleTreeClick);
        tree.events.off("menuopen", onSubMenuOpen);
      };
    }, [tree, nodeId, parentId]);
    useEffect10(() => {
      if (isOpen && tree) {
        tree.events.emit("menuopen", { parentId, nodeId });
      }
    }, [tree, isOpen, nodeId, parentId]);
    const ref = useMergeRefs6([refs.setReference, item.ref, forwardedRef]);
    return /* @__PURE__ */ jsxs10(FloatingNode, { id: nodeId, children: [
      isNested ? /* @__PURE__ */ jsxs10(
        "button",
        {
          ref,
          tabIndex: parent.activeIndex === item.index ? 0 : -1,
          role: "menuitem",
          "data-open": isOpen ? "" : void 0,
          "data-nested": "",
          "data-focus-inside": hasFocusInside ? "" : void 0,
          ...getReferenceProps(
            parent.getItemProps({
              onFocus(event) {
                props.onFocus?.(event);
                setHasFocusInside(false);
                parent.setHasFocusInside(true);
              }
            })
          ),
          className: clsx16(isNested && "option"),
          children: [
            /* @__PURE__ */ jsx26("span", { children: label }),
            /* @__PURE__ */ jsx26("span", { className: "ml-auto", children: /* @__PURE__ */ jsx26("i", { className: "fe-angle-right mr-0", "aria-hidden": true }) })
          ]
        }
      ) : /* @__PURE__ */ jsx26(
        TriggerComponent,
        {
          ref,
          "data-open": isOpen ? "" : void 0,
          "data-focus-inside": hasFocusInside ? "" : void 0,
          ...props,
          ...getReferenceProps(
            parent.getItemProps({
              onFocus(event) {
                props.onFocus?.(event);
                setHasFocusInside(false);
                parent.setHasFocusInside(true);
              }
            })
          ),
          className: clsx16(
            isNested && "option",
            !isNested && !TriggerComponent && "ll-dropdown-menu-trigger"
          ),
          children: label
        }
      ),
      /* @__PURE__ */ jsx26(
        MenuContext.Provider,
        {
          value: { activeIndex, setActiveIndex, getItemProps, setHasFocusInside, isOpen },
          children: isOpen && /* @__PURE__ */ jsx26(FloatingPortal5, { children: /* @__PURE__ */ jsx26(
            FloatingFocusManager4,
            {
              context,
              modal: false,
              initialFocus: isNested ? -1 : 0,
              returnFocus: !isNested,
              children: /* @__PURE__ */ jsx26(FloatingList3, { elementsRef, labelsRef, children: /* @__PURE__ */ jsx26("div", { ref: refs.setFloating, style: floatingStyles, className: "outline-none", children: /* @__PURE__ */ jsx26(Dialog, { ...getFloatingProps(), children }) }) })
            }
          ) })
        }
      )
    ] });
  }
);

// components/flash/Flash.tsx
import clsx17 from "clsx";
import { jsx as jsx27 } from "react/jsx-runtime";
function Flash({ color = "yellow", children, className }) {
  return /* @__PURE__ */ jsx27(
    "div",
    {
      className: clsx17(
        "border-l-4 bg-gray-0 p-2 shadow dark:shadow-dark [&_p]:m-0",
        colorVariants[color].border,
        className
      ),
      children
    }
  );
}

// components/highlight/Highlight.tsx
import { jsx as jsx28 } from "react/jsx-runtime";
function Highlight({ value, indices, minLength = 2 }) {
  if (!indices || !value) {
    return value;
  }
  const content = [];
  let lastIndex = 0;
  indices.forEach((indice) => {
    if (indice[1] - indice[0] < minLength) {
      return;
    }
    if (indice[0] - lastIndex > 0) {
      content.push(value.substring(lastIndex, indice[0]));
    }
    content.push(/* @__PURE__ */ jsx28("mark", { children: value.substring(indice[0], indice[1] + 1) }, content.length));
    lastIndex = indice[1] + 1;
  });
  if (lastIndex <= value.length) {
    content.push(value.substring(lastIndex));
  }
  return /* @__PURE__ */ jsx28("span", { className: "text-gray-6", children: content });
}

// components/input/Checkbox.tsx
import { forwardRef as forwardRef14, useRef as useRef16 } from "react";
import clsx18 from "clsx";
import { jsx as jsx29, jsxs as jsxs11 } from "react/jsx-runtime";
var Checkbox = forwardRef14(
  function Checkbox2({
    color = "yellow",
    indeterminate,
    disabled = false,
    checked,
    className,
    children,
    ...rest
  }, ref) {
    const inputRef = useRef16(null);
    const combinedRef = useCombinedRefs(inputRef, ref);
    return /* @__PURE__ */ jsxs11(
      "label",
      {
        className: clsx18(
          "flex cursor-pointer items-center",
          disabled && "disabled"
        ),
        children: [
          /* @__PURE__ */ jsx29(
            "input",
            {
              "data-color": color,
              ref: combinedRef,
              disabled,
              type: "checkbox",
              className: clsx18(
                "p8n-input-checkbox",
                "my-0 mr-1 inline-block h-5 w-5 shrink-0 select-none appearance-none rounded bg-gray-0 bg-origin-border p-0",
                indeterminate && "indeterminate",
                className
              ),
              checked,
              ...rest
            }
          ),
          children
        ]
      }
    );
  }
);

// components/input/RadioGroup.tsx
import { forwardRef as forwardRef15, useId as useId3, useRef as useRef17 } from "react";
import clsx19 from "clsx";
import { jsx as jsx30, jsxs as jsxs12 } from "react/jsx-runtime";
var Radio = forwardRef15(
  ({ disabled = false, color = "yellow", checked, children, name, className, ...rest }, ref) => {
    const inputRef = useRef17(null);
    const combinedRef = useCombinedRefs(inputRef, ref);
    return /* @__PURE__ */ jsxs12("label", { className: clsx19("flex items-center cursor-pointer", disabled && "disabled"), children: [
      /* @__PURE__ */ jsx30(
        "input",
        {
          "data-color": color,
          ref: combinedRef,
          disabled,
          type: "radio",
          className: clsx19(
            "p8n-input-radio",
            "appearance-none p-0 inline-block bg-origin-border select-none shrink-0 cursor-pointer h-5 w-5 bg-gray-0 my-0 mr-1 rounded-full",
            className
          ),
          checked,
          name,
          ...rest
        }
      ),
      children
    ] });
  }
);
var placementVariants = {
  inline: "flex gap-2",
  "inline-grid": "grid gap-2 grid-cols-repeat-fill-160",
  block: ""
};
function RadioGroup({
  value,
  options,
  onChange = () => {
  },
  // onValue = () => {},
  placement = "block",
  disabled = false,
  className,
  color = "yellow"
}) {
  const id = useId3();
  return /* @__PURE__ */ jsx30("div", { className: clsx19(placementVariants[placement]), children: options.map((option) => /* @__PURE__ */ jsx30(
    Radio,
    {
      disabled,
      checked: option.value === value,
      onChange: () => onChange(option.value),
      name: id,
      className,
      color,
      children: option.label
    },
    option.value
  )) });
}

// components/input/Toggle.tsx
import { forwardRef as forwardRef16, useRef as useRef18 } from "react";
import clsx20 from "clsx";
import { jsx as jsx31, jsxs as jsxs13 } from "react/jsx-runtime";
var Toggle = forwardRef16(
  ({
    color = "yellow",
    disabled = false,
    checked,
    className,
    children,
    ...rest
  }, ref) => {
    const inputRef = useRef18(null);
    const combinedRef = useCombinedRefs(inputRef, ref);
    return /* @__PURE__ */ jsxs13(
      "label",
      {
        className: clsx20(
          "flex cursor-pointer items-center",
          disabled && "disabled"
        ),
        children: [
          /* @__PURE__ */ jsx31(
            "input",
            {
              "data-color": color,
              ref: combinedRef,
              disabled,
              type: "checkbox",
              className: clsx20(
                "p8n-input-toggle ll-toggle p8n-input-checkbox relative mr-1 box-border inline-block h-[18px] w-[30px] cursor-pointer appearance-none rounded-xl bg-gray-1 after:absolute after:left-[3px] after:top-[3px] after:h-[12px] after:w-[12px] after:rounded-full after:bg-gray-2 after:outline after:outline-1 after:outline-gray-3 after:transition-all after:duration-100 checked:bg-gray-2 checked:after:translate-x-[12px] checked:after:bg-current checked:after:outline-current",
                className
              ),
              checked,
              ...rest
            }
          ),
          children
        ]
      }
    );
  }
);

// components/input/Range.tsx
import { forwardRef as forwardRef17, useMemo as useMemo4 } from "react";
import clsx21 from "clsx";
import { Fragment, jsx as jsx32, jsxs as jsxs14 } from "react/jsx-runtime";
var trackBase = "pointer-events-none absolute top-0 left-0 h-full";
var Range = forwardRef17(function Range2({
  className,
  value,
  min = 0,
  max = 100,
  color = "yellow",
  showMinMax = true,
  step = 1,
  valuesByTick,
  showValue = true,
  ticks = false,
  formatter = (str) => str.toString(),
  ...rest
}, ref) {
  const range = max - min;
  const percent = (value - min) / range;
  const nbOfTicks = 1 + Math.floor(range / (valuesByTick ?? step ?? 5));
  const cssVars = useMemo4(
    () => ({
      "--p8n-range-c-bg": `var(--color-${color}-2)`,
      "--p8n-range-c-fg": `var(--color-${color}-4)`,
      "--p8n-range-progress-percent": `${percent * 100}%`
    }),
    [color, percent]
  );
  return /* @__PURE__ */ jsxs14("div", { className: clsx21("group relative flex", className), style: cssVars, children: [
    showMinMax && /* @__PURE__ */ jsxs14(Fragment, { children: [
      /* @__PURE__ */ jsx32("div", { className: "absolute left-4 top-6 -translate-x-2/4 text-xs opacity-0 transition-opacity group-hover:opacity-100", children: formatter(min) }),
      /* @__PURE__ */ jsx32("div", { className: "absolute right-4 top-6 translate-x-2/4 text-xs opacity-0 group-hover:opacity-100", children: formatter(max) })
    ] }),
    /* @__PURE__ */ jsx32(
      "div",
      {
        className: clsx21(
          trackBase,
          "bottom-0 right-0 flex items-center justify-center"
        ),
        children: /* @__PURE__ */ jsxs14("div", { className: "relative h-2 w-[calc(100%-2rem)]", children: [
          /* @__PURE__ */ jsx32(
            "div",
            {
              className: clsx21(
                trackBase,
                "track w-full bg-[rgb(var(--p8n-range-c-bg))] after:absolute after:left-[calc(100%-.25rem)] after:h-2 after:w-2 after:rounded-full after:bg-[rgb(var(--p8n-range-c-bg))]"
              )
            }
          ),
          showValue && /* @__PURE__ */ jsx32("div", { className: "pointer-events-none absolute bottom-4 left-[var(--p8n-range-progress-percent)] -translate-x-2/4 text-sm", children: formatter(value) }),
          /* @__PURE__ */ jsx32(
            "div",
            {
              className: clsx21(
                trackBase,
                "w-[var(--p8n-range-progress-percent)] rounded-[3px] bg-[rgb(var(--p8n-range-c-fg))] before:absolute before:-left-1 before:h-2 before:w-2 before:rounded-full before:bg-[rgb(var(--p8n-range-c-fg))]"
              )
            }
          ),
          ticks && /* @__PURE__ */ jsx32(
            "div",
            {
              className: clsx21(
                trackBase,
                "-mx-0.5 flex w-[calc(100%+0.25rem)] items-center justify-between"
              ),
              children: Array.from({ length: nbOfTicks }).map((_, i) => /* @__PURE__ */ jsx32("span", { className: "h-1 w-1 rounded-full bg-gray-0" }, i))
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsx32(
      "input",
      {
        type: "range",
        className: clsx21(
          "h-8 w-full min-w-0 bg-transparent outline-offset-[0.75rem] [&::range-thumb]:h-8 [&::range-thumb]:w-8 [&::range-thumb]:scale-[0.45] [&::range-thumb]:bg-[rgb(var(--p8n-range-c-fg))] [&::range-thumb]:transition-transform [&::range-thumb]:ease-[cubic-bezier(0.16,1,0.3,1)] [&::range-thumb]:hover:scale-[0.55] [&::range-thumb]:active:scale-[0.6] [&::range-track]:h-8"
        ),
        ref,
        min,
        max,
        step,
        value,
        ...rest
      }
    )
  ] });
});

// components/input/Color.tsx
import { forwardRef as forwardRef18, useImperativeHandle as useImperativeHandle3, useRef as useRef19 } from "react";
import clsx22 from "clsx";
import { jsx as jsx33, jsxs as jsxs15 } from "react/jsx-runtime";
var Color = forwardRef18(
  ({
    value,
    withRipple = true,
    color = "yellow",
    label,
    showValue = false,
    className,
    ...rest
  }, ref) => {
    const valueToShow = label ?? (showValue ? value : null);
    const buttonRef = useRef19(null);
    useImperativeHandle3(
      ref,
      () => buttonRef.current
    );
    const ripples = useRipple(buttonRef);
    return /* @__PURE__ */ jsxs15(
      "button",
      {
        ref: buttonRef,
        "data-color": color,
        className: "p8n-input-text relative flex h-8 overflow-clip rounded-2xl p-1 outline-offset-[-1px]",
        ...rest,
        children: [
          withRipple && ripples,
          /* @__PURE__ */ jsx33(
            "span",
            {
              className: clsx22(
                "flex items-center justify-center rounded-2xl px-2",
                valueToShow === null && "min-w-12",
                className
              ),
              style: { backgroundColor: value },
              children: valueToShow
            }
          )
        ]
      }
    );
  }
);

// components/input-field/InputField.tsx
import { forwardRef as forwardRef19, useId as useId4 } from "react";
import { jsx as jsx34, jsxs as jsxs16 } from "react/jsx-runtime";
var defaultElement = Input;
var InputFieldBase = ({ label, hint, help, error, warning, as, ...rest }, ref) => {
  const id = useId4();
  const Element = as || defaultElement;
  const labelElement = label && /* @__PURE__ */ jsx34("span", { className: "font-bold", children: label });
  const hintElement = hint && /* @__PURE__ */ jsx34("span", { className: "ml-auto text-sm text-gray-6", children: hint });
  const errorElement = error && typeof error !== "boolean" && /* @__PURE__ */ jsxs16("span", { className: "font-medium text-red-4 dark:text-red-2", children: [
    /* @__PURE__ */ jsx34("i", { className: "fe-circle-exclamation" }),
    /* @__PURE__ */ jsx34("span", { children: error })
  ] });
  const warningElement = warning && typeof warning !== "boolean" && /* @__PURE__ */ jsxs16("span", { className: "font-medium text-orange-4 dark:text-orange-2", children: [
    /* @__PURE__ */ jsx34("i", { className: "fe-circle-exclamation" }),
    /* @__PURE__ */ jsx34("span", { children: warning })
  ] });
  const color = error ? "red" : warning ? "orange" : "yellow";
  return /* @__PURE__ */ jsxs16("div", { children: [
    label || hint ? /* @__PURE__ */ jsxs16("label", { className: "mb-1 flex items-end", htmlFor: id, children: [
      labelElement,
      hintElement
    ] }) : /* @__PURE__ */ jsx34("label", { htmlFor: id, className: "invisible" }),
    /* @__PURE__ */ jsx34(Element, { ref, id, color, ...rest }),
    /* @__PURE__ */ jsx34("div", { className: "mt-1 text-sm text-gray-6", children: errorElement || warningElement || help })
  ] });
};
InputFieldBase.displayName = "InputField";
var InputField = forwardRef19(InputFieldBase);

// components/modal/useModal.ts
import { useMemo as useMemo5, useState as useState12 } from "react";
import { useClick as useClick3, useDismiss as useDismiss6, useFloating as useFloating6, useInteractions as useInteractions6, useRole as useRole6 } from "@floating-ui/react";
function useModal({
  initialOpen = false,
  open: controlledOpen,
  onOpen: setControlledOpen,
  color = "default"
} = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState12(initialOpen);
  const [labelId, setLabelId] = useState12();
  const [descriptionId, setDescriptionId] = useState12();
  const isUncontrolled = controlledOpen === null || controlledOpen === void 0;
  const open = isUncontrolled ? uncontrolledOpen : controlledOpen;
  const setOpen = isUncontrolled ? setUncontrolledOpen : setControlledOpen;
  const data = useFloating6({
    open,
    onOpenChange: setOpen
  });
  const { context } = data;
  const click = useClick3(context);
  const dismiss = useDismiss6(context);
  const role = useRole6(context);
  const interactions = useInteractions6([click, dismiss, role]);
  return useMemo5(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      color,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId
    }),
    [open, setOpen, interactions, data, color, labelId, descriptionId]
  );
}

// components/modal/useModalContext.ts
import { createContext as createContext5, useContext as useContext6 } from "react";
var ModalContext = createContext5(null);
function useModalContext() {
  const context = useContext6(ModalContext);
  if (context === null) {
    throw new Error("Modal components must be wrapped in <Modal />");
  }
  return context;
}

// components/modal/Modal.tsx
import { jsx as jsx35 } from "react/jsx-runtime";
function Modal({ children, ...options }) {
  const modal = useModal(options);
  return /* @__PURE__ */ jsx35(ModalContext.Provider, { value: modal, children });
}

// components/modal/ModalContent.tsx
import {
  FloatingFocusManager as FloatingFocusManager5,
  FloatingOverlay,
  FloatingPortal as FloatingPortal6,
  useMergeRefs as useMergeRefs7
} from "@floating-ui/react";
import { forwardRef as forwardRef20 } from "react";
import clsx23 from "clsx";
import { jsx as jsx36 } from "react/jsx-runtime";
var ModalContent = forwardRef20(
  ({ style, className, children, ...props }, propRef) => {
    const context = useModalContext();
    const floatingContext = context.context;
    const ref = useMergeRefs7([context.refs.setFloating, propRef]);
    if (!context.open) {
      return null;
    }
    return /* @__PURE__ */ jsx36(FloatingPortal6, { children: /* @__PURE__ */ jsx36(
      FloatingOverlay,
      {
        className: clsx23([
          "z-overlay bg-gray-7/40 flex-center",
          "motion-safe:animate-fade-in-opacity"
        ]),
        lockScroll: true,
        children: /* @__PURE__ */ jsx36(FloatingFocusManager5, { context: floatingContext, children: /* @__PURE__ */ jsx36(
          Dialog,
          {
            className: clsx23(
              "mx-4",
              `border-${context.color}-2`,
              "motion-safe:animate-fade-in",
              className
            ),
            style,
            "aria-labelledby": context.labelId,
            "aria-describedby": context.descriptionId,
            ...context.getFloatingProps(props),
            children: /* @__PURE__ */ jsx36("div", { ref, children })
          }
        ) })
      }
    ) });
  }
);

// components/modal/ModalTrigger.tsx
import { cloneElement as cloneElement4, forwardRef as forwardRef21, isValidElement as isValidElement5 } from "react";
import { useMergeRefs as useMergeRefs8 } from "@floating-ui/react";
import { jsx as jsx37 } from "react/jsx-runtime";
var ModalTrigger = forwardRef21(
  ({ children, asChild = false, ...props }, propRef) => {
    const context = useModalContext();
    const childrenRef = children.ref;
    const ref = useMergeRefs8([context.refs.setReference, propRef, childrenRef]);
    if (asChild && isValidElement5(children)) {
      return cloneElement4(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...children.props,
          "data-state": context.open ? "open" : "closed"
        })
      );
    }
    return /* @__PURE__ */ jsx37(
      Button,
      {
        ref,
        "data-state": context.open ? "open" : "closed",
        ...context.getReferenceProps(props),
        children
      }
    );
  }
);

// components/modal/Components.tsx
import clsx25 from "clsx";

// components/scroll/Scroll.tsx
import { useEffect as useEffect11, useRef as useRef20, useState as useState13 } from "react";
import clsx24 from "clsx";
import { jsx as jsx38, jsxs as jsxs17 } from "react/jsx-runtime";
var TOLERANCE = 5;
var scrollVariants = {
  vertical: {
    inner: "overflow-y-auto h-full",
    shadow: "h-1 left-0 right-0",
    shadowStart: "top-0 bg-gradient-to-b from-gray-8/10",
    shadowEnd: "bottom-0 bg-gradient-to-t from-gray-8/10",
    child: ""
  },
  horizontal: {
    inner: "overflow-x-auto",
    shadow: "w-1 top-0 bottom-0",
    shadowStart: "left-0 bg-gradient-to-r from-gray-8/10",
    shadowEnd: "right-0 bg-gradient-to-l from-gray-8/10",
    child: "inline-block"
  }
};
function Scroll({ horizontal = false, className, children, ...rest }) {
  const [showStartShadow, setShowStartShadow] = useState13(false);
  const [showEndShadow, setShowEndShadow] = useState13(false);
  const scrollChildRef = useRef20(null);
  const scrollContainerRef = useRef20(null);
  const position = horizontal ? "horizontal" : "vertical";
  const setShadows = (container, child) => {
    if (!container || !child) {
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();
    const isOnStartEdge = horizontal ? containerRect.left - childRect.left < TOLERANCE : containerRect.top - childRect.top < TOLERANCE;
    const isOnEndEdge = horizontal ? childRect.right - containerRect.right < TOLERANCE : childRect.bottom - containerRect.bottom < TOLERANCE;
    setShowStartShadow(
      (previousShowStartShadow) => isOnStartEdge === previousShowStartShadow ? !previousShowStartShadow : previousShowStartShadow
    );
    setShowEndShadow(
      (previousShowEndShadow) => isOnEndEdge === previousShowEndShadow ? !previousShowEndShadow : previousShowEndShadow
    );
  };
  useEffect11(() => {
    const resizeObserver = new ResizeObserver(() => {
      setShadows(scrollContainerRef.current, scrollChildRef.current);
    });
    resizeObserver.observe(scrollChildRef.current);
    resizeObserver.observe(scrollContainerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  });
  function handleScroll(event) {
    if (!scrollChildRef?.current) {
      return;
    }
    setShadows(event.currentTarget, scrollChildRef.current);
  }
  return /* @__PURE__ */ jsxs17("div", { className: clsx24("ll-scroll-zone", "relative", className), ...rest, children: [
    /* @__PURE__ */ jsx38(
      "div",
      {
        className: clsx24(
          "scroll-shadow z-[1] absolute opacity-0 transition-all",
          scrollVariants[position].shadow,
          scrollVariants[position].shadowStart,
          showStartShadow && "opacity-100"
        )
      }
    ),
    /* @__PURE__ */ jsx38(
      "div",
      {
        className: clsx24(
          "scroll-shadow z-[1] absolute opacity-0 transition-all",
          scrollVariants[position].shadow,
          scrollVariants[position].shadowEnd,
          showEndShadow && "opacity-100"
        )
      }
    ),
    /* @__PURE__ */ jsx38(
      "div",
      {
        className: scrollVariants[position].inner,
        ref: scrollContainerRef,
        onScroll: handleScroll,
        children: /* @__PURE__ */ jsx38("div", { className: scrollVariants[position].child, ref: scrollChildRef, children })
      }
    )
  ] });
}

// components/modal/Components.tsx
import { Fragment as Fragment2, jsx as jsx39, jsxs as jsxs18 } from "react/jsx-runtime";
function ModalHeader({
  children,
  className,
  closeButton = true,
  ...props
}) {
  const { setOpen } = useModalContext();
  return /* @__PURE__ */ jsxs18(Fragment2, { children: [
    closeButton && /* @__PURE__ */ jsx39("div", { className: "float-right p-1", children: /* @__PURE__ */ jsx39(
      Button,
      {
        icon: true,
        variant: "text",
        color: "gray",
        onClick: () => setOpen(false),
        children: /* @__PURE__ */ jsx39("i", { className: "fe-cancel" })
      }
    ) }),
    /* @__PURE__ */ jsx39(
      "header",
      {
        className: clsx25("flex items-center px-2 pt-2", className),
        ...props,
        children: /* @__PURE__ */ jsx39("h4", { className: "font-semibold leading-6", children })
      }
    )
  ] });
}
function ModalDescription({
  children,
  className,
  height,
  ...props
}) {
  if (!height) {
    return /* @__PURE__ */ jsx39("div", { className: clsx25("p-2", className), ...props, children });
  }
  return /* @__PURE__ */ jsx39("div", { className: clsx25("py-2", className), ...props, children: /* @__PURE__ */ jsx39(Scroll, { style: { height: `${height}px` }, children }) });
}
function ModalFooter({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx39("footer", { className: clsx25("relative z-10 px-2 pb-2", className), ...props, children });
}

// components/notification/NotificationsProvider.tsx
import { useEffect as useEffect13, useRef as useRef21, useState as useState14 } from "react";
import { createPortal } from "react-dom";

// components/notification/NotificationsContext.ts
import { createContext as createContext6 } from "react";
function createNotificationsManager(setNotifications) {
  let idx = 1;
  const timeoutIds = /* @__PURE__ */ new Map();
  const removeNotification = (id) => {
    const timeoutId = timeoutIds.get(id);
    if (!timeoutId) {
      return;
    }
    clearTimeout(timeoutId);
    timeoutIds.delete(id);
    return setNotifications((oldNotifications) => {
      return oldNotifications.filter(({ id: otherId }) => id !== otherId);
    });
  };
  const addNotification = (content = "", {
    expiration = 5e3,
    color = "yellow",
    canClose = true,
    withLoader = false
  } = {}) => {
    const id = (idx++).toString();
    if (timeoutIds.has(id)) {
      throw new Error("notification already exists");
    }
    setNotifications((oldNotifications) => {
      const newNotification = {
        id,
        content,
        expiration,
        color,
        canClose,
        withLoader
      };
      return [newNotification, ...oldNotifications];
    });
    timeoutIds.set(
      id,
      expiration === -1 ? -1 : setTimeout(() => removeNotification(id), expiration)
    );
    return id;
  };
  const notifyError = (err) => {
    const errorMessage = parseError(err);
    if (errorMessage) {
      addNotification(...errorMessage);
    } else {
      throw err;
    }
  };
  return {
    addNotification,
    removeNotification,
    notifyError
  };
}
var NotificationsContext = createContext6(
  null
);

// components/snack/Snack.tsx
import clsx26 from "clsx";
import { useEffect as useEffect12 } from "react";
import { jsx as jsx40, jsxs as jsxs19 } from "react/jsx-runtime";
function Snack({
  expiration = 5e3,
  content = "",
  color = "yellow",
  withLoader = false,
  canClose = false,
  onRemove = () => {
  }
}) {
  const onRemoveStable = useEventCallback(onRemove);
  useEffect12(() => {
    if (expiration === -1) {
      return;
    }
    const timeoutId = setTimeout(() => onRemoveStable(), expiration);
    return () => void clearTimeout(timeoutId);
  }, [onRemoveStable, expiration]);
  return /* @__PURE__ */ jsx40(
    Dialog,
    {
      className: clsx26(
        "pointer-events-auto motion-safe:animate-fade-in",
        "ll-snack"
      ),
      placement: "top",
      color,
      children: /* @__PURE__ */ jsxs19("div", { className: "flex w-fit min-w-60 items-center px-2 py-1", children: [
        /* @__PURE__ */ jsx40("span", { className: "flex-1 pr-4", children: content }),
        withLoader && /* @__PURE__ */ jsx40(Loader, { size: "small", color: "gray" }),
        canClose && /* @__PURE__ */ jsx40(Button, { icon: true, variant: "text", color: "gray", onClick: onRemove, children: /* @__PURE__ */ jsx40("i", { className: "fe-cancel" }) })
      ] })
    }
  );
}

// components/notification/NotificationsProvider.tsx
import { Fragment as Fragment3, jsx as jsx41, jsxs as jsxs20 } from "react/jsx-runtime";
import { createElement as createElement2 } from "react";
function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState14([]);
  const container = useRef21(null);
  if (!container.current) {
    container.current = document.createElement("div");
    container.current.id = Math.floor(Math.random() * 1e5).toString();
    container.current.classList.add(
      "fixed",
      "bottom-0",
      "left-0",
      "right-0",
      "z-notification",
      "pointer-events-none"
    );
    document.body.append(container.current);
  }
  useEffect13(() => {
    return () => {
      container.current && container.current.remove();
    };
  }, []);
  const managerRef = useRef21();
  if (!managerRef.current) {
    managerRef.current = createNotificationsManager(setNotifications);
  }
  const manager = managerRef.current;
  return /* @__PURE__ */ jsxs20(Fragment3, { children: [
    /* @__PURE__ */ jsx41(NotificationsContext.Provider, { value: manager, children }),
    createPortal(
      /* snack-bar-inner */
      /* @__PURE__ */ jsx41("div", { className: "mx-4 mb-4 flex flex-col items-center gap-4", children: notifications.map((props) => /* @__PURE__ */ createElement2(
        Snack,
        {
          ...props,
          key: props.id,
          onRemove: () => manager.removeNotification(props.id)
        }
      )) }),
      container.current
    )
  ] });
}

// components/notification/useContextNotifications.tsx
import { useContext as useContext7 } from "react";
var useContextNotifications = () => {
  const manager = useContext7(NotificationsContext);
  if (!manager) {
    throw new Error("Trying to use uninitialized NotificationsContext");
  }
  return manager;
};

// components/notification/useFetch.ts
import { useCallback as useCallback10 } from "react";
var useFetch = () => {
  const notificationManager = useContextNotifications();
  const appFetch = useCallback10(
    async (urlObjOrString, enhancedOptions = {}) => {
      try {
        return await fetchAPI(urlObjOrString, enhancedOptions);
      } catch (err) {
        notificationManager.notifyError(err);
      }
    },
    [notificationManager]
  );
  return appFetch;
};

// components/popover/Popover.tsx
import { jsx as jsx42 } from "react/jsx-runtime";
function Popover({ children, ...options }) {
  const popover = usePopover(options);
  return /* @__PURE__ */ jsx42(PopoverContext.Provider, { value: popover, children });
}

// components/popover/PopoverContent.tsx
import { forwardRef as forwardRef22 } from "react";
import {
  FloatingFocusManager as FloatingFocusManager6,
  FloatingPortal as FloatingPortal7,
  useMergeRefs as useMergeRefs9
} from "@floating-ui/react";
import clsx27 from "clsx";
import { jsx as jsx43, jsxs as jsxs21 } from "react/jsx-runtime";
var PopoverContent = forwardRef22(
  ({ style, children, className, ...props }, propRef) => {
    const context = usePopoverContext();
    const floatingContext = context.context;
    const ref = useMergeRefs9([context.refs.setFloating, propRef]);
    if (!context.open) {
      return null;
    }
    return /* @__PURE__ */ jsx43(FloatingPortal7, { children: /* @__PURE__ */ jsx43(FloatingFocusManager6, { context: floatingContext, modal: context.modal, children: /* @__PURE__ */ jsx43(
      "div",
      {
        className: "outline-none",
        ref,
        style: { ...context.floatingStyles, ...style },
        "aria-labelledby": context.labelId,
        "aria-describedby": context.descriptionId,
        ...context.getFloatingProps(props),
        children: /* @__PURE__ */ jsxs21(
          Dialog,
          {
            placement: context.placement,
            color: context.color,
            className: clsx27("motion-safe:animate-fade-in-list", className),
            children: [
              children,
              /* @__PURE__ */ jsx43(
                "div",
                {
                  ref: context.arrowRef,
                  style: computeArrowStyle(context),
                  className: "p8n-arrow"
                }
              )
            ]
          }
        )
      }
    ) }) });
  }
);

// components/popover/PopoverTrigger.tsx
import { cloneElement as cloneElement5, forwardRef as forwardRef23, isValidElement as isValidElement6 } from "react";
import { useMergeRefs as useMergeRefs10 } from "@floating-ui/react";
import { jsx as jsx44 } from "react/jsx-runtime";
var PopoverTrigger = forwardRef23(
  ({ children, asChild = false, ...props }, propRef) => {
    const context = usePopoverContext();
    const childrenRef = children.ref;
    const ref = useMergeRefs10([context.refs.setReference, propRef, childrenRef]);
    if (asChild && isValidElement6(children)) {
      return cloneElement5(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...children.props,
          "data-state": context.open ? "open" : "closed"
        })
      );
    }
    return /* @__PURE__ */ jsx44(
      Button,
      {
        variant: "outlined",
        ref,
        "data-state": context.open ? "open" : "closed",
        ...context.getReferenceProps(props),
        children
      }
    );
  }
);

// components/popover/usePopover.tsx
import { useMemo as useMemo6, useRef as useRef22, useState as useState15 } from "react";
import {
  arrow as arrow2,
  autoUpdate as autoUpdate6,
  flip as flip6,
  offset as offset6,
  shift as shift5,
  useClick as useClick4,
  useDismiss as useDismiss7,
  useFloating as useFloating7,
  useInteractions as useInteractions7,
  useRole as useRole7
} from "@floating-ui/react";
var arrowWidth3 = 12;
function usePopover({
  initialOpen = false,
  placement = "bottom",
  open: controlledOpen,
  onOpen: setControlledOpen,
  color,
  modal = false
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState15(initialOpen);
  const [labelId, setLabelId] = useState15();
  const [descriptionId, setDescriptionId] = useState15();
  const isUncontrolled = controlledOpen === null || controlledOpen === void 0;
  const open = isUncontrolled ? uncontrolledOpen : controlledOpen;
  const setOpen = isUncontrolled ? setUncontrolledOpen : setControlledOpen;
  const arrowRef = useRef22(null);
  const offsetVal = arrowWidth3 / 2;
  const data = useFloating7({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate6,
    middleware: [
      offset6(offsetVal),
      flip6(),
      shift5({ padding: 5 }),
      arrow2({
        element: arrowRef,
        padding: 12
      })
    ]
  });
  const { context } = data;
  const click = useClick4(context, {
    // TODO verify if use case to disable it
    // enabled: isUncontrolled,
  });
  const dismiss = useDismiss7(context);
  const role = useRole7(context);
  const interactions = useInteractions7([click, dismiss, role]);
  return useMemo6(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      arrowRef,
      color,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId
    }),
    [open, setOpen, interactions, data, color, modal, labelId, descriptionId]
  );
}

// components/popover/usePopoverContext.ts
import { createContext as createContext7, useContext as useContext8 } from "react";
var PopoverContext = createContext7(null);
function usePopoverContext() {
  const context = useContext8(PopoverContext);
  if (context === null) {
    throw new Error("Popover components must be wrapped in <Popover />");
  }
  return context;
}

// components/popover/Components.tsx
import clsx28 from "clsx";
import { Fragment as Fragment4, jsx as jsx45, jsxs as jsxs22 } from "react/jsx-runtime";
function PopoverHeader({
  children,
  closeButton = true,
  className,
  ...props
}) {
  const { setOpen } = usePopoverContext();
  return /* @__PURE__ */ jsxs22(Fragment4, { children: [
    closeButton && /* @__PURE__ */ jsx45("div", { className: "float-right p-1", children: /* @__PURE__ */ jsx45(
      Button,
      {
        icon: true,
        variant: "text",
        color: "gray",
        onClick: () => setOpen(false),
        children: /* @__PURE__ */ jsx45("i", { className: "fe-cancel" })
      }
    ) }),
    /* @__PURE__ */ jsx45(
      "header",
      {
        className: clsx28("flex items-center px-2 pt-2", className),
        ...props,
        children: /* @__PURE__ */ jsx45("h4", { className: "font-semibold leading-6", children })
      }
    )
  ] });
}
function PopoverDescription({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx45("div", { className: clsx28("p-2", className), ...props, children });
}
function PopoverFooter({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx45("footer", { className: clsx28("relative z-10 px-2 pb-2", className), ...props, children });
}

// components/portal/Portal.tsx
import ReactDOM from "react-dom";
var Portal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

// components/resize-area/ResizeArea.tsx
import { useCallback as useCallback11, useEffect as useEffect14 } from "react";
import clsx29 from "clsx";
import { jsx as jsx46 } from "react/jsx-runtime";
function ResizeArea({
  name,
  position,
  initialValue,
  className,
  ...rest
}) {
  useEffect14(() => {
    const cssVarName = `--sidebar-${name}-${["top", "bottom"].includes(position) ? "height" : "width"}`;
    if (initialValue) {
      document.documentElement.style.setProperty(
        cssVarName,
        `${initialValue}px`
      );
    }
  }, []);
  useEffect14(() => {
    const cssVarName = `--sidebar-${name}-${["top", "bottom"].includes(position) ? "height" : "width"}`;
    return () => {
      document.documentElement.style.removeProperty(cssVarName);
    };
  }, [name, position]);
  const handlePointerMove = useCallback11(
    (e) => {
      const cssVarName = `--sidebar-${name}-${["top", "bottom"].includes(position) ? "height" : "width"}`;
      let cssVarValue;
      switch (position) {
        case "top":
          cssVarValue = document.documentElement.clientHeight - e.pageY;
          break;
        case "right":
          cssVarValue = e.pageX;
          break;
        case "left":
          cssVarValue = document.documentElement.clientWidth - e.pageX;
          break;
        case "bottom":
          cssVarValue = e.pageY;
          break;
      }
      document.documentElement.style.setProperty(
        cssVarName,
        `${cssVarValue}px`
      );
      return () => {
        document.documentElement.style.removeProperty(cssVarName);
      };
    },
    [name, position]
  );
  const handlePointerUp = useCallback11(() => {
    const handler = handlePointerMove;
    document.removeEventListener("pointermove", handler);
    document.documentElement.classList.remove(
      "cursor-row-resize",
      "cursor-col-resize"
    );
    return () => {
      document.removeEventListener("pointermove", handler);
    };
  }, [handlePointerMove]);
  function handlePointerDown() {
    document.addEventListener("pointerup", handlePointerUp, { once: true });
    document.addEventListener("pointermove", handlePointerMove);
    if (["top", "bottom"].includes(position)) {
      document.documentElement.classList.add(`cursor-row-resize`);
    } else {
      document.documentElement.classList.add(`cursor-col-resize`);
    }
  }
  return /* @__PURE__ */ jsx46("div", { className: clsx29(["p8n-resize-area", position, className]), ...rest, children: /* @__PURE__ */ jsx46(
    "button",
    {
      className: "area-button",
      type: "button",
      onPointerDown: handlePointerDown
    }
  ) });
}

// components/select/SelectOption.tsx
import { useListItem as useListItem5 } from "@floating-ui/react";
import clsx30 from "clsx";
import { jsx as jsx47 } from "react/jsx-runtime";
function SelectOption({ label }) {
  const { activeIndex, selectedIndex, getItemProps, handleSelect } = useSelect();
  const { ref, index } = useListItem5({ label });
  const isActive = activeIndex === index;
  const isSelected = selectedIndex === index;
  return /* @__PURE__ */ jsx47(
    "button",
    {
      className: clsx30("option", isSelected ? "bg-gray-2" : isActive && "bg-gray-1"),
      ref,
      role: "option",
      "aria-selected": isActive && isSelected,
      tabIndex: isActive ? 0 : -1,
      ...getItemProps({
        onClick: () => handleSelect(index)
      }),
      children: label
    }
  );
}

// components/select/SelectSelection.tsx
import { jsx as jsx48 } from "react/jsx-runtime";
function SelectSelection({
  label,
  multiple = false
}) {
  return multiple ? /* @__PURE__ */ jsx48(Badge, { className: "ml-1", children: label }) : /* @__PURE__ */ jsx48("span", { children: label });
}

// components/select/Select.tsx
import {
  forwardRef as forwardRef24,
  useCallback as useCallback12,
  useEffect as useEffect15,
  useMemo as useMemo7,
  useRef as useRef23,
  useState as useState16
} from "react";
import {
  FloatingFocusManager as FloatingFocusManager7,
  FloatingList as FloatingList4,
  FloatingPortal as FloatingPortal8,
  autoUpdate as autoUpdate7,
  flip as flip7,
  offset as offset7,
  size as size3,
  useClick as useClick5,
  useDismiss as useDismiss8,
  useFloating as useFloating8,
  useInteractions as useInteractions8,
  useListNavigation as useListNavigation5,
  useMergeRefs as useMergeRefs11,
  useRole as useRole8,
  useTypeahead as useTypeahead4
} from "@floating-ui/react";
import clsx31 from "clsx";
import { jsx as jsx49, jsxs as jsxs23 } from "react/jsx-runtime";
import { createElement as createElement3 } from "react";
function defaultGetSearchableValue(matchReg, option) {
  return matchReg.test(option.label.toLowerCase().trim());
}
var Select = forwardRef24(
  ({
    variant = "normal",
    disabled = false,
    showArrow = true,
    selectionClassName,
    width = "100%",
    floatingMinWidth = 130,
    placement = "bottom",
    searchable = false,
    required = true,
    value = null,
    onChange,
    placeholder = "Select ...",
    getSearchableValue,
    selectSelectionComponent: SelectSelectionCustomComponent,
    selectOptionComponent: SelectOptionCustomComponent,
    options = [],
    zIndex
  }, propRef) => {
    const onChangeStable = useEventCallback(onChange);
    const [search, setSearch] = useState16("");
    const filteredOptions = useMemo7(
      () => options.filter((option) => {
        if (!searchable || search.trim() === "") {
          return true;
        }
        const fn = getSearchableValue ?? defaultGetSearchableValue;
        const matchReg = new RegExp(search.toLowerCase().trim());
        return fn(matchReg, option);
      }),
      [searchable, search, getSearchableValue, options]
    );
    let selectedIndex = null;
    if (value !== null) {
      const pos = filteredOptions.findIndex((o) => o.value === value);
      if (pos !== -1) {
        selectedIndex = pos;
      }
    }
    const [isOpen, setIsOpen] = useState16(false);
    const [activeIndex, setActiveIndex] = useState16(null);
    const [searchHasFocus, setSearchHasFocus] = useState16(false);
    const SelectSelectionComponent = SelectSelectionCustomComponent ?? SelectSelection;
    function handleSearchChange(e) {
      setActiveIndex(null);
      setSearch(e.target.value);
    }
    const { refs, floatingStyles, context } = useFloating8({
      placement,
      open: isOpen,
      onOpenChange: setIsOpen,
      whileElementsMounted: autoUpdate7,
      middleware: [
        offset7(5),
        flip7({ padding: 10 }),
        size3({
          apply({ rects, elements, availableHeight }) {
            Object.assign(elements.floating.style, {
              width: `${Math.max(floatingMinWidth, rects.reference.width)}px`
            });
            const firstChild = elements.floating.firstElementChild;
            if (firstChild) {
              firstChild.style.maxHeight = `${Math.min(availableHeight, 300)}px`;
            }
          },
          padding: 10
        })
      ]
    });
    const ref = useMergeRefs11([refs.setReference, propRef]);
    const listRef = useRef23([]);
    const labelsRef = useRef23([]);
    const isTypingRef = useRef23(false);
    const click = useClick5(context, { event: "mousedown" });
    const dismiss = useDismiss8(context);
    const role = useRole8(context, { role: "listbox" });
    const listNav = useListNavigation5(context, {
      listRef,
      activeIndex,
      focusItemOnHover: searchable ? false : true,
      selectedIndex,
      onNavigate: setActiveIndex,
      loop: true
    });
    const typeahead = useTypeahead4(context, {
      enabled: !searchHasFocus,
      listRef: labelsRef,
      activeIndex,
      selectedIndex,
      onMatch: isOpen ? setActiveIndex : void 0,
      onTypingChange(isTyping) {
        isTypingRef.current = isTyping;
      }
    });
    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions8([listNav, typeahead, click, dismiss, role]);
    useEffect15(() => {
      if (SelectOptionCustomComponent) {
        return;
      }
      filteredOptions.map((option, i) => {
        labelsRef.current[i] = option.label;
      });
    }, [search, filteredOptions, SelectOptionCustomComponent]);
    const handleSelect = useCallback12(
      (index) => {
        setIsOpen(false);
        setSearch("");
        const event = {
          target: {
            value: index === null ? null : filteredOptions[index].value
          }
        };
        onChangeStable(event);
      },
      [onChangeStable, filteredOptions]
    );
    const selectContext = useMemo7(
      () => ({
        activeIndex,
        selectedIndex,
        getItemProps,
        handleSelect
      }),
      [activeIndex, selectedIndex, getItemProps, handleSelect]
    );
    const showCancelButton = !required && selectedIndex !== null;
    return /* @__PURE__ */ jsxs23("div", { children: [
      /* @__PURE__ */ jsxs23(
        "div",
        {
          className: clsx31(
            // "selection",
            "flex cursor-pointer rounded-2xl outline outline-1 outline-offset-[-1px] hover:outline-gray-3 focus-full:outline-2 focus-full:outline-yellow-4",
            variant === "normal" ? "outline-gray-2" : "outline-transparent",
            selectionClassName,
            isOpen && "focus",
            disabled && "disabled"
          ),
          ref,
          tabIndex: 0,
          style: {
            width: typeof width === "number" ? `${width}px` : width
          },
          ...getReferenceProps(),
          children: [
            /* @__PURE__ */ jsx49("span", { className: clsx31("flex h-8 flex-1 items-center px-2"), children: selectedIndex !== null ? /* @__PURE__ */ createElement3(
              SelectSelectionComponent,
              {
                ...filteredOptions[selectedIndex],
                key: selectedIndex
              }
            ) : placeholder }),
            showCancelButton && /* @__PURE__ */ jsx49(
              Button,
              {
                withRipple: false,
                icon: true,
                variant: "text",
                color: "gray",
                onMouseDown: (e) => {
                  e.stopPropagation();
                },
                onClick: () => {
                  handleSelect(null);
                },
                children: /* @__PURE__ */ jsx49("i", { className: "fe-cancel" })
              }
            ),
            !showCancelButton && showArrow && /* @__PURE__ */ jsx49(
              Button,
              {
                color: "gray",
                withRipple: false,
                icon: true,
                variant: "text",
                focusable: false,
                children: /* @__PURE__ */ jsx49("i", { className: isOpen ? "fe-angle-up" : "fe-angle-down" })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx49(FloatingPortal8, { children: /* @__PURE__ */ jsx49(SelectContext.Provider, { value: selectContext, children: isOpen && /* @__PURE__ */ jsx49(FloatingFocusManager7, { context, modal: false, children: /* @__PURE__ */ jsx49(
        "div",
        {
          className: "z-dialog outline-none",
          "data-testid": "select-list",
          ref: refs.setFloating,
          style: {
            ...floatingStyles,
            zIndex
          },
          ...getFloatingProps(),
          children: /* @__PURE__ */ jsxs23(
            Dialog,
            {
              placement: context.placement,
              className: "max-h-80 overflow-auto motion-safe:animate-fade-in-list",
              children: [
                searchable && /* @__PURE__ */ jsx49("div", { className: "p-2", children: /* @__PURE__ */ jsx49(
                  Input,
                  {
                    color: "gray",
                    placeholder: "Search",
                    tabIndex: selectedIndex === null ? 0 : -1,
                    value: search,
                    onChange: handleSearchChange,
                    onFocus: () => setSearchHasFocus(true),
                    onBlur: () => setSearchHasFocus(false)
                  }
                ) }),
                SelectOptionCustomComponent ? /* @__PURE__ */ jsx49(FloatingList4, { elementsRef: listRef, labelsRef, children: filteredOptions.map((option) => /* @__PURE__ */ createElement3(
                  SelectOptionCustomComponent,
                  {
                    ...option,
                    key: option.value
                  }
                )) }) : filteredOptions.map((option, index) => {
                  const isActive = activeIndex === index;
                  const isSelected = selectedIndex === index;
                  return /* @__PURE__ */ jsx49(
                    "button",
                    {
                      className: clsx31(
                        "option",
                        isSelected ? "bg-gray-2" : isActive && "bg-gray-1"
                      ),
                      role: "option",
                      "aria-selected": isActive && isSelected,
                      tabIndex: isActive ? 0 : -1,
                      ref: (node) => {
                        listRef.current[index] = node;
                      },
                      ...getItemProps({
                        onClick: () => handleSelect(index)
                      }),
                      children: option.label
                    },
                    option.value
                  );
                })
              ]
            }
          )
        }
      ) }) }) })
    ] });
  }
  // see : React with Typescript -- Generics while using React.forwardRef
  // https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
);

// components/select/useSelectContext.ts
import { createContext as createContext8, useContext as useContext9 } from "react";
var SelectContext = createContext8(null);
function useSelect() {
  const context = useContext9(SelectContext);
  if (context === null) {
    throw new Error("Select components must be wrapped in <Select>");
  }
  return context;
}

// components/sortable/Sortable.tsx
import { useMemo as useMemo8 } from "react";
import {
  ReactSortable
} from "react-sortablejs";
import { jsx as jsx50 } from "react/jsx-runtime";
function Sortable({
  children,
  list,
  setList,
  ...rest
}) {
  const mutableList = useMemo8(() => {
    return list.map((item) => ({ ...item }));
  }, [list]);
  function handleList(updatedList, sortable, store) {
    if (!arrayEquals(
      updatedList.map((l) => l.id),
      mutableList.map((l) => l.id)
    )) {
      setList(updatedList, sortable, store);
    }
  }
  return /* @__PURE__ */ jsx50(ReactSortable, { list: mutableList, setList: handleList, ...rest, children });
}

// components/steps/Step.tsx
import clsx32 from "clsx";
import { jsx as jsx51, jsxs as jsxs24 } from "react/jsx-runtime";
function Step({
  status = "todo",
  className,
  children,
  markerClassName,
  contentClassName,
  align = "start",
  icon = null,
  ...rest
}) {
  return /* @__PURE__ */ jsxs24("li", { className: clsx32(["ll-step", `status-${status}`, `align-${align}`, className]), ...rest, children: [
    /* @__PURE__ */ jsx51("div", { className: "marker-container", children: /* @__PURE__ */ jsx51(
      "div",
      {
        className: clsx32([
          "marker",
          "relative z-[1] inline-flex items-center justify-center rounded-full ",
          ["done", "current"].includes(status) && "active",
          markerClassName
        ]),
        children: icon
      }
    ) }),
    /* @__PURE__ */ jsx51("div", { className: clsx32(["content", contentClassName]), children })
  ] });
}

// components/steps/Steps.tsx
import clsx33 from "clsx";
import { jsx as jsx52 } from "react/jsx-runtime";
function Steps({
  direction = "vertical",
  lineStyle = "solid",
  markerType = "circle",
  associateLineWithStep = true,
  className,
  ...rest
}) {
  return /* @__PURE__ */ jsx52(
    "ul",
    {
      ...rest,
      className: clsx33(["ll-steps", className]),
      "data-global-line": (!associateLineWithStep).toString(),
      "data-direction": direction,
      "data-marker": markerType,
      style: {
        "--line-style": lineStyle,
        "--line-space": associateLineWithStep ? "4px" : "0px"
        // "--step-circle-radius": markerType === "circle" ? "18px" : "9px",
      }
    }
  );
}

// components/steps/util.ts
function getIndexLetter(index) {
  return String.fromCharCode(65 + index % 26);
}

// components/table/Table.tsx
import { jsx as jsx53 } from "react/jsx-runtime";
function Table({ children, ...props }) {
  return /* @__PURE__ */ jsx53("table", { className: "w-full", ...props, children });
}

// components/table/TableBody.tsx
import { jsx as jsx54 } from "react/jsx-runtime";
function TableBody({ children, ...props }) {
  return /* @__PURE__ */ jsx54("tbody", { ...props, children });
}

// components/table/TableCell.tsx
import clsx34 from "clsx";
import { jsx as jsx55, jsxs as jsxs25 } from "react/jsx-runtime";
function TableCell({ children, className, label, ...props }) {
  return /* @__PURE__ */ jsxs25("td", { className: clsx34("p-2 block lg:table-cell", className), ...props, children: [
    label && /* @__PURE__ */ jsx55("p", { className: "font-medium text-sm text-gray-6 lg:hidden", children: label }),
    children
  ] });
}

// components/table/TableHeader.tsx
import clsx35 from "clsx";
import { jsx as jsx56 } from "react/jsx-runtime";
function TableHeader({ children, className, ...props }) {
  return /* @__PURE__ */ jsx56("thead", { className: clsx35("hidden lg:table-header-group", className), ...props, children });
}

// components/table/TableHeaderCell.tsx
import clsx36 from "clsx";
import { jsx as jsx57 } from "react/jsx-runtime";
function TableHeaderCell({ children, className, ...props }) {
  return /* @__PURE__ */ jsx57("th", { className: clsx36("text-left font-bold p-2", className), ...props, children });
}

// components/table/TableRow.tsx
import clsx37 from "clsx";
import { jsx as jsx58 } from "react/jsx-runtime";
function TableRow({ children, className, ...props }) {
  return /* @__PURE__ */ jsx58("tr", { className: clsx37("border-b border-gray-3 block lg:table-row", className), ...props, children });
}

// components/table/TableFooter.tsx
import { jsx as jsx59 } from "react/jsx-runtime";
function TableFooter({ children, ...props }) {
  return /* @__PURE__ */ jsx59("tfoot", { ...props, children });
}

// components/tabs/Tabs.tsx
import clsx38 from "clsx";
import { jsx as jsx60, jsxs as jsxs26 } from "react/jsx-runtime";
function Tabs({
  className,
  listClassName,
  contentClassName,
  tabs = [],
  value,
  onChange,
  fullWidth = false,
  stickyTabs = false,
  children
}) {
  const content = tabs.find((t) => t.id === value)?.content;
  return /* @__PURE__ */ jsxs26(
    "div",
    {
      className: clsx38("ll-tabs overflow-hidden bg-gray-2 shadow", className),
      children: [
        /* @__PURE__ */ jsxs26(
          "div",
          {
            role: "tablist",
            className: clsx38(
              "tabs-list flex",
              stickyTabs && "sticky top-0 z-[1]",
              listClassName
            ),
            children: [
              tabs.map(({ title, id }) => {
                return /* @__PURE__ */ jsx60(
                  "div",
                  {
                    className: clsx38(
                      "tabs-list-item border-t-4 hover:text-gray-7",
                      fullWidth && "flex-1 text-center",
                      value === id ? "border-t-yellow-3 bg-gray-0 text-gray-7" : "border-t-transparent text-gray-6"
                    ),
                    children: /* @__PURE__ */ jsx60(
                      "button",
                      {
                        className: "w-full px-2 py-1 focus-visible:outline-offset-0",
                        onClick: (event) => {
                          event.stopPropagation();
                          event.preventDefault();
                          onChange(id);
                        },
                        children: title
                      }
                    )
                  },
                  id
                );
              }),
              children && /* @__PURE__ */ jsx60("div", { className: "extra ml-auto mr-2 flex items-center", children })
            ]
          }
        ),
        /* @__PURE__ */ jsx60("div", { className: clsx38("bg-gray-0 p-2 shadow", contentClassName), children: content })
      ]
    }
  );
}

// components/textarea/Textarea.tsx
import clsx39 from "clsx";
import { forwardRef as forwardRef25 } from "react";
import { jsx as jsx61 } from "react/jsx-runtime";
var Textarea = forwardRef25(
  function Textarea2({
    variant = "normal",
    color = "yellow",
    disabled = false,
    className,
    ...rest
  }, ref) {
    return /* @__PURE__ */ jsx61(
      "textarea",
      {
        "data-color": color,
        "data-variant": variant,
        ref,
        className: clsx39(
          "p8n-textarea min-w-0 appearance-none rounded-2xl bg-transparent p-2 outline-offset-[-1px] filter-none",
          disabled && "disabled",
          className
        ),
        disabled,
        ...rest
      }
    );
  }
);

// tailwind/keyframes.ts
var keyframes = {
  ripple: {
    to: {
      transform: "scale(4)",
      opacity: "0"
    }
  },
  "fade-in": {
    from: {
      transform: "scale(.8)",
      opacity: "0"
    },
    to: {
      transform: "scale(1)",
      opacity: "1"
    }
  },
  "fade-in-list": {
    from: {
      transform: "scaleY(.8)",
      opacity: "0"
    },
    to: {
      transform: "scaleY(1)",
      opacity: "1"
    }
  },
  "fade-out": {
    from: {
      transform: "scale(1)",
      opacity: "1"
    },
    to: {
      transform: "scale(.8)",
      opacity: "0"
    }
  },
  "fade-in-opacity": {
    from: {
      opacity: "0"
    },
    to: {
      opacity: "1"
    }
  },
  flash: {
    "0%": {
      opacity: "0"
    },
    "50%": {
      opacity: "1"
    },
    "100%": {
      opacity: "0"
    }
  },
  "loader-stroke": {
    from: {
      // check : packages/pentatrion-design/components/loader/Loader.tsx
      // for dashoffset value
      "stroke-dashoffset": "43.699"
    },
    to: {
      "stroke-dashoffset": "0"
    }
  }
};

// tailwind/pentatrionTw.ts
import plugin from "tailwindcss/plugin";
import defaultTheme from "tailwindcss/defaultTheme";

// tailwind/vars.ts
var vars = {
  ":root": {
    "--color-white": "255 255 255",
    "--color-black": "0 0 0",
    /* bg outlined color */
    "--color-yellow-1": "255 250 199",
    /* bg outlined hovered color */
    "--color-yellow-2": "255 245 142",
    // /* button default bgcolor */
    "--color-yellow-3": "255 232 34",
    // /* text color, button hover bgcolor */
    "--color-yellow-4": "251 191 36",
    // /* text hover color, button active bgcolor */
    "--color-yellow-5": "245 158 11",
    "--color-yellow-text": "var(--color-gray-7)",
    "--color-green-1": "232 245 212",
    "--color-green-2": "209 235 170",
    "--color-green-3": "162 215 87",
    "--color-green-4": "138 200 66",
    "--color-green-5": "79 158 35",
    "--color-green-text": "var(--color-gray-7)",
    "--color-blue-1": "237 247 255",
    "--color-blue-2": "203 232 255",
    "--color-blue-3": "131 203 255",
    "--color-blue-4": "75 167 230",
    "--color-blue-5": "37 126 158",
    "--color-blue-text": "var(--color-gray-7)",
    "--color-orange-1": "255 244 219",
    "--color-orange-2": "255 221 179",
    "--color-orange-3": "255 176 100",
    "--color-orange-4": "230 140 53",
    "--color-orange-5": "179 91 38",
    "--color-orange-text": "var(--color-gray-7)",
    "--color-red-1": "255 219 219",
    "--color-red-2": "255 183 183",
    "--color-red-3": "255 111 111",
    "--color-red-4": "230 62 62",
    "--color-red-5": "179 38 38",
    "--color-red-text": "var(--color-gray-7)",
    "--color-gray-0": "255 255 255",
    "--color-gray-1": "242 242 242",
    "--color-gray-2": "228 228 228",
    "--color-gray-3": "204 204 204",
    "--color-gray-4": "180 180 180",
    "--color-gray-5": "140 140 140",
    /* text-hint text-disabled */
    "--color-gray-6": "90 90 90",
    "--color-gray-7": "50 50 50",
    "--color-gray-8": "0 0 0",
    "--color-gray-text": "var(--color-gray-7)",
    "--resize-grip": "10px",
    "--resize-indicator": "2px",
    "--step-circle-radius": "16px"
  },
  ".dark": {
    colorScheme: "dark",
    /* text hover color, button active bgcolor */
    "--color-yellow-5": "255 250 199",
    /* text color, button hover bgcolor */
    "--color-yellow-4": "255 245 142",
    /* button default bgcolor */
    "--color-yellow-3": "255 232 34",
    /* bg outlined hovered color (with generally 50% transparency) */
    "--color-yellow-2": "251 191 36",
    /* bg outlined color (with generally 50% transparency) */
    "--color-yellow-1": "245 158 11",
    "--color-yellow-text": "var(--color-gray-0)",
    "--color-green-5": "232 245 212",
    "--color-green-4": "209 235 170",
    "--color-green-3": "162 215 87",
    "--color-green-2": "138 200 66",
    "--color-green-1": "79 158 35",
    "--color-green-text": "var(--color-gray-0)",
    "--color-blue-5": "237 247 255",
    "--color-blue-4": "203 232 255",
    "--color-blue-3": "131 203 255",
    "--color-blue-2": "75 167 230",
    "--color-blue-1": "37 126 158",
    "--color-blue-text": "var(--color-gray-0)",
    "--color-orange-5": "255 244 219",
    "--color-orange-4": "255 221 179",
    "--color-orange-3": "255 176 100",
    "--color-orange-2": "230 140 53",
    "--color-orange-1": "179 91 38",
    "--color-orange-text": "var(--color-gray-0)",
    "--color-red-5": "255 219 219",
    "--color-red-4": "255 183 183",
    "--color-red-3": "255 111 111",
    "--color-red-2": "230 62 62",
    "--color-red-1": "179 38 38",
    "--color-red-text": "var(--color-gray-0)",
    "--color-gray-8": "255 255 255",
    "--color-gray-7": "220 220 220",
    /* text-hint text-disabled */
    "--color-gray-6": "180 180 180",
    "--color-gray-5": "140 140 140",
    "--color-gray-4": "100 100 100",
    "--color-gray-3": "75 75 75",
    "--color-gray-2": "50 50 50",
    "--color-gray-1": "35 35 35",
    "--color-gray-0": "21 29 29",
    "--color-gray-text": "var(--color-gray-8)"
  }
};

// tailwind/base.ts
var base = {
  ":focus-visible": {
    "@apply rounded outline outline-2 outline-offset-2 outline-yellow-5": {}
  },
  "textarea:read-only": {
    "@apply bg-gray-1": {}
  },
  'input[type="search"]::-webkit-search-cancel-button, input[type="search"]::-webkit-search-decoration, input[type="search"]::-webkit-search-results-button, input[type="search"]::-webkit-search-results-decoration': {
    display: "none"
  },
  'input[type="range"]': {
    backgroundColor: "transparent",
    "-webkit-appearance": "none",
    appearance: "none"
  },
  'input[type="range"]::-webkit-slider-thumb': {
    "-webkit-appearance": "none",
    appearance: "none",
    border: "0",
    boxSizing: "border-box",
    borderRadius: "50%",
    cursor: "pointer",
    position: "relative"
  },
  'input[type="range"]::-moz-range-thumb': {
    appearance: "none",
    border: "0",
    boxSizing: "border-box",
    borderRadius: "50%",
    cursor: "pointer",
    position: "relative"
  },
  'input[type="range"]::-ms-thumb': {
    appearance: "none",
    border: "0",
    boxSizing: "border-box",
    borderRadius: "50%",
    cursor: "pointer",
    position: "relative"
  },
  mark: {
    "@apply bg-yellow-1 text-gray-8": {}
  },
  abbr: {
    "@apply cursor-help underline decoration-dashed": {}
  }
};

// tailwind/components.ts
var componentsStep = {
  ".ll-steps-extra": {
    "@apply flex justify-between": {},
    "& button:first-child": {
      padding: "calc(var(--step-circle-radius) / 2) calc(var(--step-circle-radius) / 2)\n      calc(var(--step-circle-radius) / 2) calc(var(--step-circle-radius) * 1.5 + 1rem)"
    },
    "& .ll-marker": {
      transform: "translate(calc(var(--step-circle-radius) / 3))"
    }
  },
  ".ll-steps": {
    "@apply relative": {},
    '&[data-marker="circle"]': {
      ".marker": {
        "@apply shadow bg-gray-1": {},
        width: "calc(var(--step-circle-radius) * 2)",
        height: "calc(var(--step-circle-radius) * 2)",
        "&.active": { "@apply bg-gray-2": {} }
      }
    },
    '&[data-marker="bullet"]': {
      ".marker": {
        "@apply text-2xs bg-gray-0 outline outline-2 outline-gray-2": {},
        margin: "calc(var(--step-circle-radius) / 2)",
        width: "calc(var(--step-circle-radius))",
        height: "calc(var(--step-circle-radius))",
        "&.active": { "@apply outline-gray-4": {} }
      }
    },
    '&[data-direction="horizontal"]': {
      "@apply flex flex-wrap": {},
      '&[data-marker="circle"]': {
        "--line-width": "calc(100% - var(--step-circle-radius) * 2 - var(--line-space) * 2)",
        "--line-left": "calc(50% + var(--step-circle-radius) + var(--line-space))"
      },
      '&[data-marker="bullet"]': {
        "--line-width": "calc(100% - var(--step-circle-radius) - var(--line-space) * 2)",
        "--line-left": "calc(50% + var(--step-circle-radius) / 2 + var(--line-space))"
      },
      "& .ll-step": {
        "@apply flex flex-col flex-1 text-center": {},
        ".content": { "@apply mt-2": {} }
      },
      '&[data-global-line="false"] .ll-step:not(:last-child)::after': {
        content: '""',
        borderStyle: "none none var(--line-style) none",
        width: "var(--line-width)",
        marginTop: "-2px",
        order: "-1",
        position: "relative",
        top: "calc(var(--step-circle-radius) + 1px)",
        left: "var(--line-left)"
      },
      ".marker-container": { "@apply flex items-center justify-center": {} }
    },
    '&[data-direction="vertical"]': {
      '&[data-marker="circle"]': {
        "--line-top": "calc(var(--step-circle-radius) * 2 + var(--line-space))",
        "--line-bottom": "var(--line-space)"
      },
      '&[data-marker="bullet"]': {
        "--line-top": "calc(var(--step-circle-radius) * 1.5 + var(--line-space))",
        "--line-bottom": "calc(-0.5 * var(--step-circle-radius) + var(--line-space))"
      },
      ".ll-step": {
        "@apply relative gap-1 items-start flex": {},
        "&:not(:last-child)": { paddingBottom: "0.5rem" }
      },
      '&[data-global-line="false"] .ll-step:not(:last-child)::after': {
        "@apply absolute left-0 w-0": {},
        content: '""',
        top: "var(--line-top)",
        bottom: "var(--line-bottom)",
        transform: "translateX(calc(var(--step-circle-radius) - 1px))",
        borderStyle: "none none none var(--line-style)"
      },
      '&[data-global-line="{}"]::after': {
        "@apply absolute left-0 w-0 z-0": {},
        content: '""',
        top: "var(--line-top)",
        bottom: "var(--line-top)",
        transform: "translateX(calc(var(--step-circle-radius) - 1px))",
        borderStyle: "none none none var(--line-style)"
      },
      ".content": { "@apply flex-1": {} },
      ".title": { lineHeight: "1rem" }
    },
    '&[data-global-line="{}"]': {
      "&::after": { "@apply border-gray-2 border-2": {} },
      "&.status-done::after": { "@apply border-gray-3": {} }
    }
  },
  ".ll-step": {
    '[data-global-line="false"] &:not(:last-child)': {
      "&::after": { "@apply border-gray-2 border-2": {} },
      "&.status-done::after": { "@apply border-gray-3": {} }
    },
    ".handle": {
      "@apply cursor-row-resize text-gray-6 motion-safe:transition-all": {},
      "&.active": { "&:hover": { "@apply bg-gray-2 text-transparent": {} } }
    },
    ".ll-autocomplete": { "@apply flex-1": {} },
    ".ll-button": { "@apply my-[2px] ml-2": {} }
  }
};
var componentsResizeArea = {
  ".p8n-resize-area": {
    position: "absolute",
    left: "0",
    right: "0",
    top: "0",
    bottom: "0",
    zIndex: "10",
    overflow: "visible",
    ".area-button": {
      position: "absolute",
      "&::before": {
        content: '""',
        position: "absolute",
        transitionDelay: "0.25s",
        transition: "background-color 0.25s cubic-bezier(0.22, 1, 0.36, 1)"
      },
      "&:hover::before": { backgroundColor: "rgb(var(--color-gray-5))" }
    },
    "&:where(.top, .bottom)": {
      height: "0",
      width: "100%",
      ".area-button": {
        left: "0",
        right: "0",
        width: "100%",
        height: "var(--resize-grip)",
        cursor: "row-resize",
        "&::before": {
          left: "0",
          right: "0",
          height: "var(--resize-indicator)"
        }
      }
    },
    "&:where(.left, .right)": {
      width: "0",
      height: "100%",
      ".area-button": {
        top: "0",
        bottom: "0",
        height: "100%",
        width: "var(--resize-grip)",
        cursor: "col-resize",
        "&::before": {
          top: "0",
          bottom: "0",
          width: "var(--resize-indicator)"
        }
      }
    },
    "&.top": {
      bottom: "auto",
      ".area-button": {
        top: "calc(-1 * var(--resize-grip) / 2)",
        "&::before": { top: "calc(50% - var(--resize-indicator) / 2)" }
      }
    },
    "&.bottom": {
      top: "auto",
      ".area-button": {
        bottom: "calc(-1 * var(--resize-grip) / 2)",
        "&::before": { bottom: "calc(50% - var(--resize-indicator) / 2)" }
      }
    },
    "&.right": {
      left: "auto",
      ".area-button": {
        right: "calc(-1 * var(--resize-grip) / 2)",
        "&::before": { right: "calc(50% - var(--resize-indicator) / 2)" }
      }
    },
    "&.left": {
      right: "auto",
      ".area-button": {
        left: "calc(-1 * var(--resize-grip) / 2)",
        "&::before": { left: "calc(50% - var(--resize-indicator) / 2)" }
      }
    }
  }
};
var componentsInputOutline = {
  ":is(.p8n-input-checkbox, .p8n-input-radio, .p8n-input-text, .p8n-textarea)": {
    "@apply outline outline-1 focus-full:outline-2": {}
  },
  ':is(.p8n-input-checkbox, .p8n-input-radio, .p8n-input-text, .p8n-textarea):where([data-color="yellow"])': {
    "@apply outline-gray-2 hover:outline-gray-3 focus-full:outline-yellow-4": {}
  },
  ':is(.p8n-input-checkbox, .p8n-input-radio, .p8n-input-text, .p8n-textarea):where([data-color="gray"])': {
    "@apply outline-gray-2 hover:outline-gray-3 focus-full:outline-gray-4": {}
  },
  ':is(.p8n-input-checkbox, .p8n-input-radio, .p8n-input-text, .p8n-textarea):where([data-color="red"])': {
    "@apply outline-red-2 hover:outline-red-3 focus-full:outline-red-4": {}
  },
  ':is(.p8n-input-checkbox, .p8n-input-radio, .p8n-input-text, .p8n-textarea):where([data-color="orange"])': {
    "@apply outline-orange-2 hover:outline-orange-3 focus-full:outline-orange-4": {}
  },
  ':is(.p8n-input-checkbox, .p8n-input-radio, .p8n-input-text, .p8n-textarea):where([data-color="blue"])': {
    "@apply outline-blue-2 hover:outline-blue-3 focus-full:outline-blue-4": {}
  },
  ':is(.p8n-input-checkbox, .p8n-input-radio, .p8n-input-text, .p8n-textarea):where([data-color="green"])': {
    "@apply outline-green-2 hover:outline-green-3 focus-full:outline-green-4": {}
  },
  ':is(.p8n-input-checkbox, .p8n-input-radio, .p8n-input-text, .p8n-textarea):where([data-variant="ghost"])': {
    "@apply outline-transparent": {}
  },
  ':is(.p8n-input-checkbox, .p8n-input-radio):where([data-color="yellow"])': {
    "@apply text-yellow-3": {}
  },
  ':is(.p8n-input-checkbox, .p8n-input-radio):where([data-color="gray"])': {
    "@apply text-gray-3": {}
  },
  ':is(.p8n-input-checkbox, .p8n-input-radio):where([data-color="red"])': {
    "@apply text-red-3": {}
  },
  ':is(.p8n-input-checkbox, .p8n-input-radio):where([data-color="orange"])': {
    "@apply text-orange-3": {}
  },
  ':is(.p8n-input-checkbox, .p8n-input-radio):where([data-color="blue"])': {
    "@apply text-blue-3": {}
  },
  ':is(.p8n-input-checkbox, .p8n-input-radio):where([data-color="green"])': {
    "@apply text-green-3": {}
  },
  ":is(.p8n-input-checkbox, .p8n-input-radio):is(:checked, .checked, .indeterminate)": {
    "@apply bg-full bg-center bg-no-repeat outline-gray-1 bg-current": {}
  },
  ".p8n-input-checkbox:not(.p8n-input-toggle):where(:checked, .checked)": {
    backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%23333' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
  },
  ".p8n-input-radio:where(:checked, .checked)": {
    backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%23333' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e")`
  },
  ":is(.p8n-input-checkbox, .p8n-input-radio):is(.indeterminate, :checked.indeterminate)": {
    backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%23333' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M4.5 7.5a1 1 0 0 0-1 1 1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1 1 1 0 0 0-1-1Z' /%3e%3c/svg%3e")`
  }
};
var components = {
  ".can-copy": {
    textDecorationLine: "underline",
    textDecorationStyle: "dashed",
    textDecorationColor: "rgb(var(--color-gray-3) / 1)",
    cursor: "copy",
    "&:hover": {
      textDecorationColor: "rgb(var(--color-gray-7) / 1)"
    }
  },
  ".disabled": {
    pointerEvents: "none",
    color: "rgb(var(--color-gray-6) / 1)",
    "&[disabled]": {
      opacity: "0.5"
    }
  },
  ".option": {
    "@apply flex w-full px-2 h-8 items-center text-left relative cursor-pointer first:rounded-t-2xl last:rounded-b-2xl hover:bg-gray-1 focus-full:text-gray-8 outline-none": {},
    "&[disabled]": { color: "rgb(var(--color-gray-6))", pointerEvents: "none" },
    ".bullet": {
      width: "1rem",
      height: "1rem",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "2px solid rgb(var(--color-gray-2))",
      fontSize: "var(--font-size-xs)",
      borderRadius: "50%",
      margin: "0 0.75rem 0 3px"
    }
  },
  ".p8n-separator": {
    "@apply bg-gray-1 w-1/2 h-1 rounded-sm mx-auto relative": {}
  },
  ".p8n-setting": {
    "@apply flex items-center justify-between": {},
    "& > :first-child": { "@apply text-gray-6 text-sm": {} },
    "& > :nth-child(2)": { textAlign: "right" },
    "& > :nth-child(2) input": { textAlign: "right" },
    "&.multiple": { alignItems: "flex-start" }
  }
};

// tailwind/utilities.ts
var utilities = {
  ".flex-center": {
    display: "flex",
    "align-items": "center",
    "justify-content": "center"
  },
  "a.link": {
    "@apply decoration-gray-8 underline text-gray-8 visited:text-gray-8 active:text-yellow-4 hover:decoration-2 hover:decoration-yellow-4": {}
  }
};
var utilitiesDialog = {
  '[data-placement^="top"]': {
    transformOrigin: "bottom",
    "& .p8n-arrow": {
      "@apply w-0 h-0 absolute border-x-8 border-t-8 border-x-transparent border-t-current top-full drop-shadow-arrow dark:drop-shadow-[0_1px_0_rgb(var(--color-gray-2))]": {},
      clip: "rect(0px, 16px, 12px, 0px)"
    }
  },
  '[data-placement="top-start"]': { transformOrigin: "bottom left" },
  '[data-placement="top-end"]': { transformOrigin: "bottom right" },
  '[data-placement^="bottom"]': {
    transformOrigin: "top",
    "& .p8n-arrow": {
      "@apply w-0 h-0 absolute border-x-8 border-b-8 border-x-transparent border-b-current bottom-full drop-shadow-arrow dark:drop-shadow-[0_-1px_0_rgb(var(--color-gray-2))]": {},
      clip: "rect(-4px, 16px, 8px, 0px)"
    }
  },
  '[data-placement="bottom-start"]': { transformOrigin: "top left" },
  '[data-placement="bottom-end"]': { transformOrigin: "top right" },
  '[data-placement^="left"]': {
    transformOrigin: "right",
    "& .p8n-arrow": {
      "@apply w-0 h-0 absolute border-y-8 border-l-8 border-y-transparent border-l-current left-full drop-shadow-arrow dark:drop-shadow-[1px_0_0_rgb(var(--color-gray-2))]": {},
      clip: "rect(0px, 12px, 16px, 0px)"
    }
  },
  '[data-placement="left-start"]': { transformOrigin: "top right" },
  '[data-placement="left-end"]': { transformOrigin: "bottom right" },
  '[data-placement^="right"]': {
    transformOrigin: "left",
    "& .p8n-arrow": {
      "@apply w-0 h-0 absolute border-y-8 border-r-8 border-y-transparent border-r-current right-full drop-shadow-arrow dark:drop-shadow-[-1px_0_0_rgb(var(--color-gray-2))]": {},
      clip: "rect(0px, 8px, 16px, -4px)"
    }
  },
  '[data-placement="right-start"]': { transformOrigin: "top left" },
  '[data-placement="right-end"]': { transformOrigin: "bottom left" },
  '[data-placement][data-color="yellow"] .p8n-arrow': {
    "@apply text-gray-0": {}
  },
  '[data-placement][data-color="gray"] .p8n-arrow': {
    "@apply text-gray-0": {}
  },
  '[data-placement][data-color="red"] .p8n-arrow': {
    "@apply text-red-1": {}
  },
  '[data-placement][data-color="orange"] .p8n-arrow': {
    "@apply text-orange-1": {}
  },
  '[data-placement][data-color="blue"] .p8n-arrow': {
    "@apply text-blue-1": {}
  },
  '[data-placement][data-color="green"] .p8n-arrow': {
    "@apply text-green-1": {}
  },
  ".option[data-nested][data-open]:not([data-focus-inside])": {
    "@apply bg-gray-2": {}
  },
  ".option[data-focus-inside][data-open]": { "@apply bg-gray-1": {} }
};

// tailwind/pentatrionTw.ts
var pentatrionTw = plugin.withOptions(
  function(options = {}) {
    return ({ addBase, addUtilities, addComponents, addVariant }) => {
      options.vars !== false && addBase(vars);
      options.base !== false && addBase(base);
      options.components !== false && addComponents(components);
      options.componentsInputOutline !== false && addComponents(componentsInputOutline);
      options.componentsResizeArea !== false && addComponents(componentsResizeArea);
      options.componentsStep !== false && addComponents(componentsStep);
      options.utilities !== false && addUtilities(utilities);
      options.utilitiesDialog !== false && addUtilities(utilitiesDialog);
      addVariant("active-full", ["&:active", "&.active"]);
      addVariant("focus-full", ["&:has(input:focus)", "&.focus", "&:focus"]);
    };
  },
  function() {
    return {
      theme: {
        zIndex: {
          auto: "auto",
          0: "0",
          10: "10",
          20: "20",
          30: "30",
          40: "40",
          50: "50",
          dialog: "100",
          overlay: "100",
          tooltip: "100",
          "context-menu": "90",
          notification: "80"
        },
        transitionDuration: {
          ...defaultTheme.transitionDuration,
          DEFAULT: "300ms"
        },
        colors: {
          transparent: "transparent",
          current: "currentColor",
          black: "rgb(var(--color-black) / <alpha-value>)",
          white: "rgb(var(--color-white) / <alpha-value>)",
          yellow: {
            1: "rgb(var(--color-yellow-1) / <alpha-value>)",
            2: "rgb(var(--color-yellow-2) / <alpha-value>)",
            3: "rgb(var(--color-yellow-3) / <alpha-value>)",
            4: "rgb(var(--color-yellow-4) / <alpha-value>)",
            5: "rgb(var(--color-yellow-5) / <alpha-value>)",
            // color of the text when bg is yellow 3
            text: "rgb(var(--color-yellow-text) / <alpha-value>)"
          },
          green: {
            1: "rgb(var(--color-green-1) / <alpha-value>)",
            2: "rgb(var(--color-green-2) / <alpha-value>)",
            3: "rgb(var(--color-green-3) / <alpha-value>)",
            4: "rgb(var(--color-green-4) / <alpha-value>)",
            5: "rgb(var(--color-green-5) / <alpha-value>)",
            // color of the text when bg is green
            text: "rgb(var(--color-green-text) / <alpha-value>)"
          },
          blue: {
            1: "rgb(var(--color-blue-1) / <alpha-value>)",
            2: "rgb(var(--color-blue-2) / <alpha-value>)",
            3: "rgb(var(--color-blue-3) / <alpha-value>)",
            4: "rgb(var(--color-blue-4) / <alpha-value>)",
            5: "rgb(var(--color-blue-5) / <alpha-value>)",
            // color of the text when bg is blue
            text: "rgb(var(--color-blue-text) / <alpha-value>)"
          },
          orange: {
            1: "rgb(var(--color-orange-1) / <alpha-value>)",
            2: "rgb(var(--color-orange-2) / <alpha-value>)",
            3: "rgb(var(--color-orange-3) / <alpha-value>)",
            4: "rgb(var(--color-orange-4) / <alpha-value>)",
            5: "rgb(var(--color-orange-5) / <alpha-value>)",
            // color of the text when bg is orange
            text: "rgb(var(--color-orange-text) / <alpha-value>)"
          },
          red: {
            1: "rgb(var(--color-red-1) / <alpha-value>)",
            2: "rgb(var(--color-red-2) / <alpha-value>)",
            3: "rgb(var(--color-red-3) / <alpha-value>)",
            4: "rgb(var(--color-red-4) / <alpha-value>)",
            5: "rgb(var(--color-red-5) / <alpha-value>)",
            // color of the text when bg is red
            text: "rgb(var(--color-red-text) / <alpha-value>)"
          },
          gray: {
            0: "rgb(var(--color-gray-0) / <alpha-value>)",
            1: "rgb(var(--color-gray-1) / <alpha-value>)",
            2: "rgb(var(--color-gray-2) / <alpha-value>)",
            3: "rgb(var(--color-gray-3) / <alpha-value>)",
            4: "rgb(var(--color-gray-4) / <alpha-value>)",
            5: "rgb(var(--color-gray-5) / <alpha-value>)",
            6: "rgb(var(--color-gray-6) / <alpha-value>)",
            7: "rgb(var(--color-gray-7) / <alpha-value>)",
            8: "rgb(var(--color-gray-8) / <alpha-value>)",
            // color of the text when bg is gray
            text: "rgb(var(--color-gray-text) / <alpha-value>)"
          }
        },
        boxShadow: {
          sm: "0 1px 2px 0 rgb(0 0 0 / 0.1)",
          DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.15), 0 1px 2px -1px rgb(0 0 0 / 0.15)",
          md: "0 4px 6px -1px rgb(0 0 0 / 0.15), 0 2px 4px -2px rgb(0 0 0 / 0.15)",
          lg: "0 10px 15px -3px rgb(0 0 0 / 0.15), 0 4px 6px -2px rgb(0 0 0 / 0.15)",
          xl: "0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.15)",
          "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.35)",
          inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.1)",
          dark: "0 0 0 1px rgb(var(--color-gray-2))",
          none: "none"
        },
        fontFamily: {
          sans: ["ui-sans-serif", "system-ui", "sans-serif"],
          fontello: ["fontello"],
          serif: defaultTheme.fontFamily.serif,
          mono: defaultTheme.fontFamily.mono
        },
        extend: {
          // https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js
          backgroundSize: {
            full: "100%"
          },
          dropShadow: {
            arrow: "0 1px 3px rgb(var(--color-gray-3))"
          },
          transitionProperty: {
            "color-shadow": "color, background-color, border-color, text-decoration-color, fill, stroke, box-shadow"
          },
          gridTemplateColumns: {
            "repeat-fill-300": "repeat(auto-fill, minmax(300px, 1fr))",
            "repeat-fill-160": "repeat(auto-fill, minmax(160px, 1fr))"
          },
          animation: {
            ripple: "ripple .9s linear",
            "fade-in": "fade-in 250ms ease both",
            "fade-in-list": "fade-in-list 150ms ease both",
            "fade-out": "fade-out 250ms ease both",
            "fade-in-opacity": "fade-in-opacity 250ms ease both",
            flash: "flash 1000ms ease both infinite",
            "loader-stroke": "loader-stroke 1s linear infinite"
          },
          fontSize: {
            "2xs": ["0.688rem", { lineHeight: "1rem" }]
          },
          keyframes
        }
      }
    };
  }
);
export {
  Autocomplete_default as Autocomplete,
  AutocompleteOption_default as AutocompleteOption,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  Code,
  Color,
  ContextMenu,
  ContextMenuItem,
  Dialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuContext,
  DropdownMenuItem,
  DropdownMenuNested,
  DropdownMenuTrigger,
  FetchError,
  Flash,
  Highlight,
  Href,
  Input,
  InputField,
  LazyAutocomplete,
  LinkButton,
  Loader,
  MenuItem,
  MenuItemWithChildren,
  Modal,
  ModalContent,
  ModalContext,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  NotificationsContext,
  NotificationsProvider,
  Popover,
  PopoverContent,
  PopoverContext,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Radio,
  RadioGroup,
  Range,
  ResizeArea,
  Scroll,
  Select,
  SelectContext,
  SelectOption,
  SelectSelection,
  SimpleAutocomplete,
  SimpleTooltip,
  Snack,
  Sortable,
  Step,
  Steps,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Tabs,
  Textarea,
  Toggle,
  Tooltip,
  TooltipContent,
  TooltipContext,
  TooltipTrigger,
  arrayEquals,
  buttonVariants,
  cardConfig,
  colorVariants,
  createNotificationsManager,
  dialogVariants,
  fetchAPI,
  getIndexLetter,
  getOptionLabel,
  getOptionValue,
  inputConfig,
  isErrorLike,
  parseError,
  pentatrionTw,
  useAutocomplete,
  useCombinedRefs,
  useContextNotifications,
  useCopyToClipboard,
  useDebounce,
  useDropdownMenu,
  useDropdownMenuContext,
  useEventCallback,
  useEventListener,
  useFetch,
  useIsClosing,
  useIsMounted,
  useIsomorphicLayoutEffect,
  useModal,
  useModalContext,
  useOnClickOutside,
  usePopover,
  usePopoverContext,
  usePrevious,
  useRefDebounce,
  useRipple,
  useSelect,
  useStateDebounce,
  useTooltip,
  useTooltipContext
};
