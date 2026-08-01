import { z } from "zod/v4-mini";

export const mediaSchema = z.object({
  id: z.string(),
  origin: z.enum(["s3Upload", "localUpload", "external", "asset"]),
  category: z.string(),
  mimeType: z.string(),
  width: z.optional(z.coerce.number().check(z.int())),
  height: z.optional(z.coerce.number().check(z.int())),
  size: z._default(z.nullable(z.coerce.number().check(z.int())), null),
  src: z.string(),
});

export type Media = z.infer<typeof mediaSchema>;

export function parseMediaValue(payload: unknown): Media | undefined {
  if (payload == null || payload === "") {
    return undefined;
  }
  if (typeof payload !== "string") {
    throw new Error("media value must be a JSON string");
  }
  try {
    return JSON.parse(payload);
  } catch {
    // JSON corrompu (ex. donnée persistée avant une migration de schéma) : on dégrade
    // gracieusement vers "absent" plutôt que de faire planter le rendu du champ.
    return undefined;
  }
}

export function serializeMediaValue(value: unknown): string | null {
  return value == null ? null : typeof value === "string" ? value : JSON.stringify(value);
}
