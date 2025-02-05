# [Pentatrion Design System](https://design.pentatrion.com)

<a href="https://design.pentatrion.com">
<img src="https://raw.githubusercontent.com/lhapaipai/pentatrion-design/main/screenshot.png" alt="Pentatrion design system" />
</a>

## Prérequis

Créez un nouveau projet Vite + React v19 + TailwindCSS v4. [Official doc](https://tailwindcss.com/docs/installation/using-vite)

```bash
pnpm create vite my-app

# 1. React
# 2. TypeScript + SWC

cd my-app

pnpm add -D tailwindcss @tailwindcss/vite prettier-plugin-tailwindcss

pnpm add pentatrion-design
```
Supprimer les fichiers inutiles

```
.
└── src
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    └── vite-env.d.ts
```

Configuration de vite

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

Mettre à jour le fichier `src/index.css`

```css
@import "tailwindcss";

@source "./node_modules/pentatrion-design/dist/lib";
@source "./node_modules/pentatrion-design/dist/components";
@source "./node_modules/pentatrion-design/dist/hooks";
@source "./node_modules/pentatrion-design/dist/redux";

@import "pentatrion-design/tailwind/index.css";

/* facultatif */
@import "pentatrion-design/tailwind/base-prose.css";
```

si on désire plus de contrôle sur nos imports

```css
@import "tailwindcss";

@source "./node_modules/pentatrion-design/dist/lib";
@source "./node_modules/pentatrion-design/dist/components";
@source "./node_modules/pentatrion-design/dist/hooks";
@source "./node_modules/pentatrion-design/dist/redux";

@import "pentatrion-design/tailwind/variants.css";

@import "pentatrion-design/tailwind/vars.css" layer(base);
@import "pentatrion-design/tailwind/base.css" layer(base);
@import "pentatrion-design/tailwind/base-prose.css";

@import "pentatrion-design/tailwind/components-input-outline.css" layer(components);
@import "pentatrion-design/tailwind/components-range.css" layer(components);
@import "pentatrion-design/tailwind/components-resize-area.css" layer(components);
@import "pentatrion-design/tailwind/components-step.css" layer(components);
@import "pentatrion-design/tailwind/components.css" layer(components);

@import "pentatrion-design/tailwind/utilities.css";
@import "pentatrion-design/tailwind/utilities-dialog.css" layer(utilities);

```

```json
// .prettierrc
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

La dépendance `pentatrion-fonts` est optionnelle.

Mettre à jour `src/App.tsx`
```tsx
import { Button } from "pentatrion-design/button";

import { useState } from "react"

function App() {
  const [counter, setCounter] = useState(0);

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="text-gray-6">Vite + React</h1>
      <Button onClick={() => setCounter(c => c + 1)}>Click me !</Button>
      <p>{counter}</p>
    </div>
  )
}

export default App
```

## VsCode


Create a `.vscode/settings.json` file

```json
{
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## Développement avec watch

anciennement dans le `package.json`. plus nécessaire pour le moment

```json
{
  "scripts": {
    "dev:tsc": "tsc -w -p tsconfig.build.json",
    "dev:alias": "tsc-alias -w -p tsconfig.build.json",
    "dev": "run-p dev:tsc dev:alias",
  }
}
```

## Inclure le design-system dans un autre projet sans dépendance npm

fichier `tsconfig.json`.
```json
{
  "compilerOptions": {
    "paths": {
      "pentatrion-design/*": ["./*"]
    },
  }
}
```
