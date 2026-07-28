import { z } from "zod/v4-mini";

export const mediaSchema = z.object({
  id: z.string(),
  category: z.string(),
  mimeType: z.string(),
  width: z._default(z.nullable(z.coerce.number().check(z.int())), null),
  height: z._default(z.nullable(z.coerce.number().check(z.int())), null),
  origin: z.enum(["s3Upload", "localUpload", "external", "asset"]),
  src: z.string(),
  // in bytes
  size: z._default(z.nullable(z.coerce.number().check(z.int())), null),
});

export type Media = z.infer<typeof mediaSchema>;

export type MediaImage = Omit<Media, "width" | "height"> & {
  width: number;
  height: number;
};

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
