import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { WysiwygValue } from "../types";

interface Props {
  wait: number;
  onChange?: (value: WysiwygValue) => void;
}

export function LazyOnChangePlugin({ wait, onChange }: Props) {
  const [editor] = useLexicalComposerContext();

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    function notifyChange() {
      onChangeRef.current?.({
        state: editor.getEditorState().toJSON(),
      });
    }

    const debouncedNotifyChange = debounce(notifyChange, wait);

    const unregister = editor.registerUpdateListener(() => {
      debouncedNotifyChange();
    });

    return () => {
      unregister();
      debouncedNotifyChange.cancel();
    };
  }, [editor, wait]);

  return null;
}
