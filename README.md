# [Pentatrion Design System](https://design.pentatrion.com)

<a href="https://design.pentatrion.com">
<img src="https://raw.githubusercontent.com/lhapaipai/pentatrion-design/main/screenshot.png" alt="Pentatrion design system" />
</a>

## Prérequis

Créez un nouveau projet Vite + React + TailwindCSS. [Official doc](https://tailwindcss.com/docs/guides/vite)

```bash
pnpm create vite my-app

# 1. React
# 2. TypeScript + SWC

cd my-app

pnpm add -D tailwindcss postcss autoprefixer postcss-load-config prettier-plugin-tailwindcss

# si vous utilisez le composant <input type="range" />
pnpm add -D postcss-input-range

pnpm add pentatrion-design
```
Supprimer les fichiers inutiles

```
.
├── src
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tailwind.config.js
└── postcss.config.js
```

Créer un fichier `tailwind.config.js` et `postcss.config.js`.

```js
// tailwind.config.ts
import { pentatrionTw } from "pentatrion-design/tailwind";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "./node_modules/pentatrion-design/dist/lib/**/*.js",
    "./node_modules/pentatrion-design/dist/components/**/*.js",
    "./node_modules/pentatrion-design/dist/hooks/**/*.js",
    "./node_modules/pentatrion-design/dist/redux/**/*.js",
  ],
  darkMode: ["class"],
  theme: {},
  plugins: [pentatrionTw],
} satisfies Config;


// postcss.config.js
/** @type {import("postcss-load-config").Config} */
const config = {
  plugins: {
    "tailwindcss/nesting": {},
    tailwindcss: {},

    // si vous utilisez le composant <input type="range" />
    // bien le mettre en dernier car tailwind génère du contenu à transformer
    "postcss-input-range": {}
  },
};
export default config;
```

Mettre à jour le fichier `src/index.css`
```css
/**
 * on utilisera des imports pour faciliter l'intégration du design système
 */
@import "tailwindcss/base";
@import "pentatrion-design/tailwind/vars.css" layer(base);
@import "pentatrion-design/tailwind/base.css" layer(base);

@import "tailwindcss/components";
@import "pentatrion-design/tailwind/components.css" layer(components);
@import "pentatrion-design/tailwind/components-input-outline.css" layer(components);
@import "pentatrion-design/tailwind/components-resize-area.css" layer(components);
@import "pentatrion-design/tailwind/components-step.css" layer(components);

@import "tailwindcss/utilities";
@import "pentatrion-design/tailwind/utilities.css" layer(utilities);
@import "pentatrion-design/tailwind/utilities-dialog.css" layer(utilities);

/* Optionel */
@import "pentatrion-fonts/fontello-lonlat";
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

## Inclure le design-système dans un autre projet sans dépendance npm

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
