import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { $generateHtmlFromNodes } from "@lexical/html";

export type LazyOnChangeArgs = { html: string };

interface Props {
  wait: number;
  onChange?: ({ html }: LazyOnChangeArgs) => void;
  initialValue: string | null;
  setInitialValue: Dispatch<SetStateAction<string | null>>;
}

export function LazyOnChangePlugin({ wait, onChange, initialValue, setInitialValue }: Props) {
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
        /**
         * On first render
         * provided Html can differ to generated Html even if the value is the same.
         * ex:
         *  provided : <p style="text-align:center">hello</p><hr />
         *  generated: <p style="text-align: center;">hello</p><hr>
         *
         * when registerUpdateListener is called the first time, we generate html from lexical
         * and consider content as initialValue that is used as reference to compare before trigger
         * a onChange event.
         *
         * It's important if we want to use the form dirty state.
         */
        if (initialValue === null) {
          setInitialValue(htmlContent);
          return;
        }

        if (htmlContent !== initialValue) {
          onChangeRef.current?.({
            html: htmlContent,
          });
        }
      });
    }

    const debouncedTriggerHtmlRender = debounce(triggerHtmlRender, wait);

    return editor.registerUpdateListener(() => {
      debouncedTriggerHtmlRender();
    });
  }, [editor, wait, initialValue, setInitialValue]);

  return null;
}
