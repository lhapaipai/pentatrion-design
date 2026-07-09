import type { ReactNode, RefObject } from "react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import clsx from "clsx";
import type { LexicalEditor } from "lexical";
import { $getRoot } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";

import { $generateHtmlFromNodes } from "@lexical/html";

import { ToolbarPlugin } from "./plugins/ToolbarPlugin";
import type { LazyOnChangeArgs } from "./plugins/LazyOnChangePlugin";
import { LazyOnChangePlugin } from "./plugins/LazyOnChangePlugin";
import { CustomAutoLinkPlugin } from "./plugins/AutoLinkPlugin";
import { FloatingLinkEditorPlugin } from "./plugins/FloatingLinkEditorPlugin";
import { CustomLinkPlugin } from "./plugins/LinkPlugin";

import { editorConfig } from "./config";
import { $loadFromHtml } from "./config/html";
import type { ToolbarVariantProps } from "./style";
import { contentEditableStyles } from "./style";
import { ToolbarContext } from "./ToolbarContext";

interface Props {
  extendedToolbar?: boolean;
  floatingPosition?: "top" | "bottom";
  proseClassName?: string;
  initialHtml?: string;

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
  lazyOnChange?: number | false;
  onChange?: ({ html }: LazyOnChangeArgs) => void;
  children?: ReactNode;
}
export interface WysiwygRef {
  getHtml: () => Promise<string>;
  setHtml: (html: string) => void;
  reset: () => void;
  resetInitialValue: () => void;
}

export function Wysiwyg({
  floatingPosition = "bottom",
  extendedToolbar = true,
  proseCompact = false,
  initialHtml,
  contentEditableBaseStyle = "normal",
  contentEditableClassName,
  containerClassName,
  ref,
  toolbarSticky,
  toolbarVisible,
  lazyOnChange = false,
  onChange,
  children,
}: Props) {
  const editorRef = useRef<LexicalEditor>(null!);
  const [initialValue, setInitialValue] = useState<string | null>(null);
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useImperativeHandle(ref, () => {
    return {
      getHtml: async () =>
        new Promise((resolve) => {
          editorRef.current.read(() => {
            const htmlString = $generateHtmlFromNodes(editorRef.current);
            resolve(htmlString);
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
      reset: () => {
        const editor = editorRef.current;

        if (editor) {
          editor.update(() => {
            const root = $getRoot();
            root.getChildren().forEach((node) => {
              node.remove();
            });
          });
          setInitialValue(null);
        }
      },
      resetInitialValue: () => {
        setInitialValue(null);
      },
    };
  });

  /**
   * it could be possible to import html with initialisation but they can
   * be issues with DOMParser in SSR environment.
   */
  useEffect(() => {
    const editor = editorRef.current;

    if (editor && initialHtml) {
      editor.update(() => {
        $loadFromHtml(editor, initialHtml);
      });
    }
    // initialHtml must not be a dep dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative z-(--index-wysiwyg) w-full">
      <LexicalComposer initialConfig={editorConfig}>
        <CustomAutoLinkPlugin />
        <CustomLinkPlugin />
        <HorizontalRulePlugin />
        <ListPlugin />
        <EditorRefPlugin editorRef={editorRef} />
        {lazyOnChange && (
          <LazyOnChangePlugin
            initialValue={initialValue}
            setInitialValue={setInitialValue}
            wait={lazyOnChange}
            onChange={onChange}
          />
        )}
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
