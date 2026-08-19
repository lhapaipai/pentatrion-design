import clsx from "clsx";
import { colord, extend } from "colord";
import harmoniesPlugin, { type HarmonyType } from "colord/plugins/harmonies";
import { RawColor } from "./config";
import { colorButtonStyle } from "./NamedColorGrid";
import { useTranslate } from "../i18n";

extend([harmoniesPlugin]);

const harmonyLabels: Record<HarmonyType, string> = {
  complementary: "Complémentaire",
  analogous: "Analogue",
  triadic: "Triadique",
  "split-complementary": "Complémentaire divisée",
  rectangle: "Rectangle",
  tetradic: "Tétradique",
  "double-split-complementary": "Double complémentaire divisée",
};

const harmonyTypes = Object.keys(harmonyLabels) as HarmonyType[];

interface Props {
  refColor: RawColor;
  color: RawColor | null;
  onChange: (color: RawColor) => void;
}

export function HarmonyColorGrid({ refColor, color, onChange }: Props) {
  const t = useTranslate();
  const baseColor = colord(refColor.value);

  return (
    <div className="flex flex-col gap-3 p-2">
      {harmonyTypes.map((harmonyType) => (
        <div key={harmonyType}>
          <div className="text-body-xs truncate">
            {t?.(`form.values.colorHarmony.${harmonyType}`) ?? harmonyLabels[harmonyType]}
          </div>
          <div className="flex">
            {baseColor.harmonies(harmonyType).map((harmonyColor, index) => {
              const hex = harmonyColor.toHex();
              return (
                <button
                  key={index}
                  type="button"
                  title={hex}
                  className={clsx(
                    "h-8 flex-1 hover:scale-x-105!",
                    colorButtonStyle.base,
                    color?.value === hex && colorButtonStyle.selected,
                  )}
                  style={{ backgroundColor: hex }}
                  onClick={() => onChange({ type: "raw", value: hex })}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
