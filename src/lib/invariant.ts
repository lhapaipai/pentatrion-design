const prefix: string = "Invariant failed";

export function invariant(condition: any, message?: string): asserts condition {
  if (condition) {
    return;
  }

  const value: string = message ? `${prefix}: ${message}` : prefix;
  throw new Error(value);
}
