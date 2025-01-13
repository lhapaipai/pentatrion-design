export type Outcome =
  | {
      type: "column-reorder";
      columnId: string;
      startIndex: number;
      finishIndex: number;
    }
  | {
      type: "card-reorder";
      columnId: string;
      startIndex: number;
      finishIndex: number;
    }
  | {
      type: "card-move";
      finishColumnId: string;
      itemIndexInStartColumn: number;
      itemIndexInFinishColumn: number;
    };

export type Trigger = "pointer" | "keyboard";

export type Operation = {
  trigger: Trigger;
  outcome: Outcome;
};

export type BoardState = {
  columnMap: ColumnMap;
  orderedColumnIds: string[];
  lastOperation: Operation | null;
};

export type Person = {
  userId: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type ColumnType = {
  title: string;
  columnId: string;
  items: Person[];
};
export type ColumnMap = { [columnId: string]: ColumnType };
