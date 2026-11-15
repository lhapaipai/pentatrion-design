import clsx from "clsx";
import { Chromaticity } from "./config";
import { colorButtonStyle } from "./NamedColorGrid";
import { useTranslate } from "../i18n";
import {
  chromaticityGridChromas,
  chromaticityGridHues,
  getChromaticityValue,
  isSameChromaticity,
} from "../../lib/palette";

const intensityLabels: Record<keyof typeof chromaticityGridChromas, string> = {
  subtle: "Discret",
  marked: "Marqué",
  strong: "Fort",
  vivid: "Vif",
};

const intensities = Object.keys(
  chromaticityGridChromas,
) as (keyof typeof chromaticityGridChromas)[];

interface Props {
  value: Chromaticity | null;
  onChange: (value: Chromaticity) => void;
}

export function ChromaticityGrid({ value, onChange }: Props) {
  const t = useTranslate();

  return (
    <div className="flex flex-col gap-3 p-2">
      {intensities.map((intensity) => {
        const chroma = chromaticityGridChromas[intensity];

        return (
          <div key={intensity}>
            <div className="text-body-xs truncate">
              {t?.(`form.values.chromaticityIntensity.${intensity}`) ?? intensityLabels[intensity]}
            </div>
            <div className="flex">
              {chromaticityGridHues.map((hue) => {
                const chromaticity: Chromaticity = { hue, chroma };
                return (
                  <button
                    key={hue}
                    type="button"
                    title={`${hue}°`}
                    className={clsx(
                      "h-8 flex-1 hover:scale-x-105!",
                      colorButtonStyle.base,
                      isSameChromaticity(value, chromaticity) && colorButtonStyle.selected,
                    )}
                    style={{ backgroundColor: getChromaticityValue(chromaticity) }}
                    onClick={() => onChange(chromaticity)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
