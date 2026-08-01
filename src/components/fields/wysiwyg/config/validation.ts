import { createEditor, SerializedEditorState } from "lexical";
import { editorConfig } from "./editor";

export function isPlausibleLexicalState(state: unknown): state is SerializedEditorState {
  if (typeof state !== "object" || state === null) return false;
  const root = (state as { root?: unknown }).root;
  return (
    typeof root === "object" &&
    root !== null &&
    (root as { type?: unknown }).type === "root" &&
    Array.isArray((root as { children?: unknown }).children)
  );
}

// non utilisée directement dans le flux de validation actuel : `generateHtmlFromLexicalState`
// (via `stateToHtml`) appelle déjà `editor.parseEditorState` en interne, ce qui
// fournit la même garantie en évitant un second parse. Conservée comme utilitaire public
// pour un appelant qui voudrait valider sans avoir besoin du HTML généré.
export function isValidLexicalState(state: unknown): state is SerializedEditorState {
  try {
    const editor = createEditor({
      ...editorConfig,
      onError(err) {
        throw err;
      },
    });
    editor.parseEditorState(state as SerializedEditorState);
    return true;
  } catch {
    return false;
  }
}
