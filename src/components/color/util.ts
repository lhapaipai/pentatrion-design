import { Color, ColorName, defaultBrandPalette, defaultFallbackColor } from "./config";

export function getColorValue(
  color: Color | null,
  palette = defaultBrandPalette,
  fallbackColor = defaultFallbackColor,
): string {
  if (!color) {
    return fallbackColor;
  }

  if (color.type === "raw") {
    return color.hex;
  }

  const base = color.name === "gray" ? "#808080" : (palette[color.name] ?? "#808080");

  return applyColorVariant(base ?? "#808080", color.variant);
}

/**
 * Détermine si une couleur hexadécimale (#rgb, #rgba, #rrggbb, #rrggbbaa)
 * est un niveau de gris, c'est-à-dire que ses composantes R, G et B sont égales.
 */
export function isGrayScale(hex: string): boolean {
  const normalized = hex.replace("#", "");
  const isShort = normalized.length === 3 || normalized.length === 4;
  const step = isShort ? 1 : 2;

  const r = parseInt(normalized.slice(0, step).repeat(isShort ? 2 : 1), 16);
  const g = parseInt(normalized.slice(step, step * 2).repeat(isShort ? 2 : 1), 16);
  const b = parseInt(normalized.slice(step * 2, step * 3).repeat(isShort ? 2 : 1), 16);

  return r === g && g === b;
}

export function isColorAvailable(colorName: ColorName, palette = defaultBrandPalette): boolean {
  if (colorName === "gray") {
    return true;
  }
  return !!palette[colorName];
}

/**
 * Dérive une variante claire/sombre d'une couleur de palette : mix vers `white`
 * pour variant > 0, vers un gris neutre foncé (`--color-gray-7`, pas `black` —
 * mélanger vers du noir pur désature/salit la teinte) pour variant < 0.
 * `black`/`white` dérogent : ce sont déjà les bornes de la rampe, seul un mix
 * vers `black` a du sens pour elles (plage -100..0 imposée côté ColorPicker).
 */
export function applyColorVariant(base: string, variant: number): string {
  if (variant === 0) {
    return base;
  }

  return variant > 0
    ? `color-mix(in oklab, ${base} ${100 - variant}%, white)`
    : `color-mix(in oklab, ${base} ${100 - Math.abs(variant)}%, ${isGrayScale(base) ? "black" : "var(--color-gray-7)"})`;
}
