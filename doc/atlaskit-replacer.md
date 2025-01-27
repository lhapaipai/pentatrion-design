bien spécifier l'extension `.cjs`

```json
{
  "scripts": {
    "compile-replacer": "tsc ./scripts/atlaskit-replacer.ts --module commonjs --target es2017"
  }
}
```
```json
{
  "extends": "./tsconfig.json",
  "include": ["src/**/*.ts"],
  "exclude": ["**/node_modules", "**/*.stories.ts", "**/*.stories.tsx", "**/*.test.ts"],
  "tsc-alias": {
    "resolveFullPaths": true,
    "replacers": {
      "atlaskit": {
        "enabled": true,
        "file": "./scripts/atlaskit-replacer.cjs"
      }
    }
  },
  "compilerOptions": {
    "rootDir": "./src",
    "noEmit": false
  }
}
```

```cjs
import { AliasReplacer, AliasReplacerArguments } from "tsc-alias";

const exampleReplacer: AliasReplacer = ({ orig }) => {
  if (orig.startsWith('from "@atlaskit/pragmatic-drag-and-drop/')) {
    console.log(orig);
    const replaced = orig.replace(
      /@atlaskit\/pragmatic-drag-and-drop\/([-/a-zA-Z0-9]*)/,
      "./node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/entry-point/$1.js",
    );
    console.log(replaced, "\n");
    return replaced;
  } else if (orig.startsWith('from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/')) {
    console.log(orig);
    const replaced = orig.replace(
      /@atlaskit\/pragmatic-drag-and-drop-hitbox\/util\/([-/a-zA-Z0-9]*)/,
      "./node_modules/@atlaskit/pragmatic-drag-and-drop-hitbox/dist/esm/$1.js",
    );
    console.log(replaced, "\n");
    return replaced;
  } else if (orig.startsWith('from "@atlaskit/pragmatic-drag-and-drop-hitbox/')) {
    console.log(orig);
    const replaced = orig.replace(
      /@atlaskit\/pragmatic-drag-and-drop-hitbox\/([-/a-zA-Z0-9]*)/,
      "./node_modules/@atlaskit/pragmatic-drag-and-drop-hitbox/dist/esm/$1.js",
    );
    console.log(replaced, "\n");
    return replaced;
  } else if (orig.startsWith('from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/')) {
    console.log(orig);
    const replaced = orig.replace(
      /@atlaskit\/pragmatic-drag-and-drop-auto-scroll\/([-/a-zA-Z0-9]*)/,
      "./node_modules/@atlaskit/pragmatic-drag-and-drop-auto-scroll/dist/esm/entry-point/$1.js",
    );
    console.log(replaced, "\n");
    return replaced;
  }
  return orig;
};

export default exampleReplacer;

const tests = [
  { orig: 'from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"' },
  { orig: 'from "@atlaskit/pragmatic-drag-and-drop/element/adapter"' },
  { orig: 'from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"' },
  { orig: 'from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview"' },
  { orig: 'from "@atlaskit/pragmatic-drag-and-drop/combine"' },
  { orig: 'from "@atlaskit/pragmatic-drag-and-drop/element/adapter"' },
  { orig: 'from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"' },
  { orig: 'from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge"' },
  { orig: 'from "@atlaskit/pragmatic-drag-and-drop/types"' },
] as AliasReplacerArguments[];

tests.forEach(exampleReplacer);
```
