#!/usr/bin/env node
// Set package.json main/types/exports to either "source" mode (src/*.ts, for
// local dev/debug) or "publish" mode (dist/*, what CI sets before `npm publish`).
//
// Unlike a hand-maintained list of entry points, this derives the "src" path
// from the "dist" path already present in package.json, so adding/removing
// an export doesn't require touching this script — as long as the src file
// mirrors the dist file 1:1 (dist/foo/index.d.mts <-> src/foo/index.ts).
//
// Usage: node update-pkg-mode.mjs <src|dist>
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const mode = process.argv[2];
if (mode !== "src" && mode !== "dist") {
  console.error("Usage: node update-pkg-mode.mjs <src|dist>");
  process.exit(1);
}

const pkgPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

// dist/foo/bar/index.d.mts -> src/foo/bar/index.ts
// dist/foo/bar/index.mjs   -> src/foo/bar/index.ts
// dist/style.css           -> src/style/index.css (special-cased below)
function distToSrc(distPath) {
  if (!distPath.startsWith("./dist/")) return null;
  let rel = distPath.slice("./dist/".length);
  if (rel === "style.css") return "./src/style/index.css";
  rel = rel.replace(/\.d\.mts$/, ".ts").replace(/\.mjs$/, ".ts");
  return `./src/${rel}`;
}

function srcToDist(srcPath, kind) {
  // kind: "types" | "default"
  let rel = srcPath.slice("./src/".length);
  if (rel === "style/index.css") return "./dist/style.css";
  if (kind === "types") return `./dist/${rel.replace(/\.ts$/, ".d.mts")}`;
  return `./dist/${rel.replace(/\.ts$/, ".mjs")}`;
}

let changed = 0;

function setEntry(distValue, kind) {
  // distValue is whatever currently sits in the field (src or dist form).
  // Normalize to dist form first, then convert to the requested mode.
  let distForm = distValue.startsWith("./dist/") ? distValue : null;
  if (!distForm) {
    // currently in src mode; recompute the dist equivalent
    distForm = srcToDist(distValue, kind);
  }
  if (mode === "dist") return distForm;
  const src = distToSrc(distForm);
  if (!src) return distValue; // not a dist-managed path (e.g. ./tailwind), leave untouched
  return src;
}

pkg.main = setEntry(pkg.main, "default");
pkg.types = setEntry(pkg.types, "types");

for (const [_key, value] of Object.entries(pkg.exports)) {
  if (typeof value === "string") continue; // e.g. "./tailwind": "./src/tailwind/index.css" — not dist-managed
  if (value.types) value.types = setEntry(value.types, "types");
  if (value.default) value.default = setEntry(value.default, "default");
  changed++;
}

// verify every resolved path actually exists, to catch drift/typos early
const root = path.dirname(pkgPath);
function checkExists(p) {
  const abs = path.join(root, p);
  if (!existsSync(abs)) {
    console.warn(`  ! missing file: ${p}`);
  }
}
checkExists(pkg.main);
checkExists(pkg.types);
for (const value of Object.values(pkg.exports)) {
  if (typeof value === "string") continue;
  if (value.types) checkExists(value.types);
  if (value.default) checkExists(value.default);
}

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(
  `Set package.json to ${mode === "src" ? "source mode (src/*.ts)" : "publish mode (dist/*)"} — ${changed} export entries updated`,
);
