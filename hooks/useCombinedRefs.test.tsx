import { createElement, useEffect, useRef } from "react";

import { render } from "@testing-library/react";

import { useCombinedRefs } from "./useCombinedRefs";
import { describe, expect, it, vi } from "vitest";

describe("useCombinedRefs", () => {
  it("should correctly combine refs into one ref", async () => {
    const cbRef = vi.fn();
    const refs: { a: null | HTMLDivElement; b: null | HTMLDivElement } = { a: null, b: null };

    const Test = () => {
      const refA = useRef<HTMLDivElement>(null);
      const refB = useRef<HTMLDivElement>(null);
      const combinedRef = useCombinedRefs(refA, refB, cbRef, undefined);
      useEffect(() => {
        refs.a = refA.current;
        refs.b = refB.current;
        return () => {
          refs.a = refA.current;
          refs.b = refB.current;
        };
      });
      return <div ref={combinedRef} data-testid="div"></div>;
    };

    const { getByTestId, rerender } = render(createElement(Test));

    const div = getByTestId("div");

    expect(refs.a).toBe(div);
    expect(refs.b).toBe(div);
    expect(cbRef).toHaveBeenCalledWith(div);

    rerender(<div />);

    expect(cbRef).toHaveBeenCalledWith(null);
    expect(refs.a).toBe(null);
    expect(refs.b).toBe(null);
  });
});
