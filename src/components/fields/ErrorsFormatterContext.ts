import { createContext, ReactNode, useContext } from "react";

export type ErrorsFormatter = (errors: ReactNode | boolean) => ReactNode | boolean;

const ErrorsFormatterContext = createContext<ErrorsFormatter | undefined>(undefined);

export const ErrorsFormatterProvider = ErrorsFormatterContext.Provider;

export function useErrorsFormatter() {
  return useContext(ErrorsFormatterContext);
}
