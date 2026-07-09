import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import clsx from "clsx";
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";

import type { ButtonProps } from "pentatrion-design/button";
import { Button } from "pentatrion-design/button";
import type { Dispatch } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { focusNextElement } from "~/lib/util/dom";
import type { ToolbarVariantProps } from "../style";
import { toolbarVariants } from "../style";
import type { BlockType } from "../ToolbarContext";
import { blockTypes, useToolbarState } from "../ToolbarContext";
import { getSelectedNode } from "../utils/getSelectedNode";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isListNode, ListNode } from "@lexical/list";
import { $isHeadingNode } from "@lexical/rich-text";
import { BlockFormatDropdown } from "../components/BlockFormatDropdown";
import { ElementFormatDropdown } from "../components/ElementFormatDropdown";

function Divider() {
  return <div className="border-r-gray-2 my-1 border-r" />;
}

const buttonBaseProps: (label: string, selected: boolean, isFocusable: boolean) => ButtonProps = (
  label,
  selected,
  isFocusable,
) => ({
  "aria-label": label,
  selected,
  tabIndex: isFocusable ? 0 : -1,
  color: "gray",
  variant: "text",
  icon: true,
  type: "button",
});

interface Props extends ToolbarVariantProps {
  className?: string;
  setIsLinkEditMode: Dispatch<boolean>;
  extendedToolbar?: boolean;
}

export function ToolbarPlugin({
  extendedToolbar,
  className,
  sticky,
  visible,
  setIsLinkEditMode,
}: Props) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);

  const [isFocusable, setIsFocusable] = useState(false);
  const { t } = useTranslation();

  const { toolbarState, updateToolbarState } = useToolbarState();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });
      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      const node = getSelectedNode(selection);
      const parent = node.getParent();
      const isLink = $isLinkNode(parent) || $isLinkNode(node);
      updateToolbarState("isLink", isLink);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();

          updateToolbarState("blockType", type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          if (blockTypes.includes(type as BlockType)) {
            updateToolbarState("blockType", type as BlockType);
          }
        }
      }

      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }

      updateToolbarState(
        "elementFormat",
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || "left",
      );

      updateToolbarState("isBold", selection.hasFormat("bold"));
      updateToolbarState("isItalic", selection.hasFormat("italic"));
      updateToolbarState("isUnderline", selection.hasFormat("underline"));
    }
  }, [editor, updateToolbarState]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          if (_newEditor !== editor) {
            console.error("_newEditor is different !!");
          }
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          updateToolbarState("canUndo", payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          updateToolbarState("canRedo", payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor, $updateToolbar, updateToolbarState]);

  const insertLink = useCallback(() => {
    if (!toolbarState.isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [toolbarState.isLink, setIsLinkEditMode, editor]);

  return (
    <div className={toolbarVariants({ sticky, visible, className })} ref={toolbarRef}>
      <button
        className={clsx(
          "not-focus:hidden-focusable bg-gray-0/40 absolute top-1 right-1 z-20 inline-flex h-8 items-center rounded-2xl px-2 backdrop-blur-xs",
        )}
        onClick={() => {
          setIsFocusable((f) => !f);
          focusNextElement();
        }}
        type="button"
      >
        {t(isFocusable ? "button.disableFocusable" : "button.enableFocusable")}
      </button>
      <Button
        {...buttonBaseProps("Undo", false, isFocusable)}
        disabled={!toolbarState.canUndo}
        onClick={() => void editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        <i className="fe-ccw"></i>
      </Button>
      <Button
        {...buttonBaseProps("Redo", false, isFocusable)}
        disabled={!toolbarState.canRedo}
        onClick={() => void editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        <i className="fe-cw"></i>
      </Button>
      <Divider />
      {extendedToolbar && (
        <>
          {blockTypes.includes(toolbarState.blockType) && (
            <BlockFormatDropdown
              isFocusable={isFocusable}
              blockType={toolbarState.blockType}
              editor={editor}
            />
          )}
          <ElementFormatDropdown
            isFocusable={isFocusable}
            value={toolbarState.elementFormat}
            editor={editor}
          />
          <Divider />
        </>
      )}

      <Button
        {...buttonBaseProps("Format Bold", toolbarState.isBold, isFocusable)}
        onClick={() => void editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <i className="fe-bold"></i>
      </Button>
      <Button
        {...buttonBaseProps("Format Italics", toolbarState.isItalic, isFocusable)}
        onClick={() => void editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <i className="fe-italic"></i>
      </Button>
      <Button
        {...buttonBaseProps("Format Underline", toolbarState.isUnderline, isFocusable)}
        onClick={() => void editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <i className="fe-underline"></i>
      </Button>
      <Button
        {...buttonBaseProps("Format Link", toolbarState.isLink, isFocusable)}
        onClick={insertLink}
      >
        <i className="fe-link"></i>
      </Button>
      {extendedToolbar && (
        <Button
          {...buttonBaseProps("Horizontal Rule", toolbarState.isLink, isFocusable)}
          onClick={() => void editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}
        >
          <i className="fe-horizontal-rule"></i>
        </Button>
      )}
    </div>
  );
}
