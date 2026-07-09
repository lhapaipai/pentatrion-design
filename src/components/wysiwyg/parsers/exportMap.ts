/**
 * check the original code at
 * https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/App.tsx
 */

import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import type {
  DOMExportOutput,
  DOMExportOutputMap,
  Klass,
  LexicalEditor,
  LexicalNode,
} from "lexical";
import { isHTMLElement, ParagraphNode, TextNode } from "lexical";

const removeStylesExportDOM = (editor: LexicalEditor, target: LexicalNode): DOMExportOutput => {
  const output = target.exportDOM(editor);
  // @ts-ignore
  if (output && isHTMLElement(output.element)) {
    // Remove all inline styles and classes if the element is an HTMLElement
    // Children are checked as well since TextNode can be nested
    // in i, b, and strong tags.
    for (const el of [
      output.element,
      ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
    ]) {
      el.removeAttribute("class");

      const style = el.getAttribute("style");
      let textAlign: string | null = null;
      if (style) {
        const match = style.match(/text-align\s*:\s*([^;]+)\s*;?/i);
        if (match) {
          textAlign = match[1].trim();
        }
      }

      el.removeAttribute("style");
      if (textAlign) {
        (el as HTMLElement).style.textAlign = textAlign;
      }

      if (el.getAttribute("dir") === "ltr") {
        el.removeAttribute("dir");
      }
    }
  }
  return output;
};

export const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [HeadingNode, removeStylesExportDOM],
  [AutoLinkNode, removeStylesExportDOM],
  [LinkNode, removeStylesExportDOM],
  [ListNode, removeStylesExportDOM],
  [ListItemNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
  [QuoteNode, removeStylesExportDOM],
]);
