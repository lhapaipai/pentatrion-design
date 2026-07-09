import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import type { BaseSelection, LexicalEditor } from "lexical";
import {
  $getSelection,
  $isLineBreakNode,
  $isNodeSelection,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  getDOMSelection,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import type { Dispatch } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSelectedNode } from "../utils/getSelectedNode";
import { $createLinkNode, $isAutoLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { createPortal } from "react-dom";
import { Input } from "pentatrion-design/input";
import { sanitizeUrl } from "../utils/url";
import { setFloatingElemPositionForLinkEditor } from "../utils/setFloatingElemPositionForLinkEditor";
import { Button } from "pentatrion-design/button";
import { proseLinkVariant } from "pentatrion-design/href";
import { Dialog } from "pentatrion-design/dialog";
import "./index.css";
import clsx from "clsx";
import { FloatingOverlay } from "@floating-ui/react";

function preventDefault(
  event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>,
): void {
  event.preventDefault();
}

interface FloatingLinkEditorProps {
  floatingPosition?: "top" | "bottom";
  editor: LexicalEditor;
  isLink: boolean;
  setIsLink: Dispatch<boolean>;
  anchorElem: HTMLElement;
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}
function FloatingLinkEditor({
  floatingPosition = "bottom",
  editor,
  isLink,
  setIsLink,
  anchorElem,
  isLinkEditMode,
  setIsLinkEditMode,
}: FloatingLinkEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [editedLinkUrl, setEditedLinkUrl] = useState("https://");
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null);

  const $updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);

      if (linkParent) {
        setLinkUrl(linkParent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
      if (isLinkEditMode) {
        setEditedLinkUrl(linkUrl);
      }
    } else if ($isNodeSelection(selection)) {
      const nodes = selection.getNodes();
      if (nodes.length > 0) {
        const node = nodes[0];
        const parent = node.getParent();
        if ($isLinkNode(parent)) {
          setLinkUrl(parent.getURL());
        } else if ($isLinkNode(node)) {
          setLinkUrl(node.getURL());
        } else {
          setLinkUrl("");
        }
        if (isLinkEditMode) {
          setEditedLinkUrl(linkUrl);
        }
      }
    }

    const editorElem = editorRef.current;
    const nativeSelection = getDOMSelection(editor._window);
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();

    if (selection !== null && rootElement !== null && editor.isEditable()) {
      let domRect: DOMRect | undefined;

      if ($isNodeSelection(selection)) {
        const nodes = selection.getNodes();
        if (nodes.length > 0) {
          const element = editor.getElementByKey(nodes[0].getKey());
          if (element) {
            domRect = element.getBoundingClientRect();
          }
        }
      } else if (nativeSelection !== null && rootElement.contains(nativeSelection.anchorNode)) {
        domRect = nativeSelection.focusNode?.parentElement?.getBoundingClientRect();
      }

      if (domRect) {
        if (floatingPosition === "top") {
          domRect.y -= 40;
        } else {
          domRect.y += 40;
        }
        setFloatingElemPositionForLinkEditor(domRect, editorElem, anchorElem);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, anchorElem);
      }
      setLastSelection(null);
      setIsLinkEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [anchorElem, editor, setIsLinkEditMode, isLinkEditMode, linkUrl, floatingPosition]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        $updateLinkEditor();
      });
    };

    window.addEventListener("resize", update);

    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("resize", update);

      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
      }
    };
  }, [anchorElem.parentElement, editor, $updateLinkEditor]);

  // When toggle isLink
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor, $updateLinkEditor, setIsLink, isLink]);

  // Init
  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateLinkEditor();
    });
  }, [editor, $updateLinkEditor]);

  // When toggle Edit Mode, add focus to input
  useEffect(() => {
    if (isLinkEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLinkEditMode, isLink]);

  // when editing and press Enter
  const monitorInputInteraction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLinkSubmission(event);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsLinkEditMode(false);
    }
  };

  // when editing and click Ok
  const handleLinkSubmission = (
    event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>,
  ) => {
    event.preventDefault();
    if (lastSelection !== null) {
      if (linkUrl !== "") {
        editor.update(() => {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl));
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const parent = getSelectedNode(selection).getParent();
            if ($isAutoLinkNode(parent)) {
              const linkNode = $createLinkNode(parent.getURL(), {
                rel: parent.__rel,
                target: parent.__target,
                title: parent.__title,
              });
              parent.replace(linkNode, true);
            }
          }
        });
      }
      setEditedLinkUrl("https://");
      setIsLinkEditMode(false);
    }
  };

  function onClickOverlay() {
    editor.update(() => {
      setIsLink(false);
    });
  }
  return (
    <div
      ref={editorRef}
      className="z-dialog absolute top-0 left-0 flex opacity-0 transition-opacity"
    >
      {isLink ? (
        <>
          <Dialog color="yellow" className="flex w-xs gap-1 p-1">
            {isLinkEditMode ? (
              <>
                <Input
                  className="flex-1"
                  ref={inputRef}
                  value={editedLinkUrl}
                  onChange={(e) => setEditedLinkUrl(e.target.value)}
                  onKeyDown={monitorInputInteraction}
                />
                <Button
                  icon
                  variant="light"
                  color="green"
                  type="button"
                  tabIndex={0}
                  onMouseDown={preventDefault}
                  onClick={handleLinkSubmission}
                >
                  <i className="fe-ok"></i>
                </Button>
                <Button
                  icon
                  color="red"
                  variant="text"
                  type="button"
                  tabIndex={0}
                  onMouseDown={preventDefault}
                  onClick={() => void setIsLinkEditMode(false)}
                >
                  <i className="fe-cancel"></i>
                </Button>
              </>
            ) : (
              <div className="flex w-full items-center gap-1">
                <span>URL:</span>
                <a
                  className={clsx(proseLinkVariant, "flex-1 items-center truncate")}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={sanitizeUrl(linkUrl)}
                >
                  {linkUrl}
                </a>
                <Button
                  icon
                  type="button"
                  variant="light"
                  tabIndex={0}
                  onMouseDown={preventDefault}
                  onClick={(event) => {
                    event.preventDefault();
                    setEditedLinkUrl(linkUrl);
                    setIsLinkEditMode(true);
                  }}
                >
                  <i className="fe-pencil"></i>
                </Button>
                <Button
                  type="button"
                  color="red"
                  variant="light"
                  icon
                  tabIndex={0}
                  onMouseDown={preventDefault}
                  onClick={() => {
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
                  }}
                >
                  <i className="fe-trash"></i>
                </Button>
              </div>
            )}
          </Dialog>
          {createPortal(
            <FloatingOverlay
              className="z-[calc(var(--index-wysiwyg)-1)]"
              onClick={onClickOverlay}
              lockScroll
            />,
            document.body,
          )}
        </>
      ) : null}
    </div>
  );
}

interface FloatingLinkEditorPluginProps {
  floatingPosition?: "top" | "bottom";
  anchorElem: HTMLDivElement;
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}

export function FloatingLinkEditorPlugin({
  floatingPosition,
  anchorElem,
  isLinkEditMode,
  setIsLinkEditMode,
}: FloatingLinkEditorPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    function $updateToolbar() {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const focusNode = getSelectedNode(selection);
        const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode);
        const focusAutoLinkNode = $findMatchingParent(focusNode, $isAutoLinkNode);
        if (!(focusLinkNode || focusAutoLinkNode)) {
          setIsLink(false);
          return;
        }
        const badNode = selection
          .getNodes()
          .filter((node) => !$isLineBreakNode(node))
          .find((node) => {
            const linkNode = $findMatchingParent(node, $isLinkNode);
            const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode);
            return (
              (focusLinkNode && !focusLinkNode.is(linkNode)) ||
              (linkNode && !linkNode.is(focusLinkNode)) ||
              (focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
              (autoLinkNode &&
                (!autoLinkNode.is(focusAutoLinkNode) || autoLinkNode.getIsUnlinked()))
            );
          });
        if (!badNode) {
          setIsLink(true);
        } else {
          setIsLink(false);
        }
      } else if ($isNodeSelection(selection)) {
        const nodes = selection.getNodes();
        if (nodes.length === 0) {
          setIsLink(false);
          return;
        }
        const node = nodes[0];
        const parent = node.getParent();
        if ($isLinkNode(parent) || $isLinkNode(node)) {
          setIsLink(true);
        } else {
          setIsLink(false);
        }
      }
    }
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const linkNode = $findMatchingParent(node, $isLinkNode);
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), "_blank");
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);

  return createPortal(
    <FloatingLinkEditor
      floatingPosition={floatingPosition}
      editor={editor}
      isLink={isLink}
      anchorElem={anchorElem}
      setIsLink={setIsLink}
      isLinkEditMode={isLinkEditMode}
      setIsLinkEditMode={setIsLinkEditMode}
    />,
    anchorElem,
  );
}
