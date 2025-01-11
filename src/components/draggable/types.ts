import { type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

export const draggableItemDataKey = Symbol("item");

export type DraggableState =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement }
  | { type: "is-dragging" }
  | { type: "is-dragging-over"; closestEdge: Edge | null };

export type DraggableItemData = {
  [draggableItemDataKey]: true;
  id: string | number;
};
