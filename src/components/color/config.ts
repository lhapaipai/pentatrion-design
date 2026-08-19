import { z } from "zod/v4-mini";

export const colorNames = ["primary", "secondary", "tertiary", "text", "gray"] as const;
export const principalColorNames = ["primary", "secondary", "tertiary"] as const;
export type ColorName = (typeof colorNames)[number];

export const paletteColorSchema = z.object({
  type: z.literal("palette"),
  name: z.enum(colorNames),
  variant: z.number(), // -100, 100
});
export type PaletteColor = z.infer<typeof paletteColorSchema>;

export const defaultPaletteColor: PaletteColor = { name: "gray", variant: -100, type: "palette" };

export const customColorSchema = z.object({
  type: z.literal("custom"),
  value: z.string(),
});
export type CustomColor = z.infer<typeof customColorSchema>;

export const colorSchema = z.union([paletteColorSchema, customColorSchema]);
export type Color = z.infer<typeof colorSchema>;

export const paletteSchema = z.object({
  primary: z.string(),
  secondary: z._default(z.nullable(z.string()), null),
  tertiary: z._default(z.nullable(z.string()), null),
  text: z.string(),
});
export type Palette = z.infer<typeof paletteSchema>;

export const defaultPalette: Palette = {
  primary: "#ffca0a",
  secondary: null,
  tertiary: null,
  text: "#323232",
};
