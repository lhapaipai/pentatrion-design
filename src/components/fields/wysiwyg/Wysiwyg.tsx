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
  proseClassName?: string;
  initialValue?: WysiwygValue;

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
export interface WysiwygRef {
  getValue: () => Promise<WysiwygValue>;
  setHtml: (html: string) => void;
  getState: () => SerializedEditorState;
  setState: (state: SerializedEditorState) => void;
  reset: () => void;
  // resetInitialValue: () => void;
}

export function Wysiwyg({
  floatingPosition = "bottom",
  extendedToolbar = true,
  proseCompact = false,
  initialValue,
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
    ...(initialValue ? { editorState: JSON.stringify(initialValue.state) } : {}),
  }));

  const editorRef = useRef<LexicalEditor>(null!);
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useImperativeHandle(ref, () => {
    return {
      getValue: async () =>
        new Promise((resolve) => {
          const editor = editorRef.current;
          editor.read(() => {
            const htmlString = $generateHtmlFromNodes(editor);
            resolve({
              html: htmlString,
              state: editor.getEditorState().toJSON(),
            });
          });
        }),
      setHtml: (nextHtml: string) => {
        const editor = editorRef.current;

        if (editor) {
          editor.update(() => {
            $loadFromHtml(editor, nextHtml);
          });
        }
      },
      getState: () => {
        return editorRef.current.getEditorState().toJSON();
      },
      setState: (editorState: SerializedEditorState) => {
        const editor = editorRef.current;
        const parsedEditorState = editor.parseEditorState(editorState);
        editor.setEditorState(parsedEditorState);
      },

      reset: () => {
        const editor = editorRef.current;

        if (editor) {
          editor.update(() => {
            const root = $getRoot();
            root.getChildren().forEach((node) => {
              node.remove();
            });
          });
        }
      },
    };
  });

  return (
    <div className="relative z-(--index-wysiwyg) w-full">
      <LexicalComposer initialConfig={fullInitialConfig}>
        <CustomAutoLinkPlugin />
        <CustomLinkPlugin />
        <HorizontalRulePlugin />
        <ListPlugin />
        <EditorRefPlugin editorRef={editorRef} />
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
