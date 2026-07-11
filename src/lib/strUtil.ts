export function slugify(str: string, allowSlash: boolean = true, trimTrailing: boolean = true) {
  const normalized = str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

  const allowedChars = allowSlash ? /[^a-z0-9/]+/g : /[^a-z0-9]+/g;

  const collapsed = normalized.replace(allowedChars, "-").replace(/-{2,}/g, "-").replace(/^-+/, "");

  return trimTrailing ? collapsed.replace(/-+$/, "") : collapsed;
}
