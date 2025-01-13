import { invariant } from "~/lib";

export type CardEntry = {
  element: HTMLElement;
  actionMenuTrigger: HTMLElement;
};

export type ColumnEntry = {
  element: HTMLElement;
};

export function createRegistry() {
  const cards = new Map<string, CardEntry>();
  const columns = new Map<string, ColumnEntry>();

  function registerCard({ cardId, entry }: { cardId: string; entry: CardEntry }) {
    cards.set(cardId, entry);

    return function cleanup() {
      cards.delete(cardId);
    };
  }

  function registerColumn({ columnId, entry }: { columnId: string; entry: ColumnEntry }) {
    columns.set(columnId, entry);

    return function () {
      columns.delete(columnId);
    };
  }

  function getCard(cardId: string) {
    const entry = cards.get(cardId);
    invariant(entry);
    return entry;
  }

  function getColumn(columnId: string): ColumnEntry {
    const entry = columns.get(columnId);
    invariant(entry);
    return entry;
  }

  return { registerCard, registerColumn, getCard, getColumn };
}
