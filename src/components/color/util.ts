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
 * pour variant > 0, vers un gris neutre foncé (`#323232`, pas `black` —
 * mélanger vers du noir pur désature/salit la teinte) pour variant < 0.
 * `black`/`white` dérogent : ce sont déjà les bornes de la rampe, seul un mix
 * vers `black` a du sens pour elles (plage -100..0 imposée côté ColorPicker).
 * `#323232` est fixé en dur (pas `var(--color-gray-7)`) pour que le résultat
 * ne s'inverse pas silencieusement sous `.dark`, où ce token désigne un gris clair.
 */
export function applyColorVariant(base: string, variant: number): string {
  const mix = resolveVariantMix(base, variant);
  if (!mix) {
    return base;
  }

  return `color-mix(in oklab, ${base} ${mix.baseWeight}%, ${mix.target})`;
}

function resolveVariantMix(
  base: string,
  variant: number,
): { target: "white" | "black" | "#323232"; baseWeight: number } | null {
  if (variant === 0) {
    return null;
  } else if (variant > 0) {
    return { target: "white", baseWeight: 100 - variant };
  }
  return { target: isGrayScale(base) ? "black" : "#323232", baseWeight: 100 - Math.abs(variant) };
}

function hexLuminance(hex: string): number {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;

  if (full.length !== 6) {
    return 1;
  }

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

const TARGET_LUMINANCE: Record<"white" | "black" | "#323232", number> = {
  white: 1,
  black: 0,
  "#323232": hexLuminance("#323232"),
};

export function isColorDark(color: Color, palette = defaultBrandPalette): boolean {
  if (color.type === "raw") {
    return hexLuminance(color.hex) < 0.5;
  }

  const base = color.name === "gray" ? "#808080" : (palette[color.name] ?? "#808080");
  const mix = resolveVariantMix(base, color.variant);

  if (!mix) {
    return hexLuminance(base) < 0.5;
  }

  // la luminance étant linéaire en r/g/b, la luminance du mélange = mélange des luminances
  const luminance =
    (hexLuminance(base) * mix.baseWeight + TARGET_LUMINANCE[mix.target] * (100 - mix.baseWeight)) /
    100;

  return luminance < 0.5;
}
