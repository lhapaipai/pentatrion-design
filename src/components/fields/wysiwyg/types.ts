import { SerializedEditorState } from "lexical";
import { z } from "zod/v4-mini";

export type WysiwygValue = {
  html?: string;
  state: SerializedEditorState;
};

export const wysiwygSchema = z.object({
  html: z.optional(z.string()),
  state: z.custom<SerializedEditorState>(),
});

// renvoie `undefined` (convention Zod pour "absent", cf. z.optional()) plutôt que `null`
// (convention Conform) : c'est au point d'appel `useControl.parse` d'adapter avec `?? null`
export function parseWysiwygValue(payload: unknown): WysiwygValue | undefined {
  if (payload == null || payload === "") {
    return undefined;
  }
  if (typeof payload !== "string") {
    throw new Error("wysiwyg value must be a JSON string");
  }
  try {
    return JSON.parse(payload);
  } catch {
    // JSON corrompu (ex. donnée persistée avant une migration de schéma) : on dégrade
    // gracieusement vers "absent" plutôt que de faire planter le rendu du champ.
    return undefined;
  }
}

export function serializeWysiwygValue(value: WysiwygValue | null | undefined): string | null {
  return value == null ? null : JSON.stringify(value);
}
