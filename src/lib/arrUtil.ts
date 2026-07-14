export function arrayEquals(a: any, b: any) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

export function getIndexLetter(index: number) {
  return String.fromCharCode(65 + (index % 26));
}

export function isArrayOfString(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}
