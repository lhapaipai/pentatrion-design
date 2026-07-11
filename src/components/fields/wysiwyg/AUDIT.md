# Audit qualité — composant Wysiwyg

Date : 2026-07-11

Périmètre : [Wysiwyg.tsx](./Wysiwyg.tsx) et les fichiers connexes touchés par la migration
`HorizontalRulePlugin` / typage `WysiwygValue`.

## Bugs / risques réels



2. **`ref.reset()` ne restaure pas `initialValue`, il vide**
   [Wysiwyg.tsx:124-136](./Wysiwyg.tsx#L124-L136). Le nom `reset` suggère "revenir à l'état
   initial", mais l'implémentation supprime tous les enfants du root (page blanche), sans
   recharger `initialValue`. L'ancienne version avait un `resetInitialValue()` séparé qui a
   disparu — à vérifier si c'est voulu ; sinon `reset` mériterait un nom du style `clear()`.

3. **`editorRef = useRef<LexicalEditor>(null!)`**
   [Wysiwyg.tsx:84](./Wysiwyg.tsx#L84). Le `null!` masque le typage mais pas le runtime : si
   une méthode du `ref` (`getValue`, `reset`, etc.) est appelée avant que `EditorRefPlugin`
   ait assigné l'éditeur, ça crashe. Peu probable en pratique vu l'ordre des effets, mais
   fragile — pas de garde défensive.

## API smell

4. **`proseClassName` est une prop morte**
   [Wysiwyg.tsx:33](./Wysiwyg.tsx#L33). Déclarée dans `Props` mais jamais utilisée dans le
   corps du composant. Soit elle a été oubliée lors d'un refactor précédent (le vrai levier
   est `contentEditableClassName`), soit à retirer.

## Ailleurs dans l'arbre du composant (impacté par la même feature)

5. **`LazyOnChangePlugin` ne `cancel()` jamais le debounce**
   [plugins/LazyOnChangePlugin.tsx:34-38](./plugins/LazyOnChangePlugin.tsx#L34-L38). Le
   cleanup ne fait que `unregister` l'update listener, pas
   `debouncedTriggerHtmlRender.cancel()`. Si `wait` change ou que le composant démonte
   pendant la fenêtre de debounce, l'ancien timer peut encore se déclencher et appeler
   `onChangeRef.current` sur un éditeur qu'on ne veut plus notifier.

6. **`toolbarVariants.sticky` a deux variantes identiques**
   [style.ts:6-8](./style.ts#L6-L8) : `mobileOnly` et `allDevice` ont exactement la même
   valeur de classes (`"max-lg:sticky max-lg:top-0 max-lg:backdrop-blur-xs lg:rounded-t-2xl"`).
   Soit un bug (elles devraient différer, `allDevice` étant censé être sticky aussi en
   desktop), soit une variante dupliquée à fusionner.

7. **Import CSS side-effect non résolu par `tsc`**
   [plugins/FloatingLinkEditorPlugin.tsx:28](./plugins/FloatingLinkEditorPlugin.tsx#L28)
   importe `./index.css`, qui existe bien (`plugins/index.css`), mais `tsc --noEmit` échoue
   dessus (`TS2882`, pas de déclaration de module pour l'import CSS side-effect). Souci de
   config TS pré-existant (même symptôme sur `ResizeArea.stories.css`), pas spécifique à ce
   composant, mais pollue la sortie `tsc` du dossier wysiwyg.

8. **Import inutilisé**
   [Wysiwyg.stories.tsx:8](./Wysiwyg.stories.tsx#L8) — `SerializedEditorState` importé mais
   jamais lu, résidu de la migration `getHtml` → `getValue`.

## Accessibilité (absent, pas forcément un bug mais à noter)

9. Aucun `aria-label` / `aria-labelledby` exposé pour la zone `ContentEditable`, et aucun
   support de `placeholder` (Lexical le permet nativement via `RichTextPlugin`). Si
   l'éditeur est utilisé sans label visuel externe (le composant `Field` en fournit peut-être
   un — à vérifier), ça peut être un trou d'accessibilité.

## Ce qui va bien

La séparation config/plugins/style est propre, les imperative handlers (`getValue` /
`getState` / `setState`) sont cohérents, et `useImperativeHandle` + `EditorRefPlugin` est le
bon pattern pour exposer l'éditeur Lexical.

## Suivi migration Lexical Extension

Le remplacement `HorizontalRuleExtension` → `HorizontalRulePlugin` (déprécié) est un
palliatif : `@lexical/extension` (0.47) est en avance sur `lexical` / `@lexical/react`
(0.46) dans `package.json`. Une vraie migration vers le système d'extensions impliquerait de
réécrire toute la composition de l'éditeur (`LexicalComposer` → `LexicalExtensionComposer`),
hors scope de cet audit.
