import type { LexicalEditor, SerializedEditorState } from "lexical";
import { $getRoot, $insertNodes, $setSelection, createEditor } from "lexical";

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";

import { editorConfig } from "./editor";

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

/**
 * Sérialise un `state` en HTML statique via un éditeur jetable (jamais monté dans le DOM),
 * pour un affichage en lecture seule sans payer le coût d'un LexicalComposer complet.
 */
export function stateToHtml(state: SerializedEditorState): string {
  const { namespace, nodes, theme, html } = editorConfig;
  const editor = createEditor({
    namespace,
    nodes,
    theme,
    html,
    onError(error) {
      throw error;
    },
  });
  const parsedState = editor.parseEditorState(state);
  editor.setEditorState(parsedState);

  return editor.read(() => $generateHtmlFromNodes(editor));
}
