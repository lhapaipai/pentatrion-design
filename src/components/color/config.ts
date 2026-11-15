import { z } from "zod/v4-mini";

export const colorNames = ["primary", "secondary", "tertiary", "gray"] as const;
export type ColorName = (typeof colorNames)[number];

export const namedColorSchema = z.object({
  type: z.literal("named"),
  name: z.enum(colorNames),
  variant: z.number(), // -100, 100
});
export type NamedColor = z.infer<typeof namedColorSchema>;

export const defaultNamedColor: NamedColor = { name: "gray", variant: -100, type: "named" };

export const rawColorSchema = z.object({
  type: z.literal("raw"),
  hex: z.string(),
});
export type RawColor = z.infer<typeof rawColorSchema>;

export const colorSchema = z.union([namedColorSchema, rawColorSchema]);
export type Color = z.infer<typeof colorSchema>;

export type ColorInput = z.input<typeof colorSchema>;

export const maxChroma = 0.12;

export const chromaticitySchema = z.object({
  hue: z.number().check(z.gte(0), z.lt(360)),
  chroma: z.number().check(z.gte(0), z.lte(maxChroma)),
});
export type Chromaticity = z.infer<typeof chromaticitySchema>;

export const brandPaletteSchema = z.object({
  primary: z.string(),
  secondary: z._default(z.nullable(z.string()), null),
  tertiary: z._default(z.nullable(z.string()), null),
  textChromaticity: z._default(z.nullable(chromaticitySchema), null),
});
export type BrandPalette = z.infer<typeof brandPaletteSchema>;
