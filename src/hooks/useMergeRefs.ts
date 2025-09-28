import { Ref, useMemo, RefObject } from "react";

/**
 * Merges an array of refs into a single memoized callback ref or `null`.
 * @see https://floating-ui.com/docs/react-utils#usemergerefs
 */
export function useMergeRefs<Instance>(
  refs: Array<Ref<Instance> | undefined>,
): Ref<Instance> | null {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }

    return (value) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(value);
        } else if (ref != null) {
          (ref as RefObject<Instance | null>).current = value;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}

export function useStrictMergeRefs<Instance>(
  refs: Array<Ref<Instance> | undefined>,
): Ref<Instance> {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      throw new Error("define at least one ref with useMergeRefs");
    }

    return (value) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(value);
        } else if (ref != null) {
          (ref as RefObject<Instance | null>).current = value;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
