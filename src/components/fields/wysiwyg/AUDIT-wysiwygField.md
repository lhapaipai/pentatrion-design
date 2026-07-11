# Audit qualité & performance — WysiwygField

Date : 2026-07-11 (réaudité)

Périmètre : [WysiwygField.tsx](./WysiwygField.tsx) et [WysiwygField.stories.tsx](./WysiwygField.stories.tsx),
lus comme s'il s'agissait de l'intégration réelle d'un formulaire en production (Conform +
Zod). Voir aussi [AUDIT-wysiwyg.md](./AUDIT-wysiwyg.md) pour l'audit du composant `Wysiwyg`
sous-jacent.

## 🔴 Nouveau : la toolbar reste active quand `disabled`/`readOnly` est passé

`disabled`/`readOnly` ([WysiwygField.tsx:16-17](./WysiwygField.tsx#L16-L17)) coupent bien
l'édition du contenu (`editable: false` côté Lexical, voir `Wysiwyg.tsx`), mais
[plugins/ToolbarPlugin.tsx](./plugins/ToolbarPlugin.tsx) n'a aucune connaissance de cet état —
ni dans ses `Props` (`className`, `setIsLinkEditMode`, `extendedToolbar`,
`ToolbarVariantProps`), ni sur ses boutons. Seuls `canUndo`/`canRedo` désactivent
individuellement undo/redo ([ToolbarPlugin.tsx:198,205](./plugins/ToolbarPlugin.tsx#L198)) ;
tous les autres boutons (gras, italique, liens, listes, titres...) restent visuellement actifs
et cliquables sur un champ `disabled`/`readOnly`.

Dans une vraie app (ex. un champ verrouillé pendant une soumission, ou un contenu en lecture
seule selon des permissions), l'utilisateur voit une toolbar pleinement interactive alors que
le contenu ne répond à rien — affordance trompeuse. Ça ne crash a priori pas (Lexical
court-circuite en interne la plupart des commandes de mutation quand `editable: false`), mais
le résultat visuel est incohérent. `FloatingLinkEditorPlugin` a potentiellement le même souci
si la sélection de texte reste possible sur un contenu non éditable.

**Piste** : faire remonter `disabled`/`readOnly` (ou un simple booléen `editable`) dans les
`Props` de `ToolbarPlugin`, et l'utiliser pour désactiver chaque bouton (même mécanisme que
`canUndo`/`canRedo`) plutôt que de le déduire indirectement de l'état interne de l'éditeur.

## Performance


7. **`key={field.key}` force un remount complet de l'éditeur Lexical — évalué, gardé tel quel.**
   [WysiwygField.tsx:65](./WysiwygField.tsx#L65) — nécessaire pour que `Wysiwyg`/`defaultValue`
   (lu une seule fois) se resynchronise après un `form.reset()` ou une mise à jour
   programmatique du champ. Une alternative sans remount a été envisagée (pousser le nouveau
   contenu via `ref.setState()`/`clear()` plutôt que remonter tout `LexicalComposer` +
   plugins), mais écartée : elle ne vide pas automatiquement l'historique undo/redo de
   `HistoryPlugin` (pas de `CLEAR_HISTORY_COMMAND` dans ce package), donc un `Ctrl+Z` juste
   après un reset pourrait faire réapparaître l'ancien contenu — comportement surprenant à
   gérer soi-même via un `externalHistoryState`. Le coût du remount reste proportionnel au
   nombre d'éditeurs affichés simultanément (à garder à l'esprit pour un formulaire avec
   plusieurs champs riches), mais le compromis "table rase garantie, plus simple" l'emporte
   tant que ce coût n'est pas mesuré comme un vrai problème en prod.

## API / DX

8. **`WysiwygField` ne relaie pas toute la surface de `Wysiwyg` — confirmé intentionnel, pas
   un défaut.** `WysiwygField`'s `Props` ([WysiwygField.tsx:9-18](./WysiwygField.tsx#L9-L18))
   ne relaie que `debounceChange`, `toolbarSticky`, `contentEditableClassName`,
   `containerClassName`, `disabled`, `readOnly`. Les props `extendedToolbar`,
   `floatingPosition`, `proseCompact`, `contentEditableBaseStyle`, `toolbarVisible` de
   `Wysiwyg` ne sont pas exposées — c'est voulu : un consommateur qui a besoin de ces réglages
   plus fins recompose directement `Wysiwyg` + `useControl` plutôt que de passer par
   `WysiwygField`, qui reste volontairement une intégration Conform "par défaut" plutôt qu'un
   proxy exhaustif de toutes les options de `Wysiwyg`.

## Qualité — résidu mineur

9. Les `console.log("onValidate", ...)` et `console.log(ctx)` de
   [WysiwygField.stories.tsx:53](./WysiwygField.stories.tsx#L53) et
   [WysiwygField.stories.tsx:58](./WysiwygField.stories.tsx#L58) sont maintenant commentés
   plutôt que supprimés. Fonctionnellement réglé (plus de bruit console), mais du code mort
   commenté traîne dans une story censée servir de référence d'usage — à supprimer plutôt que
   commenter la prochaine fois que ce fichier est touché.



## Ce qui va bien

- Le pattern champ caché + `useControl` + `key={field.key}` suit correctement l'API "future"
  de Conform (cohérent avec le reste des `*Field` du design system).
- `defaultValue` de la story est défini au *module scope* (pas recréé à chaque rendu), ce qui
  évite un piège classique avec `useForm({ defaultValue })` (référence instable → resets
  intempestifs).
- Le hook `useFormData` est utilisé avec un sélecteur qui ne redéclenche un rerender que sur
  changement effectif (deep-compare interne à Conform), donc le double affichage `dirty`/`value`
  dans la story ne sur-render pas à chaque frappe au-delà du nécessaire.
- `{...rest}` sur `<Field>` respecte le même contrat que les autres composants `*Field`
  (`TextField`, etc.), donc `label`/`hint`/`errors`/`id` etc. se comportent de façon prévisible
  pour un consommateur déjà familier du design system.
