# Audit qualité — composant Wysiwyg

Date : 2026-07-11

Périmètre : [Wysiwyg.tsx](./Wysiwyg.tsx) et les fichiers connexes touchés par la migration
`HorizontalRulePlugin` / typage `WysiwygValue`.

## Bugs / risques réels

## API smell


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
