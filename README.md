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

# dépendances
pnpm add -D tailwindcss @tailwindcss/vite prettier-plugin-tailwindcss

pnpm add pentatrion-design clsx class-variance-authority
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

Configuration recommandée

```css
/* src/index.css */
@import "tailwindcss";

@source "../node_modules/pentatrion-design/dist/components";
@source "../node_modules/pentatrion-design/dist/hooks";

@import "pentatrion-design/tailwind";

/* facultatif */
@import "pentatrion-design/tailwind/prose.css";

html {
  font-size: 16px;
  line-height: 24px;
  color-scheme: normal;
}
body {
  @apply bg-gray-0 text-gray-7 font-sans;
}
```

si on désire plus de contrôle sur nos imports

```css
/* src/index.css */
@import "tailwindcss";

@source "./node_modules/pentatrion-design/dist/components";

@import "pentatrion-design/tailwind/theme.css";
@import "pentatrion-design/tailwind/variants.css";
@import "pentatrion-design/tailwind/utilities.css";
@import "pentatrion-design/tailwind/base.css" layer(base);
@import "pentatrion-design/tailwind/components/index.css" layer(components);

@import "pentatrion-design/tailwind/prose.css";
```

```jsonc
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
