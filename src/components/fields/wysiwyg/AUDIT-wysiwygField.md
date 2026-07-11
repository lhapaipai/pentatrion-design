# Audit qualité & performance — WysiwygField

Date : 2026-07-11

Périmètre : [WysiwygField.tsx](./WysiwygField.tsx) et [WysiwygField.stories.tsx](./WysiwygField.stories.tsx),
lus comme s'il s'agissait de l'intégration réelle d'un formulaire en production (Conform +
Zod). Voir aussi [AUDIT-wysiwyg.md](./AUDIT-wysiwyg.md) pour l'audit du composant `Wysiwyg`
sous-jacent.

## 🔴 Le point le plus critique : la logique (dé)sérialisation de `WysiwygValue` est dupliquée 4 fois

La conversion `WysiwygValue` (objet `{ html?, state }`) ↔ `string` (valeur DOM du champ
caché) est réimplémentée indépendamment à quatre endroits, avec des variations subtiles :

1. [WysiwygField.tsx:33-44](./WysiwygField.tsx#L33-L44) — `parse`/`serialize` de `useControl`,
   la version "source de vérité" en théorie.
2. [WysiwygField.stories.tsx:27-44](./WysiwygField.stories.tsx#L27-L44) —
   `configureCoercion().customize()`, qui reparse le payload pour Zod (`JSON.parse`).
3. [WysiwygField.stories.tsx:70-76](./WysiwygField.stories.tsx#L70-L76) — le `serialize` de
   `useForm`, requis pour que `field.defaultValue` (et l'hydratation du champ caché) produise
   une string correcte à partir d'un `defaultValue.description` qui est un objet.
4. [WysiwygField.stories.tsx:84-97](./WysiwygField.stories.tsx#L84-L97) — le `serialize` de
   `isDirty`, qui ne compare que `state` (il jette `html`), une troisième variante encore
   différente des deux précédentes.

Dans une vraie app, **chaque nouveau formulaire qui utilise `WysiwygField` doit réécrire (2)
et (3) à la main** — `WysiwygField` ne les encapsule pas. Un développeur qui oublie le
`serialize` custom de `useForm` (2) verra `field.defaultValue` redevenir `''` pour tout
contenu existant (un objet ne se sérialise pas nativement en string côté conform — cf.
`FieldMetadata.defaultValue` : *"Returns an empty string when ... the field value cannot be
serialized to a string (e.g., objects or arrays)"*), donc **perte silencieuse du contenu par
défaut** à l'édition d'un article existant. C'est le genre de régression qui ne casse rien en
dev/tests mais efface du contenu en prod.

**Recommandation** : extraire un couple `parseWysiwygValue` / `serializeWysiwygValue` unique
dans `types.ts`, réutilisé tel quel dans `WysiwygField.tsx`, dans `configureCoercion`, dans le
`serialize` de `useForm`, et dans tout `isDirty` custom. Documenter (README ou JSDoc) que tout
consommateur de `WysiwygField` dans un formulaire Conform doit brancher ce `serialize` sur
`useForm`, sinon la fonctionnalité casse silencieusement.

## 🔴 `parse()` peut faire planter le rendu sur une valeur corrompue

[WysiwygField.tsx:33-40](./WysiwygField.tsx#L33-L40) : `JSON.parse(payload)` n'est pas protégé
par un `try/catch`. L'API de `useControl` documente explicitement que `parse` peut retourner
`null` pour signaler un payload invalide (`parse: (payload: unknown) => Value | null`), mais
`WysiwygField` n'utilise pas cette échappatoire — toute erreur de parsing (`SyntaxError`)
remonte telle quelle. Or `parse` est invoqué en lecture synchrone du snapshot du champ, donc
potentiellement **pendant le rendu**.

Scénario réaliste en prod : un draft est resté dans le DOM restauré par le bfcache du
navigateur, ou une valeur a été persistée avant une migration de schéma de `WysiwygValue` —
le JSON stocké ne correspond plus au format attendu, `JSON.parse` réussit mais produit une
forme inattendue, ou échoue franchement sur une troncature. Résultat : crash du rendu du champ
(et potentiellement de tout le formulaire s'il n'y a pas d'`ErrorBoundary` au-dessus), au lieu
d'un champ vide dégradé gracieusement. Un `try { ... } catch { return null; }` autour du
`JSON.parse` réglerait ça à coût quasi nul.

## Performance

5. **Coût du `html` recalculé à chaque changement, pas seulement à la soumission.**
   `LazyOnChangePlugin` (via `Wysiwyg`) appelle `$generateHtmlFromNodes` (parcours complet de
   l'arbre) **et** `editor.getEditorState().toJSON()` à chaque tick de debounce, puis
   `WysiwygField`'s `serialize` fait un `JSON.stringify` du tout (y compris le `html`, jamais
   utilisé tant qu'on n'a pas soumis). Pour un document volumineux (article long), c'est trois
   passes O(taille du document) répétées toutes les `debounceChange` ms pendant la frappe,
   pour un `html` qui ne sert qu'à la soumission finale (`Wysiwyg.getValue()` le recalcule de
   toute façon). Piste : ne générer `html` qu'au moment de la soumission (déjà fait par
   `getValue()`), et ne propager que `state` dans les changements intermédiaires si `html`
   n'est pas consommé en direct par le formulaire.

6. **Triple re-sérialisation à chaque tick dans la story.** `isDirty`'s custom `serialize`
   ([WysiwygField.stories.tsx:84-97](./WysiwygField.stories.tsx#L84-L97)) fait
   `JSON.parse(value)` puis `JSON.stringify({ state: ... })` — sur un `FormData` déjà
   recalculé à chaque changement du champ caché. Combiné au point précédent, un document
   volumineux peut donc déclencher, à chaque tick de debounce : 1 génération HTML, 2 sérialisations
   JSON complètes côté `WysiwygField`, puis 1 parse + 1 stringify supplémentaires côté
   `isDirty`. Sur un article de plusieurs milliers de mots, ça peut se traduire par un
   ralentissement perceptible pendant la frappe (jank), en particulier sur mobile bas de
   gamme. À mesurer avant d'optimiser, mais le pattern est structurellement coûteux.

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

11. [WysiwygField.stories.tsx:62](./WysiwygField.stories.tsx#L62) et
    [WysiwygField.stories.tsx:67](./WysiwygField.stories.tsx#L67) — `console.log("onValidate", ...)`
    et `console.log(ctx)`. Acceptable dans une story (outil de dev), mais à distinguer
    explicitement du code de `WysiwygField.tsx` lui-même (point 10), qui lui est du vrai code
    de production.

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
