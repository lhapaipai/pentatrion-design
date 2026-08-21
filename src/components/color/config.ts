import { z } from "zod/v4-mini";

export const colorNames = ["primary", "secondary", "tertiary", "text", "gray"] as const;
export const principalColorNames = ["primary", "secondary", "tertiary"] as const;
export type ColorName = (typeof colorNames)[number];

export const namedColorSchema = z.object({
  type: z.literal("named"),
  name: z.enum(colorNames),
  variant: z.number(), // -100, 100
});
export type NamedColor = z.infer<typeof namedColorSchema>;

export const defaultNamedColor: NamedColor = { name: "gray", variant: -100, type: "named" };
export const defaultFallbackColor = "#000000";

export const rawColorSchema = z.object({
  type: z.literal("raw"),
  hex: z.string(),
});
export type RawColor = z.infer<typeof rawColorSchema>;

export const colorSchema = z.union([namedColorSchema, rawColorSchema]);
export type Color = z.infer<typeof colorSchema>;

export type ColorInput = z.input<typeof colorSchema>;

export const brandPaletteSchema = z.object({
  primary: z.string(),
  secondary: z._default(z.nullable(z.string()), null),
  tertiary: z._default(z.nullable(z.string()), null),
  text: z.string(),
});
export type BrandPalette = z.infer<typeof brandPaletteSchema>;

export const defaultBrandPalette: BrandPalette = {
  primary: "#ffca0a",
  secondary: null,
  tertiary: null,
  text: "#323232",
};
