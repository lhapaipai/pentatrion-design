import { SerializedEditorState } from "lexical";

export function isStateEmpty(state: SerializedEditorState): boolean {
  const children = state.root.children as Array<{ children?: unknown[] }>;
  return children.every((node) => (node.children?.length ?? 0) === 0);
}
