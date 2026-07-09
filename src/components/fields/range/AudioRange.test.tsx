import { describe, expect, test } from "vitest";
import { formatTime } from "./AudioRange";

describe("AudioRange", () => {
  test.each([
    [0, "0:00"],
    [60, "1:00"],
    [9.9999, "0:09"],
    [10, "0:10"],
    [59.9999, "0:59"],
  ])("formatTime %s -> %s", (time, expectedFormattedTime) => {
    const formattedTime = formatTime(time);
    expect(formattedTime).toBe(expectedFormattedTime);
  });
});
