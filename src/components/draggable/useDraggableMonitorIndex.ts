import { useEffect } from "react";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";

import { flushSync } from "react-dom";
import { isItemData, triggerPostMoveFlash } from "./util";
import { useEffectEvent } from "~/hooks";

type Item = Record<string, any>;

function defaultGetItemIndexById(list: Item[], id: string | number) {
  return list.findIndex((item) => item.id === id);
}

export type UseDraggableMonitorOptions<I extends Item> = {
  list: I[];
  onIndexChange: (startIndex: number, finishIndex: number) => void;
  /** use a stable accessor */
  getItemIndexById?: (list: I[], id: string | number) => number;
};

export const useDraggableMonitorIndex = <I extends Item>({
  list,
  onIndexChange,
  getItemIndexById = defaultGetItemIndexById,
}: UseDraggableMonitorOptions<I>) => {
  const stableOnIndexChange = useEffectEvent(onIndexChange);

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isItemData(source.data);
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        const sourceData = source.data;
        const targetData = target.data;

        if (!isItemData(sourceData) || !isItemData(targetData)) {
          return;
        }

        const indexOfSource = getItemIndexById(list, sourceData.id);
        const indexOfTarget = getItemIndexById(list, targetData.id);

        if (indexOfTarget < 0 || indexOfSource < 0) {
          return;
        }

        const closestEdgeOfTarget = extractClosestEdge(targetData);

        // Using `flushSync` so we can query the DOM straight after this line
        flushSync(() => {
          const finishIndex = getReorderDestinationIndex({
            startIndex: indexOfSource,
            indexOfTarget,
            closestEdgeOfTarget,
            axis: "vertical",
          });
          stableOnIndexChange(indexOfSource, finishIndex);
        });

        // Being simple and just querying for the item after the drop.
        // We could use react context to register the element in a lookup,
        // and then we could retrieve that element after the drop and use
        // `triggerPostMoveFlash`. But this gets the job done.
        const element = document.querySelector(`[data-item-id="${sourceData.id}"]`);
        if (element instanceof HTMLElement) {
          triggerPostMoveFlash(element);
        }
      },
    });
  }, [list, stableOnIndexChange, getItemIndexById]);
};
