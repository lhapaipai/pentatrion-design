import { SerializedEditorState } from "lexical";
import { z } from "zod/v4-mini";

export type WysiwygValue = {
  html?: string;
  state: SerializedEditorState;
};

export const wysiwygSchema = z.object({
  html: z.optional(z.string()),
  state: z.looseObject({}),
});
