import type { ReactNode, RefObject } from "react";
import { useImperativeHandle, useRef, useState } from "react";
import clsx from "clsx";
import type { LexicalEditor, SerializedEditorState } from "lexical";
import { $getRoot } from "lexical";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";

import { $generateHtmlFromNodes } from "@lexical/html";

import { ToolbarPlugin } from "./plugins/ToolbarPlugin";
import { LazyOnChangePlugin } from "./plugins/LazyOnChangePlugin";
import { CustomAutoLinkPlugin } from "./plugins/AutoLinkPlugin";
import { FloatingLinkEditorPlugin } from "./plugins/FloatingLinkEditorPlugin";
import { CustomLinkPlugin } from "./plugins/LinkPlugin";

import { editorConfig } from "./config";
import { $loadFromHtml } from "./config/html";
import type { ToolbarVariantProps } from "./style";
import { contentEditableStyles } from "./style";
import { ToolbarContext } from "./ToolbarContext";
import { WysiwygValue } from "./types";

interface Props {
  extendedToolbar?: boolean;
  floatingPosition?: "top" | "bottom";
  defaultValue?: WysiwygValue;

  proseCompact?: boolean;

  contentEditableBaseStyle?: "normal" | "withoutToolbarOnMobile";
  /**
   * If you want to define custom height
   */
  contentEditableClassName?: string;
  containerClassName?: string;
  /**
   * by default sticky is only available for mobile device with a top-0 if
   * you want to change this provide your own className
   */
  toolbarSticky?: ToolbarVariantProps["sticky"];
  toolbarVisible?: ToolbarVariantProps["visible"];

  ref?: RefObject<WysiwygRef>;
  debounceChange?: number | false;
  onChange?: (value: WysiwygValue) => void;
  children?: ReactNode;
}
function $readValue(editor: LexicalEditor): WysiwygValue {
  return {
    html: $generateHtmlFromNodes(editor),
    state: editor.getEditorState().toJSON(),
  };
}

export interface WysiwygRef {
  getValue: () => Promise<WysiwygValue>;
  setHtml: (html: string, fireEvent?: boolean) => void;
  getState: () => SerializedEditorState;
  setState: (state: SerializedEditorState, fireEvent?: boolean) => void;
  clear: (fireEvent?: boolean) => void;
}

export function Wysiwyg({
  floatingPosition = "bottom",
  extendedToolbar = true,
  proseCompact = false,
  defaultValue,
  contentEditableBaseStyle = "normal",
  contentEditableClassName,
  containerClassName,
  ref,
  toolbarSticky,
  toolbarVisible,
  debounceChange = false,
  onChange,
  children,
}: Props) {
  const [fullInitialConfig] = useState<InitialConfigType>(() => ({
    ...editorConfig,
    ...(defaultValue ? { editorState: JSON.stringify(defaultValue.state) } : {}),
  }));

  const editorRef = useRef<LexicalEditor | null>(null);
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  function getEditor(): LexicalEditor {
    const editor = editorRef.current;

    if (!editor) {
      throw new Error("Wysiwyg ref called before the editor was mounted");
    }

    return editor;
  }

  function notifyChange(editor: LexicalEditor) {
    editor.read(() => {
      onChange?.($readValue(editor));
    });
  }

  useImperativeHandle(ref, () => {
    return {
      getValue: async () =>
        new Promise((resolve) => {
          const editor = getEditor();
          editor.read(() => {
            resolve($readValue(editor));
          });
        }),
      setHtml: (nextHtml: string, fireEvent = false) => {
        const editor = getEditor();

        editor.update(() => {
          $loadFromHtml(editor, nextHtml);
        });
        if (fireEvent) {
          notifyChange(editor);
        }
      },
      getState: () => {
        return getEditor().getEditorState().toJSON();
      },
      setState: (editorState: SerializedEditorState, fireEvent = false) => {
        const editor = getEditor();
        const parsedEditorState = editor.parseEditorState(editorState);
        editor.setEditorState(parsedEditorState);
        if (fireEvent) {
          notifyChange(editor);
        }
      },

      clear: (fireEvent = false) => {
        const editor = getEditor();

        editor.update(() => {
          const root = $getRoot();
          root.getChildren().forEach((node) => {
            node.remove();
          });
        });
        if (fireEvent) {
          notifyChange(editor);
        }
      },
    };
  });

  return (
    <div className="relative z-(--index-wysiwyg) w-full">
      <LexicalComposer initialConfig={fullInitialConfig}>
        <EditorRefPlugin editorRef={editorRef} />
        <CustomAutoLinkPlugin />
        <CustomLinkPlugin />
        <HorizontalRulePlugin />
        <ListPlugin />
        {debounceChange && <LazyOnChangePlugin wait={debounceChange} onChange={onChange} />}
        <HistoryPlugin />

        <ToolbarContext>
          <div
            ref={onRef}
            data-color="gray"
            className={clsx("relative mx-auto w-full", containerClassName)}
          >
            <ToolbarPlugin
              extendedToolbar={extendedToolbar}
              sticky={toolbarSticky}
              visible={toolbarVisible}
              setIsLinkEditMode={setIsLinkEditMode}
            />
            {floatingAnchorElem && (
              <FloatingLinkEditorPlugin
                floatingPosition={floatingPosition}
                anchorElem={floatingAnchorElem}
                isLinkEditMode={isLinkEditMode}
                setIsLinkEditMode={setIsLinkEditMode}
              />
            )}
            {children}
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  autoComplete="off"
                  {...(proseCompact ? { "data-compact": true } : {})}
                  className={clsx(
                    "prose",
                    contentEditableStyles[contentEditableBaseStyle],
                    contentEditableClassName,
                  )}
                ></ContentEditable>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
        </ToolbarContext>
      </LexicalComposer>
    </div>
  );
}
