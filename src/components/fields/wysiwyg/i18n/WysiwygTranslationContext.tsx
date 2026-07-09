import { createContext, useContext } from "react";
import { wysiwygTranslationsEn } from "./en";

export type WysiwygTranslateFn = (key: string) => string;

const WysiwygTranslationContext = createContext<WysiwygTranslateFn | undefined>(undefined);

export const WysiwygTranslationProvider = WysiwygTranslationContext.Provider;

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// used when no WysiwygTranslationProvider is mounted (no i18n solution wired up by the host app)
const defaultTranslate: WysiwygTranslateFn = (key) => {
  const value = getByPath(wysiwygTranslationsEn, key);
  return typeof value === "string" ? value : key;
};

export function useWysiwygTranslation() {
  const t = useContext(WysiwygTranslationContext) ?? defaultTranslate;
  return { t };
}
