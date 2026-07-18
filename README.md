# [Pentatrion Design System](https://design.pentatrion.com)

<a href="https://design.pentatrion.com">
<img src="https://raw.githubusercontent.com/lhapaipai/pentatrion-design/main/screenshot.png" alt="Pentatrion design system" />
</a>

## Prérequis

Créez un nouveau projet Vite + React v19 + TailwindCSS v4. [Official doc](https://tailwindcss.com/docs/installation/using-vite)

```bash
npm create vite@latest my-app

# 1. React
# 2. TypeScript + SWC

cd my-app

# dépendances
npm i -D tailwindcss @tailwindcss/vite prettier-plugin-tailwindcss

npm i pentatrion-design clsx class-variance-authority
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

@source "./node_modules/pentatrion-design/dist/components";
@source "./node_modules/pentatrion-design/dist/hooks";

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
@source "./node_modules/pentatrion-design/dist/hooks";

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

## Développement et release

### Développement

Pas d'étape de build nécessaire : en mode développement, `package.json` pointe directement vers `src/*.ts` (`update-pkg-mode.mjs` ne bascule vers `dist/*` qu'en CI, juste avant publication).

```bash
npm run storybook    # storybook dev, pour visualiser/tester les composants isolément
npm run ci           # lint + types + tests, à lancer avant de proposer une PR
```

### Changesets

Chaque changement notable (nouveau composant, fix, breaking change) doit s'accompagner d'un changeset :

```bash
npx changeset add
```

Répondre au questionnaire (package concerné, type de bump `patch`/`minor`/`major`, résumé du changement). Ça crée un fichier dans `.changeset/` qui sera consommé au moment de la release. Un changeset par changement, autant que nécessaire avant de releaser.

### Release

Quand on est prêt à publier une nouvelle version :

```bash
npx changeset version   # bump package.json + génère/complète CHANGELOG.md, supprime les changesets consommés
git add -A
git commit -m "chore: release"
git push
```

Le push sur `main` déclenche `.github/workflows/release.yml`, qui :

1. Compare la version de `package.json` à celle publiée sur npm.
2. Si elle a changé : typecheck, build, publie sur npm (`--provenance --access public`), pousse un tag `vX.Y.Z`, crée la release GitHub correspondante.

Aucune autre action manuelle n'est nécessaire — pas de tag ni de release GitHub à créer soi-même.

### Storybook

Une fois `release.yml` terminé avec succès, `.github/workflows/deploy-storybook.yml` se déclenche automatiquement (`workflow_run`) et republie [design.pentatrion.com](https://design.pentatrion.com) avec la version tout juste publiée.

