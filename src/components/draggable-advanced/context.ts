import { createContext, useContext } from "react";
import { ColumnType } from "./types";
import type { CleanupFn } from "@atlaskit/pragmatic-drag-and-drop/types";
import { invariant } from "~/lib";

export type BoardContextValue = {
  getColumns: () => ColumnType[];
  reorderColumn: (args: { startIndex: number; finishIndex: number }) => void;
  registerCard: (args: {
    cardId: string;
    entry: {
      element: HTMLElement;
      actionMenuTrigger: HTMLElement;
    };
  }) => CleanupFn;

  registerColumn: (args: {
    columnId: string;
    entry: {
      element: HTMLElement;
    };
  }) => CleanupFn;

  instanceId: symbol;
};

export const BoardContext = createContext<BoardContextValue | null>(null);

export function useBoardContext(): BoardContextValue {
  const value = useContext(BoardContext);
  invariant(value, "cannot find BoardContext provider");
  return value;
}

export type ColumnContextProps = {
  columnId: string;
  getCardIndex: (userId: string) => number;
  getNumCards: () => number;
};

export const ColumnContext = createContext<ColumnContextProps | null>(null);

export function useColumnContext(): ColumnContextProps {
  const value = useContext(ColumnContext);
  invariant(value, "cannot find ColumnContext provider");
  return value;
}
