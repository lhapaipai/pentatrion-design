import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CAN_USE_BEFORE_INPUT, IS_APPLE_WEBKIT, IS_IOS, IS_SAFARI } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  KEY_ENTER_COMMAND,
} from "lexical";
import type { KeyboardEvent } from "react";
import { useEffect } from "react";

interface SubmitOnEnterPluginProps {
  /**
   * When true, Shift+Enter or Ctrl+Enter submits the form and Enter inserts
   * a newline (inverse of the default Enter-to-submit behavior).
   */
  submitOnShiftOrCtrlEnter?: boolean;
}

export function SubmitOnEnterPlugin({
  submitOnShiftOrCtrlEnter = false,
}: SubmitOnEnterPluginProps) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand<KeyboardEvent | null>(
      KEY_ENTER_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        console.log("submit", event);
        if (event !== null) {
          // If we have beforeinput, then we can avoid blocking
          // the default behavior. This ensures that the iOS can
          // intercept that we're actually inserting a paragraph,
          // and autocomplete, autocapitalize etc work as intended.
          // This can also cause a strange performance issue in
          // Safari, where there is a noticeable pause due to
          // preventing the key down of enter.
          /**
           * Warning: when you use devtools the browser UserAgent is modified and
           * all constants are true.
           */
          if ((IS_IOS || IS_SAFARI || IS_APPLE_WEBKIT) && CAN_USE_BEFORE_INPUT) {
            return false;
          }
          event.preventDefault();
          if (
            submitOnShiftOrCtrlEnter
              ? !(event.shiftKey || event.ctrlKey)
              : event.shiftKey
          ) {
            return false;
          }
        }

        const form = document.activeElement?.closest<HTMLFormElement>("form");
        form?.requestSubmit();
        return true;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, submitOnShiftOrCtrlEnter]);
  return null;
}
