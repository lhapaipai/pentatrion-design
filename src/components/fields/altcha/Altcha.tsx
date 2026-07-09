import { useEffect, useRef } from "react";
import "altcha/i18n/en";
import { altchaI18nFr } from "./locales.fr";

interface AltchaProps {
  onStateChange?: (ev: Event | CustomEvent) => void;
  challengeUrl: string;
  name?: string;
}

const cssVariables: AltchaWidgetCSSProperties = {
  "--altcha-border-width": "0px",
  "--altcha-max-width": "100%",
};

export function Altcha({ onStateChange, challengeUrl, name }: AltchaProps) {
  const widgetRef = useRef<HTMLElement>(null!);

  useEffect(() => {
    import("altcha");
    globalThis.altchaI18n.set("fr-fr", altchaI18nFr);
  }, []);

  useEffect(() => {
    const handleStateChange = (ev: Event | CustomEvent) => {
      if ("detail" in ev) {
        onStateChange?.(ev);
      }
    };

    const { current } = widgetRef;
    if (current) {
      current.addEventListener("statechange", handleStateChange);
      return () => current.removeEventListener("statechange", handleStateChange);
    }
  }, [onStateChange]);

  return (
    <div className="h-6">
      <altcha-widget
        ref={widgetRef}
        style={cssVariables}
        debug
        hidelogo
        hidefooter
        challengeurl={challengeUrl}
        maxnumber={500000}
        name={name}
      ></altcha-widget>
    </div>
  );
}
