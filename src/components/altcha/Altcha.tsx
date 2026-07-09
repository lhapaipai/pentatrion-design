import { useEffect, useRef } from "react";
import "altcha/i18n/en";
import { altcha as i18nFr } from "~/locales/fr/altcha";

interface AltchaProps {
  onStateChange?: (ev: Event | CustomEvent) => void;
}

const cssVariables: AltchaWidgetCSSProperties = {
  "--altcha-border-width": "0px",
  "--altcha-max-width": "100%",
};

export function Altcha({ onStateChange }: AltchaProps) {
  const widgetRef = useRef<HTMLElement>(null!);

  useEffect(() => {
    import("altcha");
    globalThis.altchaI18n.set("fr-fr", i18nFr);
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
        challengeurl="/auth/captcha-challenge"
        maxnumber={500000}
      ></altcha-widget>
    </div>
  );
}
