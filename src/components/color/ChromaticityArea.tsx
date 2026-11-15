import clsx from "clsx";
import { KeyboardEvent, PointerEvent, useRef } from "react";
import { Chromaticity, maxChroma } from "./config";
import { useTranslate } from "../i18n";
import { chromaticityPreviewLightness, getChromaticityValue } from "../../lib/palette";

const hueStep = 5;
const heightStep = 0.02;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function roundChroma(chroma: number) {
  return Math.round(chroma * 1000) / 1000;
}

function wrapHue(hue: number) {
  return ((hue % 360) + 360) % 360;
}

// axe vertical quadratique : la moitié basse de la boîte est réservée aux gris teintés
// (chroma ≤ maxChroma / 4), le cas courant, le haut à la couleur franche
function heightToChroma(height: number) {
  return roundChroma(maxChroma * clamp(height) ** 2);
}

function chromaToHeight(chroma: number) {
  return Math.sqrt(clamp(chroma / maxChroma));
}

function stepChroma(chroma: number, direction: 1 | -1) {
  let height = chromaToHeight(chroma);
  let next = chroma;
  // près de 0, un pas de hauteur peut être absorbé par l'arrondi à 3 décimales
  while (next === chroma && (direction > 0 ? height < 1 : height > 0)) {
    height = clamp(height + direction * heightStep);
    next = heightToChroma(height);
  }
  return next;
}

export function positionToChromaticity(left: number, top: number): Chromaticity {
  return {
    hue: wrapHue(Math.round(clamp(left) * 360)),
    chroma: heightToChroma(1 - clamp(top)),
  };
}

export function chromaticityToPosition({ hue, chroma }: Chromaticity) {
  return { left: hue / 360, top: 1 - chromaToHeight(chroma) };
}

export function moveChromaticity({ hue, chroma }: Chromaticity, key: string): Chromaticity | null {
  switch (key) {
    case "ArrowLeft":
      return { hue: wrapHue(hue - hueStep), chroma };
    case "ArrowRight":
      return { hue: wrapHue(hue + hueStep), chroma };
    case "ArrowUp":
      return { hue, chroma: stepChroma(chroma, 1) };
    case "ArrowDown":
      return { hue, chroma: stepChroma(chroma, -1) };
    default:
      return null;
  }
}

const l = chromaticityPreviewLightness;
const grayStops = [0, 0.25, 0.5, 0.75, 1]
  .map((height) => `oklch(${l} 0 0 / ${1 - height ** 2}) ${height * 100}%`)
  .join(", ");
// le voile gris se mélange en sRGB, pas en OKLCH : la couleur affichée sous le pointeur
// n'est qu'approchée, l'aperçu calculé à partir de la valeur fait foi
const areaBackground = [
  `linear-gradient(to top, ${grayStops})`,
  `linear-gradient(to right in oklch longer hue, oklch(${l} ${maxChroma} 0), oklch(${l} ${maxChroma} 0))`,
].join(", ");

interface Props {
  value: Chromaticity | null;
  onChange: (value: Chromaticity) => void;
  className?: string;
}

export function ChromaticityArea({ value, onChange, className }: Props) {
  const t = useTranslate();
  const areaRef = useRef<HTMLDivElement>(null!);

  function changeFromPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = areaRef.current.getBoundingClientRect();
    onChange(
      positionToChromaticity(
        (event.clientX - rect.left) / rect.width,
        (event.clientY - rect.top) / rect.height,
      ),
    );
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    areaRef.current.setPointerCapture(event.pointerId);
    areaRef.current.focus();
    changeFromPointer(event);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (areaRef.current.hasPointerCapture(event.pointerId)) {
      changeFromPointer(event);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = moveChromaticity(value ?? { hue: 0, chroma: 0 }, event.key);
    if (next) {
      event.preventDefault();
      onChange(next);
    }
  }

  const position = value ? chromaticityToPosition(value) : null;
  const intensity = value ? Math.round((value.chroma / maxChroma) * 100) : 0;

  return (
    <div
      ref={areaRef}
      role="slider"
      tabIndex={0}
      aria-label={t?.("form.values.chromaticity.label") ?? "Chromaticité"}
      aria-valuetext={
        value
          ? (t?.("form.values.chromaticity.valueText", { hue: value.hue, intensity }) ??
            `Teinte ${value.hue}°, intensité ${intensity} %`)
          : undefined
      }
      className={clsx(
        "group relative h-50 w-full cursor-crosshair touch-none rounded-xl shadow-inner select-none",
        "outline-yellow-5 outline-offset-2 focus-visible:outline-2",
        className,
      )}
      style={{ backgroundImage: areaBackground }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onKeyDown={handleKeyDown}
    >
      {value && position && (
        <div
          className="pointer-events-none absolute size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow transition-transform group-focus-visible:scale-110"
          style={{
            left: `${position.left * 100}%`,
            top: `${position.top * 100}%`,
            backgroundColor: getChromaticityValue(value),
          }}
        />
      )}
    </div>
  );
}
