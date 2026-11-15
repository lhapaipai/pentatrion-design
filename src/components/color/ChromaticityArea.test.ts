import { describe, test } from "vitest";
import {
  chromaticityToPosition,
  moveChromaticity,
  positionToChromaticity,
} from "./ChromaticityArea";
import { maxChroma } from "./config";

describe("positionToChromaticity", () => {
  test("maps the corners", ({ expect }) => {
    expect(positionToChromaticity(0, 0)).toEqual({ hue: 0, chroma: maxChroma });
    expect(positionToChromaticity(0, 1)).toEqual({ hue: 0, chroma: 0 });
  });

  test("reserves the lower half to tinted grays", ({ expect }) => {
    expect(positionToChromaticity(0.5, 0.5)).toEqual({ hue: 180, chroma: maxChroma / 4 });
  });

  test("wraps the right edge to hue 0", ({ expect }) => {
    expect(positionToChromaticity(1, 1).hue).toBe(0);
  });

  test("clamps positions outside the area", ({ expect }) => {
    expect(positionToChromaticity(-0.2, 1.3)).toEqual({ hue: 0, chroma: 0 });
    expect(positionToChromaticity(0.5, -0.4)).toEqual({ hue: 180, chroma: maxChroma });
  });

  test("rounds hue to the degree and chroma to 3 decimals", ({ expect }) => {
    expect(positionToChromaticity(0.1234, 0.3333)).toEqual({ hue: 44, chroma: 0.053 });
  });

  test("is the inverse of chromaticityToPosition", ({ expect }) => {
    for (const chromaticity of [
      { hue: 67, chroma: 0.012 },
      { hue: 0, chroma: 0 },
      { hue: 300, chroma: 0.1 },
    ]) {
      const { left, top } = chromaticityToPosition(chromaticity);
      expect(positionToChromaticity(left, top)).toEqual(chromaticity);
    }
  });
});

describe("moveChromaticity", () => {
  test("wraps hue on both sides", ({ expect }) => {
    expect(moveChromaticity({ hue: 0, chroma: 0.01 }, "ArrowLeft")).toEqual({
      hue: 355,
      chroma: 0.01,
    });
    expect(moveChromaticity({ hue: 358, chroma: 0.01 }, "ArrowRight")).toEqual({
      hue: 3,
      chroma: 0.01,
    });
  });

  test("leaves 0 even when a height step rounds to 0", ({ expect }) => {
    expect(moveChromaticity({ hue: 10, chroma: 0 }, "ArrowUp")).toEqual({
      hue: 10,
      chroma: 0.001,
    });
  });

  test("steps in height, so chroma steps grow towards the top", ({ expect }) => {
    expect(moveChromaticity({ hue: 10, chroma: 0.012 }, "ArrowUp")).toEqual({
      hue: 10,
      chroma: 0.014,
    });
    expect(moveChromaticity({ hue: 10, chroma: 0.1 }, "ArrowUp")).toEqual({
      hue: 10,
      chroma: 0.104,
    });
  });

  test("clamps at both ends", ({ expect }) => {
    expect(moveChromaticity({ hue: 10, chroma: 0.119 }, "ArrowUp")).toEqual({
      hue: 10,
      chroma: maxChroma,
    });
    expect(moveChromaticity({ hue: 10, chroma: maxChroma }, "ArrowUp")).toEqual({
      hue: 10,
      chroma: maxChroma,
    });
    expect(moveChromaticity({ hue: 10, chroma: 0.001 }, "ArrowDown")).toEqual({
      hue: 10,
      chroma: 0,
    });
    expect(moveChromaticity({ hue: 10, chroma: 0 }, "ArrowDown")).toEqual({
      hue: 10,
      chroma: 0,
    });
  });

  test("ignores other keys", ({ expect }) => {
    expect(moveChromaticity({ hue: 10, chroma: 0.01 }, "Enter")).toBeNull();
  });
});
