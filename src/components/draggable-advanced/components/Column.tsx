import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import { ColumnType } from "../types";
import { Card } from "./Card";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ColumnContext, ColumnContextProps, useBoardContext, useColumnContext } from "../context";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { centerUnderPointer } from "@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer";
import clsx from "clsx";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "../../draggable/DropIndicator";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { createPortal } from "react-dom";
import { DropdownMenu, DropdownMenuItem } from "../../dropdown-menu";
import { Button } from "../../button";

/**
 * Note: not making `'is-dragging'` a `State` as it is
 * a _parallel_ state to `'is-column-over'`.
 *
 * Our board allows you to be over the column that is currently dragging
 */
type State =
  | { type: "idle" }
  | { type: "is-card-over" }
  | { type: "is-dragging" }
  | { type: "is-column-over"; closestEdge: Edge | null }
  | { type: "generate-safari-column-preview"; container: HTMLElement }
  | { type: "generate-column-preview" };

const idle: State = { type: "idle" };
const isCardOver: State = { type: "is-card-over" };

const stateStyles: {
  [key in State["type"]]?: string;
} = {
  idle: "cursor-grab",
  "is-card-over": "bg-gray-2",
  /**
   * **Browser bug workaround**
   *
   * _Problem_
   * When generating a drag preview for an element
   * that has an inner scroll container, the preview can include content
   * vertically before or after the element
   *
   * _Fix_
   * We make the column a new stacking context when the preview is being generated.
   * We are not making a new stacking context at all times, as this _can_ mess up
   * other layering components inside of your card
   *
   * _Fix: Safari_
   * We have not found a great workaround yet. So for now we are just rendering
   * a custom drag preview
   */
  "generate-column-preview": "isolate",
};

const isDraggingStyles = "opacity-40";

export default function Column({ column }: { column: ColumnType }) {
  const columnId = column.columnId;
  const columnRef = useRef<HTMLDivElement>(null!);
  const columnInnerRef = useRef<HTMLDivElement>(null!);
  const headerRef = useRef<HTMLDivElement>(null!);
  const scrollableRef = useRef<HTMLDivElement>(null!);
  const [state, setState] = useState<State>(idle);

  /**
   * on doit pouvoir avoir l'état isDragging et en même temps avoir l'état "is-card-over"
   */
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { instanceId, registerColumn } = useBoardContext();

  useEffect(() => {
    return combine(
      registerColumn({ columnId, entry: { element: columnRef.current } }),
      draggable({
        element: columnRef.current,
        dragHandle: headerRef.current,
        getInitialData: () => ({ columnId, type: "column", instanceId }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          const isSafari: boolean =
            navigator.userAgent.includes("AppleWebKit") && !navigator.userAgent.includes("Chrome");

          if (!isSafari) {
            setState({ type: "generate-column-preview" });
            return;
          }
          setCustomNativeDragPreview({
            getOffset: centerUnderPointer,
            render: ({ container }) => {
              setState({
                type: "generate-safari-column-preview",
                container,
              });
              return () => setState(idle);
            },
            nativeSetDragImage,
          });
        },
        onDragStart: () => {
          setIsDragging(true);
        },
        onDrop() {
          setState(idle);
          setIsDragging(false);
        },
      }),
      // zone de réception de cards
      dropTargetForElements({
        element: columnInnerRef.current,
        getData: () => ({ columnId }),
        canDrop: ({ source }) => {
          return source.data.instanceId === instanceId && source.data.type === "card";
        },
        getIsSticky: () => true,
        onDragEnter: () => setState(isCardOver),
        onDragLeave: () => setState(idle),
        onDragStart: () => setState(isCardOver),
        onDrop: () => setState(idle),
      }),
      // zone de réception de colonnes
      dropTargetForElements({
        element: columnRef.current,
        canDrop: ({ source }) => {
          if (source.element === columnRef.current) {
            return false;
          }
          return source.data.instanceId === instanceId && source.data.type === "column";
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = {
            columnId,
          };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["left", "right"],
          });
        },
        onDragEnter: (args) => {
          setState({
            type: "is-column-over",
            closestEdge: extractClosestEdge(args.self.data),
          });
        },
        onDrag: (args) => {
          setState((current) => {
            const closestEdge: Edge | null = extractClosestEdge(args.self.data);
            if (current.type === "is-column-over" && current.closestEdge === closestEdge) {
              return current;
            }
            return {
              type: "is-column-over",
              closestEdge,
            };
          });
        },
        onDragLeave: () => {
          setState(idle);
        },
        onDrop: () => {
          setState(idle);
        },
      }),
      autoScrollForElements({
        element: scrollableRef.current,
        canScroll: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === "card",
      }),
    );
  }, [columnId, registerColumn, instanceId]);

  const stableItems = useRef(column.items);
  useEffect(() => {
    stableItems.current = column.items;
  }, [column.items]);

  const getCardIndex = useCallback((userId: string) => {
    return stableItems.current.findIndex((item) => item.userId === userId);
  }, []);

  const getNumCards = useCallback(() => {
    return stableItems.current.length;
  }, []);

  const contextValue: ColumnContextProps = useMemo(() => {
    return { columnId, getCardIndex, getNumCards };
  }, [columnId, getCardIndex, getNumCards]);

  return (
    <ColumnContext.Provider value={contextValue}>
      <div
        className={clsx(
          "relative box-border flex w-60 flex-col rounded-sm bg-gray-1 transition-colors",
          stateStyles[state.type],
        )}
        ref={columnRef}
      >
        <div className="flex min-h-0 grow flex-col" ref={columnInnerRef}>
          <div className={clsx("flex min-h-0 grow flex-col", isDragging && isDraggingStyles)}>
            <div
              className="box-border flex select-none items-center justify-between pl-4 pr-2 pt-2"
              ref={headerRef}
            >
              <span className="text-sm">{column.title}</span>
              <ActionMenu />
            </div>
            <div className="h-full overflow-y-auto" ref={scrollableRef}>
              <div className="flex flex-col gap-2 p-2">
                {column.items.map((item) => (
                  <Card item={item} key={item.userId} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {state.type === "is-column-over" && state.closestEdge && (
          <DropIndicator edge={state.closestEdge} gap="1rem" />
        )}
      </div>
      {state.type === "generate-safari-column-preview"
        ? createPortal(<SafariColumnPreview column={column} />, state.container)
        : null}
    </ColumnContext.Provider>
  );
}

function SafariColumnPreview({ column }: { column: ColumnType }) {
  return (
    <div className="box-border flex w-64 select-none items-center justify-between bg-gray-1 px-4 py-2">
      <span className="text-sm">{column.title}</span>
    </div>
  );
}

function ActionMenu() {
  return (
    <DropdownMenu
      placement="bottom-end"
      trigger={
        <Button icon color="gray" variant="text">
          <i className="fe-ellipsis"></i>
        </Button>
      }
    >
      <DropdownMenuItems />
    </DropdownMenu>
  );
}

function DropdownMenuItems() {
  const { columnId } = useColumnContext();
  const { getColumns, reorderColumn } = useBoardContext();
  const columns = getColumns();
  const startIndex = columns.findIndex((column) => column.columnId === columnId);

  const moveLeft = useCallback(() => {
    reorderColumn({ startIndex, finishIndex: startIndex - 1 });
  }, [reorderColumn, startIndex]);

  const moveRight = useCallback(() => {
    reorderColumn({ startIndex, finishIndex: startIndex + 1 });
  }, [reorderColumn, startIndex]);

  const isMoveLeftDisabled = startIndex === 0;
  const isMoveRightDisabled = startIndex === columns.length - 1;

  return (
    <>
      <DropdownMenuItem onClick={moveLeft} disabled={isMoveLeftDisabled}>
        Déplacer à gauche
      </DropdownMenuItem>
      <DropdownMenuItem onClick={moveRight} disabled={isMoveRightDisabled}>
        Déplacer à droite
      </DropdownMenuItem>
    </>
  );
}
