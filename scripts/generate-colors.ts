import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { formatHex } from "culori";
import rawColors from "tailwindcss/colors";

// mêmes alias dépréciés que dans src/lib/color.ts
const deprecatedAliases = ["blueGray", "coolGray", "trueGray", "warmGray", "lightBlue"];

const groups = Object.entries(rawColors).filter(
  ([name, colorGroup]) => typeof colorGroup !== "string" && !deprecatedAliases.includes(name),
) as [string, Record<string, string>][];

const rawColorsHex = Object.fromEntries(
  groups.map(([name, colorGroup]) => [
    name,
    Object.fromEntries(
      Object.entries(colorGroup).map(([shade, oklch]) => [shade, formatHex(oklch)]),
    ),
  ]),
);

const outPath = fileURLToPath(new URL("../src/lib/colors.generated.ts", import.meta.url));

const content = `// généré par scripts/generate-colors.ts à partir de tailwindcss/colors (oklch -> hex via culori)
export const rawColorsHex = ${JSON.stringify(rawColorsHex, null, 2)} as const;
`;

writeFileSync(outPath, content);
console.log(`écrit : ${outPath}`);
