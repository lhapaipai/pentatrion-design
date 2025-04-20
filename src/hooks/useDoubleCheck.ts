import { HTMLProps, useState } from "react";

/**
 * Taken from epic-stack
 * file : https://github.com/epicweb-dev/epic-stack/blob/main/app/utils/misc.tsx
 */

function callAll<Args extends Array<unknown>>(
  ...fns: Array<((...args: Args) => unknown) | undefined>
) {
  return (...args: Args) => fns.forEach((fn) => fn?.(...args));
}

export function useDoubleCheck<P extends HTMLProps<Element> = HTMLProps<Element>>() {
  const [doubleCheck, setDoubleCheck] = useState(false);

  function getButtonProps(userProps?: P) {
    const onBlur: P["onBlur"] = () => setDoubleCheck(false);
    const onClick: P["onClick"] = doubleCheck
      ? () => void setDoubleCheck(false)
      : (e) => {
          e.preventDefault();
          setDoubleCheck(true);
        };

    const onKeyUp: HTMLProps<Element>["onKeyUp"] = (e) => {
      if (e.key === "Escape") {
        setDoubleCheck(false);
      }
    };

    return {
      ...userProps,
      onBlur: callAll(onBlur, userProps?.onBlur),
      onClick: callAll(onClick, userProps?.onClick),
      onKeyUp: callAll(onKeyUp, userProps?.onKeyUp),
    } as P;
  }

  return { doubleCheck, getButtonProps };
}
