import React, { useEffect, useRef } from "react";

/**
 * This hook accepts a ref to any element and adds a click event handler that creates ripples when click
 */
export const useRipple = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  inverted = false,
  enabled = true,
) => {
  const ripplesRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let timer: number | null = null;

    const cleanup = () => {
      ripplesRef.current.forEach(($child) => $child.remove());
      ripplesRef.current = [];
      timer = null;
    };

    //add a click handler for the ripple
    const handlePointerDown = (e: MouseEvent) => {
      if (ref.current) {
        const elem = ref.current;

        //calculate the position and dimensions of the ripple.
        //based on click position and button dimensions
        const rect = elem.getBoundingClientRect();
        const left = (e.clientX ?? 0) - rect.left;
        const top = (e.clientY ?? 0) - rect.top;
        const height = elem.clientHeight;
        const width = elem.clientWidth;
        const diameter = Math.max(width, height);

        const $child = document.createElement("span");
        $child.className = "motion-safe:animate-ripple";

        $child.style.position = "absolute";
        $child.style.backgroundColor = inverted ? "var(--color-custom-4)" : "#ffffff";
        $child.style.opacity = inverted ? "75%" : "50%";
        $child.style.transform = "scale(0)";
        $child.style.borderRadius = "50%";
        $child.style.top = `${top - diameter / 2}px`;
        $child.style.left = `${left - diameter / 2}px`;
        $child.style.height = `${Math.max(width, height)}px`;
        $child.style.width = `${Math.max(width, height)}px`;

        elem.prepend($child);

        ripplesRef.current.push($child);

        if (timer !== null) {
          clearTimeout(timer);
        }
        timer = window.setTimeout(cleanup, 1000);
      }
    };

    if (ref.current) {
      const elem = ref.current;
      elem.addEventListener("pointerdown", handlePointerDown);

      return () => {
        elem.removeEventListener("pointerdown", handlePointerDown);
      };
    }
  }, [ref, enabled, inverted]);

  return null;
};
