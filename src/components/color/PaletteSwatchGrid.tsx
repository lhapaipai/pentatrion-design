import clsx from "clsx";
import { Color, defaultPalette, Palette, PaletteColor, principalColorNames } from "./config";
import { applyColorVariant, getColorValue, isColorAvailable } from "./util";
import { useTranslate } from "../i18n";

interface Props {
  palette?: Palette;
  value: PaletteColor | null;
  onChange: (value: PaletteColor) => void;
  variants?: number | number[];
}
// bornes à -80/80 plutôt que -100/100 : à 100% la base disparaît complètement
// du color-mix, le swatch ne reproduit plus que du blanc/gris pur, redondant
// avec les entrées white/black déjà présentes dans la grille.
const variantMagnitude = 80;

function getVariantSteps(variants: number | number[]): number[] {
  if (Array.isArray(variants)) {
    return variants;
  }
  const min = -variantMagnitude;
  const max = variantMagnitude;
  if (variants <= 1) {
    return [0];
  }
  return Array.from({ length: variants }, (_, i) =>
    Math.round(min + (i * (max - min)) / (variants - 1)),
  );
}

export const colorButtonStyle = {
  base: "cursor-pointer hover:z-20 hover:scale-125 hover:rounded hover:shadow active:scale-125",
  selected: "outline-yellow-5 z-10 rounded outline-2 -outline-offset-1",
};

export function PaletteSwatchGrid({
  palette = defaultPalette,
  value,
  onChange,
  variants = 9,
}: Props) {
  const t = useTranslate();

  return (
    <div className="flex flex-col gap-3 p-2">
      {principalColorNames
        .filter((name) => isColorAvailable(name, palette))
        .map((name) => {
          // une seule vignette pour black : color-mix(black, black) est un no-op,
          // toute une rampe serait visuellement identique
          const steps = getVariantSteps(variants);

          return (
            <div key={name}>
              <div className="text-body-xs truncate">
                {t?.(`form.values.colorNames.${name}`) ?? name}
              </div>
              <div className="flex">
                {steps.map((variant) => {
                  const c: Color = { type: "palette", name, variant };
                  const v = getColorValue(c, palette);
                  return (
                    <button
                      key={variant}
                      type="button"
                      title={`${c.name} (${variant}%)`}
                      className={clsx(
                        "h-8 flex-1",
                        colorButtonStyle.base,
                        value?.name === name &&
                          value?.variant === variant &&
                          colorButtonStyle.selected,
                      )}
                      style={{ backgroundColor: v }}
                      onClick={() => onChange(c)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      <div>
        <div className="text-body-xs truncate">
          {t?.("form.values.colorNames.grayScale") ?? "Niveau de gris"}
        </div>
        <div className="flex">
          {getVariantSteps(variants).map((variant) => {
            const color = applyColorVariant("#808080", variant);
            return (
              <button
                key={variant}
                type="button"
                title={`gray (${variant}%)`}
                className={clsx(
                  "h-8 flex-1",
                  colorButtonStyle.base,
                  value?.name === "gray" && value?.variant === variant && colorButtonStyle.selected,
                )}
                style={{ backgroundColor: color }}
                onClick={() => onChange({ type: "palette", name: "gray", variant })}
              />
            );
          })}
        </div>
      </div>
      <div>
        <div className="text-body-xs truncate">
          {t?.("form.values.colorNames.blackAndWhite") ?? "Noir & Blanc"}
        </div>
        <div className="flex">
          {[-100, 100].map((variant) => {
            const color = applyColorVariant("#808080", variant);
            return (
              <button
                key={variant}
                type="button"
                title={`gray (${variant}%)`}
                className={clsx(
                  "h-8 flex-1 hover:scale-x-105!",
                  colorButtonStyle.base,
                  value?.name === "gray" && value?.variant === variant && colorButtonStyle.selected,
                  variant === 100 && "border border-gray-2",
                )}
                style={{ backgroundColor: color }}
                onClick={() => onChange({ type: "palette", name: "gray", variant })}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
