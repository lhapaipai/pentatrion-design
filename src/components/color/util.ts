import { Color, ColorName, defaultPalette } from "./config";

export function getColorValue(color: Color, palette = defaultPalette): string {
  if (color.type === "custom") {
    return color.value;
  }

  const base =
    color.name === "black"
      ? "#000000"
      : color.name === "white"
        ? "#ffffff"
        : (palette[color.name] ?? "#000000");

  return applyColorVariant(base, color.variant);
}

export function isColorAvailable(colorName: ColorName, palette = defaultPalette): boolean {
  if (colorName === "black" || colorName === "white") {
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
  if (base === "#000000" || base === "#ffffff") {
    return `color-mix(in oklab, white ${100 - Math.abs(variant)}%, black)`;
  }
  return variant > 0
    ? `color-mix(in oklab, ${base} ${100 - variant}%, white)`
    : `color-mix(in oklab, ${base} ${100 - Math.abs(variant)}%, var(--color-gray-7))`;
}
