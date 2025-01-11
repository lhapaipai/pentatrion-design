import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { useEffect, useRef, useState } from "react";
import { getItemData, isItemData } from "./util";
import { DraggableState } from "./types";

const idle: DraggableState = { type: "idle" };

type UseDraggableItemOptions = {
  id: string | number;
  customPreview?: boolean;
};

export const useDraggableItem = ({ id, customPreview = false }: UseDraggableItemOptions) => {
  const ref = useRef<HTMLDivElement>(null!);
  const [state, setState] = useState<DraggableState>(idle);

  useEffect(() => {
    const element = ref.current;
    return combine(
      draggable({
        element,
        getInitialData() {
          return getItemData(id);
        },
        ...(customPreview
          ? {
              onGenerateDragPreview({ nativeSetDragImage }) {
                setCustomNativeDragPreview({
                  nativeSetDragImage,
                  getOffset: pointerOutsideOfPreview({
                    x: "16px",
                    y: "8px",
                  }),
                  render({ container }) {
                    setState({ type: "preview", container });
                  },
                });
              },
            }
          : {}),
        onDragStart() {
          setState({ type: "is-dragging" });
        },
        onDrop() {
          setState(idle);
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          if (source.element === element) {
            return false;
          }

          return isItemData(source.data);
        },
        getData({ input }) {
          const data = getItemData(id);
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky() {
          return true;
        },
        onDragEnter({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setState({ type: "is-dragging-over", closestEdge });
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);

          // Only need to update react state if nothing has changed.
          // Prevents re-rendering.
          setState((current) => {
            if (current.type === "is-dragging-over" && current.closestEdge === closestEdge) {
              return current;
            }
            return { type: "is-dragging-over", closestEdge };
          });
        },
        onDragLeave() {
          setState(idle);
        },
        onDrop() {
          setState(idle);
        },
      }),
    );
  }, [id, customPreview]);

  return { ref, state };
};
