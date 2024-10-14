import { messageAdded } from "./notificationSlice";
import { parseError } from "../../lib";

export const errorCatcherMiddleware: any =
  ({ dispatch }: { dispatch: any }) =>
  (next: any) =>
  async (action: any) => {
    if (typeof action !== "function" && (action as any).type.endsWith("/rejected")) {
      const errorMessage = parseError((action as any).error || {});
      if (errorMessage) {
        dispatch(messageAdded(...errorMessage));
      }
    }

    return next(action);
  };

/*
import { Action, Middleware } from "@reduxjs/toolkit";
import { messageAdded } from "./notificationSlice";
import { parseError } from "../../lib";

export const errorCatcherMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (typeof action !== "function" && (action as Action).type.endsWith("/rejected")) {
      const errorMessage = parseError((action as any).error || {});
      if (errorMessage) {
        dispatch(messageAdded(...errorMessage));
      }
    }

    return next(action);
  };

*/
