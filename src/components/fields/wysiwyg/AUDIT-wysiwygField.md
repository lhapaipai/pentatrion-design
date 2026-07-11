# Audit qualité & performance — WysiwygField

Date : 2026-07-11

Périmètre : [WysiwygField.tsx](./WysiwygField.tsx) et [WysiwygField.stories.tsx](./WysiwygField.stories.tsx),
lus comme s'il s'agissait de l'intégration réelle d'un formulaire en production (Conform +
Zod). Voir aussi [AUDIT-wysiwyg.md](./AUDIT-wysiwyg.md) pour l'audit du composant `Wysiwyg`
sous-jacent.


## Performance


7. **`key={field.key}` force un remount complet de l'éditeur Lexical** (déjà noté dans
   `AUDIT-wysiwyg.md` côté `Wysiwyg`, mais l'origine est ici,
   [WysiwygField.tsx:65](./WysiwygField.tsx#L65)). C'est nécessaire pour que
   `Wysiwyg`/`defaultValue` (lu une seule fois) se resynchronise après un `form.reset()` ou une
   mise à jour programmatique du champ — comportement voulu — mais dans une vraie app avec
   plusieurs `WysiwygField` sur une même page, chaque reset recrée entièrement
   `LexicalComposer` + tous les plugins (`FloatingLinkEditorPlugin`, `ToolbarPlugin`, etc.), pas
   seulement le contenu. Le coût est proportionnel au nombre d'éditeurs affichés
   simultanément, à garder à l'esprit si `WysiwygField` est utilisé dans un formulaire avec
   plusieurs champs riches (ex. titre + description + notes).

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
