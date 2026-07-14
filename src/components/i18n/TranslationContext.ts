import { createContext, useContext } from "react";

export type Translate = (key: string, params?: Record<string, unknown>) => string;

const TranslationContext = createContext<Translate | undefined>(undefined);

export const TranslationProvider = TranslationContext.Provider;

export function useTranslate() {
  return useContext(TranslationContext);
}
