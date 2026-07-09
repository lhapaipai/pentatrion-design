import type { LexicalEditor } from "lexical";
import { $getRoot, $insertNodes, $setSelection } from "lexical";

import { $generateNodesFromDOM } from "@lexical/html";

export function importHtmlIntoEditor(initialHtml?: string) {
  if (!initialHtml) {
    return undefined;
  }
  return (editor: LexicalEditor) => {
    editor.update(() => {
      $loadFromHtml(editor, initialHtml);
    });
  };
}

export function $loadFromHtml(editor: LexicalEditor, htmlContent: string) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(htmlContent, "text/html");
  const nodes = $generateNodesFromDOM(editor, dom);

  const root = $getRoot();
  root.getChildren().forEach((node) => {
    node.remove();
  });

  $insertNodes(nodes);

  $setSelection(null);
}
