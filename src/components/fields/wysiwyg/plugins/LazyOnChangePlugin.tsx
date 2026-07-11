import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { $generateHtmlFromNodes } from "@lexical/html";
import { WysiwygValue } from "../types";

interface Props {
  wait: number;
  onChange?: ({ html }: WysiwygValue) => void;
}

export function LazyOnChangePlugin({ wait, onChange }: Props) {
  const [editor] = useLexicalComposerContext();

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    function triggerHtmlRender() {
      if (!onChangeRef.current) {
        return;
      }

      editor.read(() => {
        const htmlContent = $generateHtmlFromNodes(editor);

        onChangeRef.current?.({
          html: htmlContent,
          state: editor.getEditorState().toJSON(),
        });
      });
    }

    const debouncedTriggerHtmlRender = debounce(triggerHtmlRender, wait);

    return editor.registerUpdateListener(() => {
      debouncedTriggerHtmlRender();
    });
  }, [editor, wait]);

  return null;
}
