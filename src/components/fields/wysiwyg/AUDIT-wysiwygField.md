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

## API / DX — `WysiwygField` n'expose pas toute la surface de `Wysiwyg`

8. `WysiwygField`'s `Props` ([WysiwygField.tsx:9-16](./WysiwygField.tsx#L9-L16)) ne relaie que
   `debounceChange`, `toolbarSticky`, `contentEditableClassName`, `containerClassName`. Les
   props `extendedToolbar`, `floatingPosition`, `proseCompact`, `contentEditableBaseStyle`,
   `toolbarVisible` de `Wysiwyg` ne sont pas exposées : un consommateur qui a besoin de
   `proseCompact` ou d'une toolbar `desktopOnly` dans un vrai formulaire doit soit modifier
   `WysiwygField`, soit abandonner l'intégration Conform et recomposer `Wysiwyg` +
   `useControl` lui-même. Pour un composant de design system destiné à être réutilisé, c'est
   une surface d'API incomplète par rapport à son composant de base.

9. **Pas de `disabled`/`readOnly`.** Contrairement à `TextField` (qui expose `disabled` et
   `readOnly` via `InputProps`), `WysiwygField` n'a aucun moyen d'empêcher l'édition — ni
   pendant une soumission en cours, ni pour un champ en lecture seule. Lexical supporte
   nativement `editor.setEditable(false)` / `editable` dans la config ; ce n'est câblé nulle
   part ici. Pour un vrai formulaire (état "en cours de soumission", champ verrouillé selon des
   permissions), c'est un gap fonctionnel probable.

## Qualité — résidus de debug

10. [WysiwygField.tsx:51](./WysiwygField.tsx#L51) — `console.log(control.payload)` sans garde,
    exécuté à chaque rendu du champ. Le repo n'a pas de règle `no-console` dans sa config
    `oxlint` actuelle (`npx oxlint` ne le relève pas), donc rien n'empêche ce genre de résidu
    de partir en prod. À retirer, et une règle de lint `no-console` (avec exception pour
    `console.error`/`warn` si besoin) éviterait la récidive.

11. [WysiwygField.stories.tsx:53](./WysiwygField.stories.tsx#L53) et
    [WysiwygField.stories.tsx:58](./WysiwygField.stories.tsx#L58) — `console.log("onValidate", ...)`
    et `console.log(ctx)`. Acceptable dans une story (outil de dev), mais à distinguer
    explicitement du code de `WysiwygField.tsx` lui-même (point 10), qui lui est du vrai code
    de production. (Le `console.log(value)` qui traînait dans le `serialize` de `useForm` a été
    retiré au passage lors de la refacto de la (dé)sérialisation.)

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
