# Audit qualité — composant Wysiwyg

Date : 2026-07-11

Périmètre : [Wysiwyg.tsx](./Wysiwyg.tsx) et les fichiers connexes touchés par la migration
`HorizontalRulePlugin` / typage `WysiwygValue`.

## Bugs / risques réels

10. **Import mort `$generateHtmlFromNodes` — erreur `tsc` actuelle, dans 2 fichiers.**
    Depuis que la génération de `html` a été retirée de `LazyOnChangePlugin` et de
    `getValue()`, l'import `$generateHtmlFromNodes` n'est plus utilisé ni dans
    [Wysiwyg.tsx:15](./Wysiwyg.tsx#L15) ni dans
    [plugins/LazyOnChangePlugin.tsx:4](./plugins/LazyOnChangePlugin.tsx#L4).
    `npx tsc --noEmit` échoue actuellement sur ces deux lignes (`TS6133`). À retirer.

11. **`LazyOnChangePlugin`'s `onChange` type déstructure encore `{ html }`, qui n'existe
    plus.** [plugins/LazyOnChangePlugin.tsx:9](./plugins/LazyOnChangePlugin.tsx#L9) :
    `onChange?: ({ html }: WysiwygValue) => void;` — `html` n'est plus jamais produit par ce
    plugin (`triggerHtmlRender` ne construit plus que `{ state }`), donc cette déstructuration
    dans la signature de type est un résidu trompeur de l'ancienne forme. À aligner sur le
    type `onChange` de `Wysiwyg` lui-même : `onChange?: (value: WysiwygValue) => void;`.

12. **Nom de fonction obsolète : `triggerHtmlRender`.**
    [plugins/LazyOnChangePlugin.tsx:19](./plugins/LazyOnChangePlugin.tsx#L19) — la fonction ne
    génère plus de HTML, elle sérialise uniquement l'état Lexical (`editor.getEditorState().toJSON()`).
    Le nom induit en erreur sur ce que fait réellement le plugin désormais ; un nom du style
    `notifyChange`/`triggerChange` refléterait mieux le comportement actuel.

13. **`WysiwygValue.html` est un champ mort dans tout le module.**
    [types.ts:5](./types.ts#L5) et [types.ts:10](./types.ts#L10) déclarent toujours
    `html?: string` sur `WysiwygValue` et sur `wysiwygSchema`, mais plus aucun code ne le
    produit (`grep` confirme : seul `setHtml` existe, qui sert à *importer* du HTML dans
    l'éditeur, pas à en exporter). Tout consommateur qui lirait `value.html` après un
    `onChange`/`getValue()` recevra systématiquement `undefined`. Soit retirer le champ de
    `WysiwygValue`/`wysiwygSchema` pour éviter la confusion, soit documenter que la génération
    HTML a été volontairement déplacée ailleurs (ex. rendu côté serveur à partir de `state`).

14. **`Wysiwyg.stories.tsx` garde un `async`/`await` désormais inutile.**
    [Wysiwyg.stories.tsx:37-40](./Wysiwyg.stories.tsx#L37-L40) : `getValue()` est maintenant
    synchrone (`() => WysiwygValue`, plus de `Promise`), donc `async function handleGetValue()`
    + `await wysiwygRef.current.getValue()` est un résidu de l'ancienne API. Fonctionne
    toujours (`await` sur une valeur non-Promise est valide en JS) mais complexifie
    inutilement la story ; à simplifier en fonction synchrone.

## API smell


## Ailleurs dans l'arbre du composant (impacté par la même feature)

6. **`toolbarVariants.sticky` a deux variantes identiques**
   [style.ts:6-8](./style.ts#L6-L8) : `mobileOnly` et `allDevice` ont exactement la même
   valeur de classes (`"max-lg:sticky max-lg:top-0 max-lg:backdrop-blur-xs lg:rounded-t-2xl"`).
   Soit un bug (elles devraient différer, `allDevice` étant censé être sticky aussi en
   desktop), soit une variante dupliquée à fusionner.


## Accessibilité (absent, pas forcément un bug mais à noter)

9. Aucun support de `placeholder` (Lexical le permet nativement via `RichTextPlugin`).

## Ce qui va bien

La séparation config/plugins/style est propre, les imperative handlers (`getValue` /
`getState` / `setState`) sont cohérents, et `useImperativeHandle` + `EditorRefPlugin` est le
bon pattern pour exposer l'éditeur Lexical. Le passage de `getValue()` à une signature
synchrone est une amélioration : l'ancienne version enveloppait une lecture déjà synchrone
(`editor.read(...)`) dans un `new Promise(...)`, ajoutant un aller-retour microtask inutile —
supprimer `html` de la sortie a aussi éliminé, au passage, le coût du parcours complet de
l'arbre à chaque changement (`$generateHtmlFromNodes`), ce qui répond directement au point de
performance n°5 relevé dans [AUDIT-wysiwygField.md](./AUDIT-wysiwygField.md).

## Suivi migration Lexical Extension

Le remplacement `HorizontalRuleExtension` → `HorizontalRulePlugin` (déprécié) est un
palliatif : `@lexical/extension` (0.47) est en avance sur `lexical` / `@lexical/react`
(0.46) dans `package.json`. Une vraie migration vers le système d'extensions impliquerait de
réécrire toute la composition de l'éditeur (`LexicalComposer` → `LexicalExtensionComposer`),
hors scope de cet audit.
