import { SerializedEditorState } from "lexical";
import { z } from "zod/v4-mini";
import { isPlausibleLexicalState } from "./config/validation";

export type WysiwygValue = {
  html?: string;
  state: SerializedEditorState;
};

const maxContentBytes = 100_000; // à trancher ensemble

export const wysiwygSchema = z.object({
  html: z.optional(z.string()),
  state: z
    .custom<SerializedEditorState>(isPlausibleLexicalState)
    .check(z.refine((state) => JSON.stringify(state).length <= maxContentBytes)),
});

// renvoie `undefined` (convention Zod pour "absent", cf. z.optional()) plutôt que `null`
// (convention Conform) : c'est au point d'appel `useControl.parse` d'adapter avec `?? null`
export function parseWysiwygValue(payload: unknown) {
  if (payload == null || payload === "") {
    return null;
  }
  if (typeof payload !== "string") {
    throw new Error("wysiwyg value must be a JSON string");
  }
  try {
    return JSON.parse(payload) as WysiwygValue;
  } catch {
    // JSON corrompu (ex. donnée persistée avant une migration de schéma) : on dégrade
    // gracieusement vers "absent" plutôt que de faire planter le rendu du champ.
    return null;
  }
}

// trie récursivement les clés des objets rencontrés afin que deux states lexical
// sémantiquement identiques mais générés avec un ordre de clés différent produisent
// la même chaîne (nécessaire pour une comparaison isDirty fiable)
function sortKeysReplacer(_key: string, value: unknown): unknown {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((sorted, key) => {
        sorted[key] = (value as Record<string, unknown>)[key];
        return sorted;
      }, {});
  }
  return value;
}

export function serializeWysiwygValue(value: unknown): string | null {
  try {
    return value == null
      ? null
      : typeof value === "string"
        ? value
        : JSON.stringify({ state: (value as WysiwygValue).state }, sortKeysReplacer);
  } catch {
    return null;
  }
}
