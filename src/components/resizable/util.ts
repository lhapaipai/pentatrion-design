import { RefObject, useEffect, useMemo, useReducer } from "react";

function computeSize(element: HTMLElement | null) {
  if (element === null) return { width: 0, height: 0 };
  const { width, height } = element.getBoundingClientRect();
  return { width, height };
}

export function useMeasure(elementRef: RefObject<HTMLElement | null>) {
  const [identity, forceRerender] = useReducer(() => ({}), {});

  // When the element changes during a re-render, we want to make sure we
  // compute the correct size as soon as possible. However, once the element is
  // stable, we also want to watch for changes to the element. The `identity`
  // state can be used to recompute the size.
  const size = useMemo(() => computeSize(elementRef.current), [elementRef, identity]);

  useEffect(() => {
    if (!elementRef.current) return;

    // Trigger a re-render whenever the element resizes
    const observer = new ResizeObserver(forceRerender);
    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, elementRef.current]);

  return size;
}
