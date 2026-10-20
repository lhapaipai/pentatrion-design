# Audit d'accessibilité — pentatrion-design

- **Version auditée** : 1.3.11 (commit `3ba1d14`)
- **Date** : 2026-10-20
- **Référentiels** : WCAG 2.2 niveau AA, WAI-ARIA Authoring Practices (APG)
- **Objectif** : améliorer l'accessibilité **sans changer l'aspect visuel**. Les problèmes qui ne peuvent se corriger qu'en modifiant le rendu sont regroupés à part (§ 11).

## Méthode

Audit statique, en lecture seule, de tous les fichiers de `src/components`, `src/tailwind`, `src/hooks` et `src/lib`. Aucun navigateur ni lecteur d'écran n'a été lancé.

- Les comportements de `@floating-ui/react` 0.27.20 (`useRole`, `useListNavigation`, `useHover`, `FloatingFocusManager`, `mergeProps`), de Lexical (`ContentEditable`) et de `@conform-to` ont été vérifiés dans `node_modules`.
- Les ratios de contraste ont été calculés avec la formule de luminance relative WCAG, à partir des tokens de `src/tailwind/theme.css`.
- Les points marqués **« à valider en rendu »** n'ont pas pu être confirmés sans navigateur.

## Conventions

- **Sévérité** :
  - **critique** : bloquant, l'utilisateur ne peut pas accomplir la tâche ;
  - **majeur** : information ou fonction perdue, ou contournement pénible ;
  - **mineur** : gêne, non-conformité légère, ou bonne pratique.
- **Options** : quand deux approches existent, elles sont données toutes les deux.
  - **Pragmatique** : couvre la majorité des cas réels à faible coût.
  - **Complète** : plus robuste, mais plus coûteuse à écrire et à maintenir.
- Chaque constat porte un identifiant (`P2`, `SEL-1`…) pour en suivre le traitement.

---

## Sommaire

1. [Synthèse](#1-synthèse)
2. [Primitives transversales](#2-primitives-transversales)
3. [Overlays](#3-overlays)
4. [Champs de formulaire simples](#4-champs-de-formulaire-simples)
5. [Champs de formulaire complexes](#5-champs-de-formulaire-complexes)
6. [Autres composants](#6-autres-composants)
7. [CSS transversale](#7-css-transversale)
8. [Hooks](#8-hooks)
9. [Langue et direction](#9-langue-et-direction)
10. [Bugs hors accessibilité relevés au passage](#10-bugs-hors-accessibilité-relevés-au-passage)
11. [Hors contrainte : corrections qui changent le visuel](#11-hors-contrainte--corrections-qui-changent-le-visuel)
12. [Points à valider en rendu](#12-points-à-valider-en-rendu)
13. [Ordre de traitement suggéré](#13-ordre-de-traitement-suggéré)

---

## 1. Synthèse

### Ce qui est déjà bien fait

- **Contrôles natifs partout**, quand c'est possible :
  - `input`, `textarea`, `date`, `range` ;
  - cases et radios en `appearance-none` (pas `display: none`), donc focusables et annoncées.
- **Focus visible global** : `:focus-visible` en `outline` (`src/tailwind/base.css:13`). Ce n'est pas un `box-shadow`, donc il reste visible en mode contraste élevé.
- **Animations** : `motion-safe:` est appliqué systématiquement aux animations d'entrée et au ripple.
- **Patterns floating-ui** largement en place :
  - focus trap des modales ;
  - Échap ;
  - `aria-expanded`, `aria-controls` et `aria-haspopup` sur les déclencheurs ;
  - `useListNavigation` et `useTypeahead`.
- **`DropdownMenuNested`** est le composant le plus conforme : sous-menus au clavier, `safePolygon`, chevron en `aria-hidden`.
- **`Range`** :
  - input natif ;
  - `aria-valuetext` ;
  - valeurs affichées en `aria-hidden` ;
  - cible de 32 px.
- **`Field`** : association `label`/`htmlFor` via `useId` et `Slot`, mode groupe nommé par `aria-labelledby`.
- **`Flash`** : `role="status"` ou `role="alert"` selon la couleur.
- **TOTP** : collage multi-caractères, flèches, `inputMode="numeric"`.
- **Contrastes du texte** :
  - texte principal : 12,8:1 en clair, 12,5:1 en sombre ;
  - texte secondaire `text-gray-6` : 6,9:1 en clair, 8,3:1 en sombre.
- **Divers** :
  - SVG de `getIconByMime` correctement masqués ;
  - tailles en `rem` ;
  - propriétés logiques dans `prose.css`.

### Les problèmes de fond

La majorité des constats découle de **quelques primitives partagées**. Les corriger règle beaucoup de constats d'un coup :

1. `Dialog` impose `role="dialog"`, y compris à l'intérieur des listes et des menus (P1).
2. `Button` met `aria-checked` sur tous les boutons et un `role="button"` qui se propage via `asChild` (P2).
3. `Field` ne relie ni l'erreur, ni le hint, ni la description au contrôle, et n'expose pas `aria-invalid` (P3).
4. Les icônes en police ne sont pas masquées, et une vingtaine de boutons à icône seule n'ont pas de nom (P4).
5. Aucune clé de traduction n'existe pour les libellés d'accessibilité (P5).

### Bloquants clavier (critiques)

| ID | Composant | Problème |
|---|---|---|
| TAB-1 | Tabs | Aucune gestion des flèches : les onglets non sélectionnés sont inatteignables. |
| CTX-1 | ContextMenu | Les items ne s'activent qu'à la souris (`onMouseUp`). |
| STAR-1 | Stars, MappedStars | Le range est `disabled` quand la valeur vaut `null` : impossible de noter. |
| SEL-1, SLG-1, WYS-1, IB-1 | Select, SelectLegacy, Wysiwyg, InputButton | L'élément focusable n'a pas de nom (le label pointe ailleurs). |
| SEL-2 | Select | `aria-selected` est écrasé : aucune option n'est annoncée « sélectionnée ». |
| P4 | ~20 boutons à icône seule | Aucun nom accessible (fermer, effacer, supprimer…). |

---

## 2. Primitives transversales

### P1 — `Dialog` impose `role="dialog"` · majeur à critique · 1.3.1, 4.1.2

**Où** : `src/components/dialog/Dialog.tsx:49` (`role = "dialog"` par défaut).

**Problème** : `Dialog` est d'abord une boîte visuelle, et il est réutilisé comme enveloppe dans de nombreux composants.

| Composant | Structure obtenue | Emplacement |
|---|---|---|
| Select | `listbox` > `dialog` sans nom > `option` | `src/components/fields/select/Select.tsx:203` |
| SelectLegacy | idem | `src/components/select-legacy/Select.tsx:338` |
| Autocomplete | idem | `src/components/autocomplete/Autocomplete.tsx:301` |
| ContextMenu | `menu` > `dialog` > `menuitem` | `src/components/context-menu/ContextMenu.tsx:161` |
| DropdownMenu | idem | `src/components/dropdown-menu/DropdownMenu.tsx:66` |
| Popover | `dialog` imbriqué dans un `dialog` | `src/components/popover/PopoverContent.tsx:31` |
| Tooltip | `role="tooltip"` posé deux fois | `src/components/tooltip/TooltipContent.tsx:42` |

Une `option` doit être enfant direct d'un `listbox`, et un `menuitem` d'un `menu`. Le `dialog` intermédiaire casse ce lien :
- la liste est annoncée vide, ou un « dialogue » sans nom est annoncé ;
- la position « 3 sur 12 » est perdue.

**Correctif**

- **Pragmatique** : `<Dialog role="none" …>` aux endroits ci-dessus, en remplaçant `role="tooltip"` dans `TooltipContent`.
  - Ne pas le faire dans `MenuItemWithChildren.tsx:197` ni dans `ModalContent`, où `getFloatingProps` est posé directement sur `Dialog` : ce dernier porte alors le bon rôle.
  - Snack et `FloatingLinkEditorPlugin` sont traités dans leurs sections (SNK-2, WYS-16).
- **Complète** : supprimer la valeur par défaut (`role` reste `undefined`), et laisser chaque appelant poser le rôle explicitement. C'est un changement cassant pour un composant public exporté : tous les `<Dialog>` des consommateurs sont à revoir.

### P2 — `Button` : rôle, `aria-checked`, chargement · majeur · 4.1.2, 2.4.3

**Où** : `src/components/button/Button.tsx:137-174`, `src/tailwind/variants.css:12-18`.

#### P2.a — `aria-checked` sur tous les boutons

- `aria-checked={selected}` est rendu sur **tous** les boutons (`Button.tsx:153`), donc `aria-checked="false"` partout, y compris sur chaque `ModalTrigger` et `PopoverTrigger`.
- Cet attribut n'est pas pris en charge sur le rôle `button` (règle axe `aria-allowed-attr`).
- L'état « sélectionné » n'est donc jamais restitué : ButtonGroup, gras/italique du wysiwyg (WYS-7), état `current`.

**Pragmatique**
- `selected?: boolean` **sans valeur par défaut**.
- Émettre `aria-pressed={selected}`, omis si `undefined`. Sinon chaque bouton deviendrait un « bouton bascule ».
- Ajouter `&[aria-pressed="true"]` au `@custom-variant current` (`variants.css:12`), à côté de `[aria-checked="true"]`. Aucun impact visuel.

**Complète**, pour ButtonGroup en choix exclusif (cas de la story) :
- `ButtonGroup` en `role="radiogroup"` avec `aria-label` ;
- boutons en `role="radio"`, où `aria-checked` devient valide ;
- tabindex itinérant et flèches.

#### P2.b — `role="button"` explicite et propagation via `asChild`

- `Button.tsx:140` : `role="button"` est redondant sur `<button>`.
- Avec `asChild`, `Slot` le propage à l'enfant. Story `Button.stories.tsx:113-127` : `<Button asChild><a href>` devient un « bouton » pour le lecteur d'écran.
- `tabIndex=0`, `aria-checked` et `disabled` sont propagés de la même façon.

**Correctif**
- Supprimer `role="button"`.
- N'émettre `tabIndex` que si `!focusable` : `tabIndex={focusable ? undefined : -1}`.

#### P2.c — État `loading`

- En chargement, le bouton reçoit `disabled` (`Button.tsx:155-156`). S'il avait le focus (cas typique : on vient de cliquer), **le focus repart sur `<body>`**.
- `aria-busy` sur un bouton n'est annoncé par aucun lecteur d'écran courant, et le loader n'a pas de texte.

**Pragmatique**
- En `loading`, utiliser `aria-disabled="true"` au lieu de `disabled`.
- Neutraliser le clic : `onClick={loading ? undefined : props.onClick}`, plus `preventDefault` pour un `type="submit"`.
- Ajouter `<span className="sr-only">{t?.("button.loading") ?? "Chargement…"}</span>` dans le bouton.
- Résultat : le focus est conservé et le nom devient « Enregistrer Chargement… ».
- `others.css` stylise déjà `[aria-disabled="true"]` comme `[disabled]`, donc aucun changement visuel.
- Passer `aria-hidden` au `Loader` et au `RoundedRectLoader` internes.

**Complète** : une live region `role="status"` persistante qui annonce le début et la fin du chargement.

#### P2.d — Autres points mineurs

- **Pas de `type` par défaut** (`Button.tsx:138`). Dans un `<form>`, tout `Button` soumet le formulaire. Proposition : `type={asChild ? undefined : "button"}` avant `{...props}`.
- **`focusable={false}`** sort un bouton visible de l'ordre de tabulation. C'est acceptable seulement dans un widget composite qui gère son propre focus : à documenter.

#### P2.e — Boutons à icône seule

Rien n'impose un nom, et les stories en contiennent beaucoup sans nom : `Button.stories.tsx:131-215`, `Tabs.stories.tsx:66`, QuickSettings.

- **Pragmatique** : documenter `aria-label`, et ajouter un `console.warn` en développement si `icon && !props["aria-label"] && !props["aria-labelledby"]`. Risque de faux positif avec icône + texte.
- **Complète** : un type TypeScript discriminé qui exige `aria-label` quand `icon` vaut `true`.

### P3 — `Field` ne relie pas erreurs et descriptions au contrôle · majeur · 1.3.1, 3.3.1, 4.1.2, 4.1.3

**Où** : `src/components/fields/field/Field.tsx:43-110`.

C'est le point central de tous les formulaires.

#### P3.a — Ni `aria-describedby` ni `aria-invalid`

**Problème**
- Le `Slot` (`Field.tsx:100-102`) ne transmet que `id` et `color`.
- Arrivé sur un champ en erreur, le lecteur d'écran annonce « Email, zone d'édition » : il ne dit pas « invalide » et ne lit pas le message.
- `description` (en haut) et `footerDescription` ne sont jamais lus non plus.

**Ce qu'on a déjà** : conform calcule `field.errorId = ${id}-error` et `field.descriptionId = ${id}-description` (`@conform-to/react` `state.mjs:547-548`). Il suffit de reprendre la même convention.

**Pragmatique**, via `Slot`, qui fusionne les props dans l'enfant :

```tsx
const labelId = `${id}-label`;
const hintId = `${id}-hint`;
const descriptionId = `${id}-description`;
const errorId = `${id}-error`;
const footerDescriptionId = `${id}-footer-description`;

const describedBy =
  [
    hint && hintId,
    description && descriptionId,
    (errorsElement || warningElement) && errorId,
    footerDescription && footerDescriptionId,
  ]
    .filter(Boolean)
    .join(" ") || undefined;
const invalid = errors ? true : undefined;
```

- **Mode simple** : `<Slot id={id} color={color} aria-describedby={describedBy} aria-invalid={invalid}>`.
  - `Input`, `Textarea` et `Checkbox` répercutent `...rest` sur l'`<input>`. Ça marche aussi pour `Range`, `Stars`, `ColorPreview` et `Autocomplete`.
  - `Select`, `SelectLegacy` et `Wysiwyg` doivent accepter ces props et les poser au bon endroit. Pour Lexical, ce sont des props **camelCase** : `ariaInvalid`, `ariaDescribedBy`.
- **Mode groupe** : poser `aria-describedby={describedBy}` sur le `div role="group"`. `aria-invalid` n'est pas pris en charge sur `group`, mais il l'est sur `radiogroup` (RAD-2).
- Mettre `id={errorId}` sur le `<span>` d'erreur **et** sur celui d'avertissement : un seul des deux est affiché à la fois.
- Mettre `id={descriptionId}` et `id={footerDescriptionId}` sur les `div` correspondants.
- Préférer `aria-describedby` à `aria-errormessage`, encore mal pris en charge.

**Complète** : un `FieldContext` `{ id, labelId, describedBy, invalid, required }`, lu par `Input`, `Textarea`, `Checkbox`, `Radio`, `TotpInput`, `InputButton`, `Select` et `Wysiwyg`.
- Avantages :
  - `aria-invalid` arrive sur chaque input, même en mode groupe ;
  - plus de convention d'id implicite (IB-1, SEL-1, WYS-1).
- Inconvénient : couplage entre `Field` et toutes les primitives.

#### P3.b — Le hint fait partie du nom accessible · mineur · 1.3.1, 2.5.3

**Problème**
- Le `<span>` du hint est à l'intérieur du `<label>` (`Field.tsx:84-91`).
- Le nom devient « What is your name Any hint related to input field ».

**Correctif, sans changement visuel**
- Remplacer le `<label className="mb-1 flex …">` externe par un `<div>` avec les mêmes classes.
- Remplacer le `<span>{label}</span>` interne par `<label id={labelId} htmlFor={group ? undefined : id}>{label}</label>`.
- Laisser le hint dans un `<span id={hintId}>`, référencé par `aria-describedby`.
- Aucune règle CSS ne cible `label` (vérifié dans `src/tailwind`).
- Seule différence : un clic sur le hint ne donne plus le focus à l'input.

Ce `labelId` stable (`${id}-label`) sert aussi à SEL-1, SLG-1, WYS-1 et IB-1.

#### P3.c — La live region est créée en même temps que son contenu · mineur · 4.1.3

**Problème**
- Le `<span role="status" aria-live="polite">` (`Field.tsx:52-58` et `63-64`) n'est monté que lorsqu'une erreur existe.
- Une région insérée déjà remplie n'est souvent pas annoncée (NVDA, JAWS, VoiceOver).
- `role="status"` implique déjà `aria-live="polite"` : l'attribut est redondant.

**Pragmatique**
- Porter `aria-live="polite"` sur le conteneur du pied, toujours rendu : `<div aria-live="polite" className={showFooter ? "text-body-sm text-gray-6 mt-1 min-h-5" : undefined}>`. Un div vide et sans classe a une hauteur nulle, donc le rendu ne change pas.
- Retirer `role` et `aria-live` des `<span>`.
- Limite : à la soumission, toutes les régions des champs en erreur s'annoncent à la suite.

**Variante « à la GOV.UK »** : supprimer les live regions.
- On s'appuie sur `aria-describedby` (P3.a) et sur `focusFirstInvalidField` de conform, qui donne le focus au premier champ invalide (voir CHP-1 pour les champs à input caché).
- C'est moins bavard, mais une erreur qui apparaît au blur n'est plus annoncée.

#### P3.d — `role="group"` systématique · mineur

**Problème**
- `Field.tsx:81` pose `role="group"` sur tous les champs. Un groupe sans nom entoure donc chaque champ simple.
- En mode groupe sans label, si `preventLayerShift` vaut `true`, `aria-labelledby` (`Field.tsx:78`, `93-97`) pointe vers un `<label className="invisible">` vide.

**Correctif**
- `role={group ? "group" : undefined}` ;
- poser `aria-labelledby` seulement si `label || hint` existe.

#### P3.e — `required` jamais exposé · majeur · 3.3.2, 1.3.1

**Problème** : `field.required` existe dans conform, mais aucun composant `*Field` ne le transmet. Rien n'est annoncé.

**Correctif**
- Passer `required={field.required}` sur l'input.
- Conform pose `noValidate` sur le formulaire, donc aucune bulle native n'apparaîtra.
- `field.required` n'est rempli que si l'option `constraint` est fournie à `useForm`.
- **Radios** : `aria-required` sur un `role="radiogroup"` (RAD-2).
- **Groupe de cases à cocher** : `aria-required` n'est pas pris en charge sur `group`. Le mentionner dans le label ou le hint.

L'indicateur visuel (astérisque) relève du § 11.

#### P3.f — Icône d'erreur non masquée · mineur · 1.1.1

`Field.tsx:59` et `65` : ajouter `aria-hidden="true"` sur `<i className="fe-circle-exclamation">`.

### P4 — Icônes fontello non masquées, boutons à icône seule sans nom · critique · 1.1.1, 4.1.2

**Constat**
- 50 balises `<i className="fe-…">` dans `src/components` (hors stories). **Une seule** porte `aria-hidden` : `MenuItemWithChildren.tsx:159`.
- La police injecte un caractère de la zone à usage privé via `::before { content: '\e8xx' }` (`.storybook/fontello/index.css`).
- Ce contenu généré entre dans le calcul du nom accessible. Selon le lecteur d'écran, il est ignoré ou lu « caractère non prononçable ».

**Boutons à icône seule sans nom** (liste vérifiée) :

| Emplacement (bouton / icône) | Action |
|---|---|
| `src/components/modal/Components.tsx:22/23` | fermer la modale |
| `src/components/popover/Components.tsx:20/21` | fermer le popover |
| `src/components/snack/Snack.tsx:41-45` | fermer le snack |
| `src/components/color/ColorPicker.tsx:150/151` | fermer le sélecteur de couleur |
| `src/components/badge/Badge.tsx:46-51` | retirer le badge |
| `src/components/fields/file/FileField.tsx:68-78` | supprimer le média |
| `src/components/fields/text/PasswordField.tsx:30-40` | afficher le mot de passe |
| `src/components/fields/stars/Stars.tsx:114/115`, `MappedStars.tsx:137/138` | réinitialiser la note |
| `src/components/autocomplete/Autocomplete.tsx:265/279` | effacer la recherche |
| `src/components/select-legacy/Select.tsx:292-307` | effacer la sélection |
| `src/components/fields/wysiwyg/plugins/FloatingLinkEditorPlugin.tsx:270/279, 281/290, 304/316, 318/329` | valider, annuler, modifier, supprimer le lien |
| `src/components/fields/wysiwyg/components/BlockFormatDropdown.tsx:37-39` | type de bloc |
| `src/components/fields/wysiwyg/components/ElementFormatDropdown.tsx:33-35` | alignement |
| `src/components/fields/wysiwyg/plugins/ToolbarPlugin.tsx` | 7 boutons sans nom si aucune traduction n'est fournie (voir P5) |

**Correctif type** (ajout pur, sans risque) :

```tsx
<Button icon … aria-label={t?.("button.close") ?? "Fermer"}>
  <i className="fe-cancel" aria-hidden="true" />
</Button>
```

**Icônes décoratives à masquer** :
- `Field.tsx:59, 65` ;
- `AccordionTrigger.tsx:19` ;
- `Autocomplete.tsx:216` ;
- `ColorPicker.tsx:164` ;
- `RadiosButtonIconField.tsx:39` ;
- les étoiles de `Stars.tsx:96` et `MappedStars.tsx:119` ;
- l'icône de `ContextMenuItem.tsx:35`, via `isValidElement(icon) ? cloneElement(icon, { "aria-hidden": true }) : icon`.

**Boutons chevron `focusable={false}`**
- Où : `fields/select/Select.tsx:180-191`, `InputButton.tsx:95-106`, `select-legacy/Select.tsx:310-321`.
- Ce sont des `<button>` sans nom présents dans l'arbre d'accessibilité.
- Mettre `aria-hidden="true"` sur ces `Button` : ils sont déjà hors tabulation et restent cliquables à la souris. Voir aussi SEL-1 et IB-2.

**Correctif global complémentaire**
- Faire générer par la CLI fontello, via le gabarit `.storybook/fontello/index.css.template`, un texte alternatif vide pour le contenu généré :

  ```css
  .fe-x:before {
    content: "\e800"; /* repli pour les navigateurs anciens */
    content: "\e800" / "";
  }
  ```

- Pris en charge par Chrome, Safari et Firefox ≥ 128.
- Toutes les icônes deviennent muettes d'un coup. Cela ne dispense pas de nommer les boutons à icône seule.

### P5 — i18n : aucun libellé d'accessibilité traduisible · majeur · 4.1.2, 3.1.2

**Où** : `src/components/i18n/TranslationContext.ts:3-11`.

**État actuel**
- `useTranslate()` renvoie `undefined` sans provider. La convention en place est `t?.("clé") ?? "repli"`, par exemple dans `ColorPreview.tsx:44`.
- Le contexte ne définit **aucune clé** : `Translate = (key: string) => string`.
- Clés réellement utilisées :
  - `button.cancel`, `button.validate` ;
  - `common.*` ;
  - `form.values.color.*` ;
  - `wysiwyg.button.*`, `wysiwyg.formats.*`, `wysiwyg.elementFormats.*`.

**Problèmes**
- **Aucune clé** pour fermer, effacer, supprimer, afficher le mot de passe, chargement, copié, réinitialiser.
- `ToolbarPlugin.tsx:45` et `194-275` : `translate?.(…)` **sans repli**. Sans `TranslationProvider`, les 7 boutons de la barre d'outils et le bouton « activer la tabulation » n'ont pas de nom.
- Libellés par défaut codés en dur, dans deux langues :

  | Libellé | Langue | Emplacement |
  |---|---|---|
  | `"Select ..."` | anglais | `fields/select/Select.tsx:56`, `select-legacy/Select.tsx:95` |
  | `"Search..."` | anglais | `Autocomplete.tsx:91` |
  | `"Search"` | anglais | `select-legacy/Select.tsx:350` |
  | `title` des nuanciers (`${c.name} (${variant}%)`) | anglais | `NamedColorGrid.tsx:78, 107` |
  | « Annuler » | français | `ColorPicker.tsx:160` |
  | « Noir & Blanc » | français | `NamedColorGrid.tsx:98` |
  | « Par défault » (coquille) | français | `ColorPicker.tsx:165`, `ColorPreview.tsx:44` |

**Pragmatique** : suivre partout le motif `t?.("clé") ?? "Repli"`, avec des replis homogènes en français.

**Complète** : exporter depuis `TranslationContext.ts` un objet `defaultMessages` typé (union des clés), et un `useT()` qui renvoie `(k) => translate?.(k) ?? defaultMessages[k]`. Les clés sont typées et les défauts centralisés, au prix d'une API de plus à maintenir.

**Clés proposées**

| Clé | Repli |
|---|---|
| `button.close` | Fermer |
| `button.loading` | Chargement… |
| `loader.loading` | Chargement… |
| `badge.remove` | Retirer |
| `toasts.label` | Notifications |
| `password.show` | Afficher le mot de passe |
| `password.strength` | Robustesse : {label} |
| `select.clear` | Effacer la sélection |
| `select.filter` | Filtrer les options |
| `autocomplete.clear` | Effacer la recherche |
| `autocomplete.results` | {n} résultat(s) disponible(s) |
| `autocomplete.noResult` | Aucun résultat |
| `autocomplete.loading` | Recherche en cours… |
| `stars.reset` | Effacer la note |
| `stars.value` | {n} étoile(s) sur {max} |
| `stars.none` | Aucune note |
| `totp.digit` | Caractère {i} sur {n} |
| `file.remove` | Supprimer le média |
| `file.preview` | Aperçu du média sélectionné |
| `color.pickerTitle` | Choisir une couleur |
| `color.hexCode` | Code hexadécimal |
| `wysiwyg.toolbar` | Mise en forme |
| `wysiwyg.blockFormat` | Type de bloc |
| `wysiwyg.elementFormat` | Alignement |
| `wysiwyg.linkUrl` | Adresse du lien |
| `wysiwyg.linkEditor` | Édition du lien |
| `steps.status.done` | Terminé |
| `steps.status.current` | En cours |
| `steps.status.todo` | À venir |
| `resizable.handle` | Redimensionner le panneau |
| `resizeArea.handle` | Redimensionner |
| `link.newTab` | (nouvel onglet) |
| `common.copied` | Copié |
| `audio.seek` | Position de lecture |

### P6 — Le variant `dark:` est décorrélé du thème · majeur · 1.4.3

**Problème**
- Aucun `@custom-variant dark` n'est déclaré dans `src/tailwind/variants.css`. En Tailwind v4, `dark:` vaut donc `@media (prefers-color-scheme: dark)`.
- Les tokens basculent sur la **classe** `.dark` (`theme.css:210`, `base.css:6-9`). Storybook aussi (`withThemeByClassName`).
- Usages de `dark:` concernés :
  - `Field.tsx:54` : `dark:text-red-2` ;
  - `Field.tsx:64` : `dark:text-orange-2` ;
  - `Button.tsx:89` : `dark:hover:bg-custom-1/50` ;
  - `Dialog.tsx:27` et `Flash.tsx:16` : `dark:shadow-dark` ;
  - `dialog.css:5, 22, 39, 55`.
- **Impact** : classe `.light` avec un système en mode sombre.
  - Le message d'erreur s'affiche en red-2 `#ffb7b7` sur `#fff`, soit **1,65:1**.
  - L'avertissement s'affiche en `#ffddb3` sur `#fff`, soit **1,29:1**.

**Correctif**, dans `variants.css` :

```css
@custom-variant dark (&:where(.dark, .dark *));
```

L'aspect ne change que dans la combinaison aujourd'hui fautive, où système et classe sont en désaccord. C'est un correctif de bug, pas un restylage.

### P7 — Les déclencheurs `asChild` perdent `setReference` · mineur à majeur · 2.4.3

| Emplacement | Problème |
|---|---|
| `src/components/modal/ModalTrigger.tsx:19-22` | Passe `ref` (celle de l'utilisateur) au lieu de `mergedRefs` : `setReference` n'est jamais attachée. |
| `src/components/popover/PopoverTrigger.tsx:20-23`, `src/components/tooltip/TooltipTrigger.tsx:19-22` | `ref: mergedRef` est placé **avant** `...children.props`. En React 19, `props.ref` existe dès que l'enfant a une ref, et il écrase `mergedRef`. |
| `src/components/dropdown-menu-nested/MenuItemWithChildren.tsx:164` | `ref={ref}` au lieu de `ref={mergedRefs}`. **Régression** du commit `414eb03` (« remove forward refs ») : les deux branches utilisaient auparavant la ref fusionnée. |

**Effet**
- `domReference` vaut `null`.
- Le retour du focus s'appuie alors sur l'élément focalisé au moment de l'ouverture. Sous Safari, un clic ne donne pas le focus à un bouton : **le focus est perdu à la fermeture**.
- Pour `MenuItemWithChildren`, le clic sur le déclencheur est sans doute compté comme un clic extérieur, et le positionnement est probablement cassé (à valider en rendu).

**Correctif** : placer `ref` en dernier.

```tsx
getReferenceProps({ ...props, ...children.props, ref: mergedRefs, "data-state": … })
```

- Dans `ModalTrigger` et `MenuItemWithChildren`, utiliser la ref fusionnée.
- Remplacer `(children as any).ref` par `(children.props as any).ref`.

---

## 3. Overlays

### Modal — `src/components/modal/`

**Déjà bien fait**
- `FloatingFocusManager` en mode modal : focus piégé, focus initial sur le premier élément tabulable.
- `aria-hidden` sur le reste de la page.
- Retour du focus au déclencheur.
- Échap et clic sur l'overlay ferment la modale.
- `lockScroll` actif ; animations sous `motion-safe:`.
- `useRole` pose `aria-haspopup="dialog"`, `aria-expanded` et `aria-controls` sur le déclencheur.

#### MOD-1 — La modale n'a pas de nom accessible · majeur · 4.1.2

**Où** : `useModal.ts:32-33`, `ModalContent.tsx:44-45`.

**Problème** : `labelId` et `descriptionId` existent, mais `setLabelId` et `setDescriptionId` ne sont appelés nulle part. `aria-labelledby` vaut donc toujours `undefined`, et la modale est annoncée « boîte de dialogue » sans titre.

**Correctif**, dans `ModalHeader` (`Components.tsx`) :

```tsx
const { setOpen, setLabelId } = useModalContext();
const id = useId();
useLayoutEffect(() => {
  setLabelId(id);
  return () => setLabelId(undefined);
}, [id, setLabelId]);
// …
<h4 id={id} className="leading-6 font-semibold">{children}</h4>
```

- **Description** : même principe dans `ModalDescription` avec `setDescriptionId`. À réserver au contenu court, ou à rendre opt-in : un long contenu lu en entier via `aria-describedby` devient très verbeux.
- **Sans titre visible** : `aria-label` sur `<ModalContent>` fonctionne déjà, car les props passent par `getFloatingProps(props)`.

#### MOD-2 — Bouton de fermeture sans nom · majeur · 4.1.2

**Où** : `Components.tsx:22-24`.

C'est le premier élément focalisé à l'ouverture, et il est annoncé « bouton » sans nom. Même problème dans la story `WithTabs`.

**Correctif**
- Ajouter une prop `closeLabel?: string`, avec un défaut traduisible.
- `aria-label={closeLabel}` sur le `Button`, et `aria-hidden="true"` sur l'icône.

#### MOD-3 — La ref flottante n'est pas sur l'élément qui porte les props · mineur · 2.4.3, 2.1.2

**Où** : `ModalContent.tsx:21, 46, 48`.

**Problème**
- `setFloating` est sur le `<div>` intérieur, qui n'a ni rôle ni tabindex, alors que `getFloatingProps` est sur `Dialog`.
- Si la modale ne contient aucun élément tabulable (`closeButton={false}` et pas de bouton), le focus vise un div non focusable. Il reste alors sur le déclencheur, pourtant masqué par `aria-hidden`.

**Correctif** : mettre `ref={mergedRef}` sur `<Dialog>` (la prop passe par `...rest`) et retirer la ref du div intérieur. Le rendu ne change pas.

#### MOD-4 — Pas d'`aria-modal="true"` · mineur

Floating-ui ne le pose jamais. Le `aria-hidden` sur l'extérieur compense en grande partie, mais l'attribut aide notamment VoiceOver. À ajouter sur `<Dialog>` dans `ModalContent.tsx:37`.

#### MOD-5 — `<header>` et `<footer>` créent des repères parasites · mineur · 1.3.1

**Où** : `Components.tsx:27, 59`.

Hors de `article`, `aside`, `main`, `nav` et `section`, ces éléments deviennent des repères `banner` et `contentinfo`. Le portal les place directement dans `body`.

**Correctif** : `role="none"` sur les deux.

Au passage, `ModalHeaderProps` est typé `"h2"`, mais ses props vont sur `<header>`.

#### MOD-6 — Pas de variante `alertdialog` · mineur

Ajouter une option `role?: "dialog" | "alertdialog"` dans `ModalOptions`, transmise à `useRole(context, { role })`.

### Popover — `src/components/popover/`

**Déjà bien fait**
- `FloatingFocusManager` non modal : le focus entre dans le popover, et la sortie du focus le ferme (`closeOnFocusOut`).
- Retour du focus au déclencheur ; ordre de tabulation conservé par `FloatingPortal`.
- Échap ferme le popover.
- `aria-expanded`, `aria-haspopup` et `aria-controls` sur le déclencheur.

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| POP-1 | majeur | `usePopover.ts:43-44`, `PopoverContent.tsx:27-28` | Pas de nom : `setLabelId` n'est jamais appelé. | Même correctif que MOD-1, dans `PopoverHeader` (`Components.tsx:26`). |
| POP-2 | majeur | `Components.tsx:20-22` | Bouton de fermeture sans nom. | Même correctif que MOD-2. |
| POP-3 | majeur | `PopoverContent.tsx:31` | `dialog` dans un `dialog`. | `role="none"` (P1). |
| POP-4 | mineur | `PopoverContent.tsx:23` | Pas d'`aria-modal` quand `modal=true`. | `aria-modal={context.modal \|\| undefined}` |
| POP-5 | mineur | `Components.tsx:25, 41` | `header`/`footer` deviennent des repères. | `role="none"` |

### Tooltip — `src/components/tooltip/`

**Déjà bien fait**
- `useFocus` avec `visibleOnly` : l'infobulle s'ouvre au focus clavier.
- `useRole({ role: "tooltip" })` relie le déclencheur au contenu par `aria-describedby`.
- Échap ferme l'infobulle, même au survol.
- Délai de fermeture de 500 ms.

#### TT-1 — Le déclencheur par défaut `<abbr>` n'est pas focusable · majeur · 2.1.1, 1.4.13

**Où** : `TooltipTrigger.tsx:30`, utilisé par `SimpleTooltip` avec un enfant texte.

**Problème**
- Au clavier, le contenu de l'infobulle est inaccessible.
- En mode lecture du lecteur d'écran, `aria-describedby` sur un élément inline non focusable n'est pas annoncé.

**Correctif**
- **Pragmatique** : `<abbr tabIndex={0} …>`. Le style de `abbr` (`base.css:71`) ne change pas, et le contour n'apparaît qu'au focus clavier.
- **Complète** : pattern « toggletip » : un `<button>` dont le contenu est annoncé dans une live region, ou dupliqué en `sr-only` à côté du déclencheur.

La story qui utilise un `<div>` en déclencheur `asChild` (`Tooltip.stories.tsx:96-100`) est aussi inaccessible au clavier. C'est un problème d'usage, à documenter.

#### TT-2 — L'infobulle disparaît quand on la survole · majeur · 1.4.13

**Où** : `TooltipContent.tsx:18, 32` (`pointerEvents = "none"` par défaut), `useTooltip.ts:71-78` (pas de `handleClose`).

**Problème** : avec `pointer-events: none`, le délai de fermeture n'est jamais annulé quand la souris passe sur l'infobulle. Une personne qui agrandit l'affichage ne peut pas y déplacer la souris pour la lire.

**Correctif**
- `pointerEvents = "auto"` par défaut ;
- `useHover(context, { …, handleClose: safePolygon() })` ;
- permettre à `SimpleTooltip` de transmettre `pointerEvents`.

Aucun effet visuel. Seul changement de comportement : l'infobulle intercepte désormais les clics sur ce qu'elle recouvre.

#### TT-3 à TT-5 — Autres points

- **TT-3, mineur** : `role="tooltip"` est posé deux fois (`TooltipContent.tsx:42`). `role="none"` sur `<Dialog>` (P1).
- **TT-4, mineur, 4.1.3** : en mode contrôlé (`useTooltip.ts:73, 80`, story « Êtes-vous sûr ? »), hover et focus sont désactivés.
  - Une infobulle qui apparaît sans changement de focus n'est pas annoncée.
  - À documenter : pour une confirmation, changer plutôt l'`aria-label` du bouton, ou annoncer via une région `role="status"` persistante (voir HK-2).
  - Le bouton poubelle de cette story n'a pas de nom non plus.
- **TT-5, mineur, à valider avec NVDA ou VoiceOver** : `aria-describedby` n'est posé qu'à l'ouverture, donc juste après le focus. Certains lecteurs d'écran lisent la description avant qu'elle n'existe.
  - **Complète** : rendre en permanence un nœud `hidden` avec l'`id` et le contenu, et toujours poser `aria-describedby`.

### ContextMenu — `src/components/context-menu/`

**Déjà bien fait**
- `useRole("menu")`, `useListNavigation` (flèches, Home, End) et `useTypeahead`.
- Échap ferme le menu et rend le focus.
- Les items sont de vrais `<button role="menuitem">`.

#### CTX-1 — Les items ne s'activent pas au clavier · critique · 2.1.1, APG Menu

**Où** : `ContextMenu.tsx:166-177`, `ContextMenuItem.tsx:28`.

**Problème**
- L'action n'est déclenchée que sur `onMouseUp`.
- Le `onClick` renvoyé par `getItemProps` (celui de `useListNavigation`, qui ne fait que `currentTarget.focus()`) écrase via `cloneElement` le `onClick` de l'enfant.
- Résultat : Entrée ou Espace ne déclenchent qu'un `click`, qui ne fait rien. Le menu reste ouvert.

**Correctif** :

```tsx
getItemProps({
  tabIndex: …,
  ref(node) { … },
  onClick() {
    child.props.onClick?.(contextEvent.current);
    setIsOpen(false);
  },
  // facultatif, pour garder « clic droit maintenu puis relâché sur l'item »
  onMouseUp(e: React.MouseEvent) {
    if (e.button === 2) {
      child.props.onClick?.(contextEvent.current);
      setIsOpen(false);
    }
  },
})
```

`mergeProps` compose les deux `onClick`. Le `click` natif ne part pas pour le bouton droit, donc il n'y a pas de double appel.

#### CTX-2 à CTX-6 — Autres constats

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| CTX-2 | majeur | `ContextMenu.tsx:161` | `menu` > `dialog` > `menuitem`. | `role="none"` (P1). |
| CTX-3 | majeur, 2.4.7 | `src/tailwind/components/others.css:33` | `.option` a `outline-none`, et au focus seul le texte passe à `text-gray-8`. Contrairement à `DropdownMenuItem`, `ContextMenuItem` n'ajoute pas `bg-gray-1` sur l'item actif. On voit à peine l'item focalisé aux flèches. | Ajouter `focus-visible:bg-gray-1` dans l'`@apply` de `.option` (identique au survol, visible seulement au clavier), ou `className={clsx(activeIndex === index && "bg-gray-1")}` comme dans DropdownMenu. Vaut aussi pour `MenuItem` (NST-2). |
| CTX-4 | mineur | `ContextMenu.tsx:78, 159` | `useRole` pose `aria-labelledby` vers un `id` de référence qui n'existe pas dans le DOM. Le menu n'a pas de nom. | Déstructurer `"aria-label": ariaLabel` (déjà dans le type) et passer `getFloatingProps({ "aria-label": ariaLabel ?? "Menu contextuel", "aria-labelledby": undefined })`. |
| CTX-5 | mineur | `ContextMenu.tsx:154` | `initialFocus={refs.floating}` met le focus sur le conteneur, pas sur le premier item. `modal` vaut `true` par défaut, donc Tab reste piégé alors que l'APG demande de fermer le menu. | `modal={false}` (`closeOnFocusOut` fermera le menu). `setActiveIndex(0)` quand l'ouverture vient du clavier (Maj+F10, touche Menu). |
| CTX-6 | mineur | `ContextMenu.tsx:47-51`, `ContextMenuItem.tsx:27` | `listContentRef` est calculé une seule fois au montage, donc le typeahead est faux avec des items dynamiques. Pas de `type="button"` sur l'item : il soumet le formulaire englobant. | Recalculer les libellés à chaque rendu. Ajouter `type="button"`. |

### DropdownMenu — `src/components/dropdown-menu/`

**Déjà bien fait**
- `useListNavigation` avec `loop`, flèches, Home et End ; `useTypeahead`.
- Échap ; retour du focus ; fermeture à la sortie du focus.
- Item actif bien visible (`bg-gray-1`) ; items désactivés sautés.

#### DDM-1 — Rôle `dialog` alors que les items sont des `menuitem` · majeur · 4.1.2, APG Menu Button

**Où** : `useDropdownMenu.ts:79` (`useRole(context)` vaut `"dialog"` par défaut), `DropdownMenu.tsx:66`.

**Problème**
- Le déclencheur annonce `aria-haspopup="dialog"`, puis des `menuitem` apparaissent sans `menu` parent.
- Les lecteurs d'écran ne passent pas en mode menu et n'annoncent pas « 1 sur 5 ».

**Correctif**
- `useRole(context, { role: "menu" })` : le déclencheur reçoit un `id`, et le menu un `aria-labelledby` vers lui.
- `<Dialog role="none">` (P1).

**Point d'attention** : la story `Advanced` mélange au menu du contenu libre (infos utilisateur, `SelectLegacy`, séparateur `div`). Avec `role="menu"`, ce mélange n'est pas valide en ARIA.
- **Pragmatique** : une prop `role?: "menu" | "dialog"`, `"menu"` par défaut. En mode `"dialog"`, les items n'ont pas `role="menuitem"`, et le contenu mixte reste valide avec une navigation à la touche Tab.
- **Complète** : fournir `DropdownMenuSeparator` (`role="separator"`) et `DropdownMenuGroup` (`role="group"` + `aria-labelledby`), et documenter qu'un menu ne contient pas de champ.

#### DDM-2 à DDM-5 — Autres constats

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| DDM-2 | mineur | `DropdownMenuItem.tsx:33` | `aria-selected` n'est pas pris en charge sur `menuitem`. | Le supprimer : l'état actif est porté par le focus réel. |
| DDM-3 | mineur | `DropdownMenuItem.tsx:22` | `children?.toString()` donne `"[object Object]"` dès que l'enfant est du JSX : typeahead cassé. | Prop `label?: string`, puis `useListItem({ label: rest.disabled ? null : (label ?? (typeof children === "string" ? children : null)) })`. |
| DDM-4 | mineur | `DropdownMenuItem.tsx:16` | `type` est déstructuré mais jamais posé : le bouton est de type submit dans un formulaire. | Le transmettre, avec `"button"` par défaut. |
| DDM-5 | mineur | `DropdownMenuTrigger.tsx:25-26` | `{...props}` après `getReferenceProps()` écrase les handlers `onClick` et `onKeyDown` de floating-ui. | `getReferenceProps(props)`. Le composant n'est pas exporté par `index.ts` : c'est peut-être du code mort. |

### DropdownMenuNested — `src/components/dropdown-menu-nested/`

**Déjà bien fait**
- `FloatingTree` ; rôles `menu` et `menuitem`.
- `aria-haspopup="menu"`, `aria-expanded` et `aria-controls` sur les items parents.
- Flèche droite ouvre le sous-menu, flèche gauche le ferme.
- `safePolygon` ; typeahead ; chevron en `aria-hidden` ; menu nommé par son déclencheur.

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| NST-1 | majeur | `MenuItemWithChildren.tsx:164` | Régression de ref (P7). | `ref={mergedRefs}` |
| NST-2 | majeur, 2.4.7 | `MenuItem.tsx:23` | Focus peu visible, comme CTX-3. | `focus-visible:bg-gray-1` sur `.option`. |
| NST-3 | mineur | `MenuItemWithChildren.tsx:83` | `bubbles: true` : Échap ferme tout l'arbre de menus. L'APG demande de ne fermer que le sous-menu courant et de rendre le focus à l'item parent. | `useDismiss(context, { bubbles: { escapeKey: false } })`. Compromis : l'exemple officiel de floating-ui choisit `true`. |

### Portal — `src/components/portal/Portal.tsx`

Simple `createPortal` dans `body`. Rien à signaler, tant qu'il est utilisé avec un composant qui gère lui-même focus et `aria-hidden`.

---

## 4. Champs de formulaire simples

### Input / TextField — `src/components/fields/text/`

**Déjà bien fait** : `disabled` et `readOnly` natifs ; focus visible via `.p8n-input-text:has(input:focus-visible)`.

| ID | Sév. | Où | Critère | Problème | Correctif |
|---|---|---|---|---|---|
| TXT-1 | majeur | `TextField.tsx:5-22` | 1.3.5 | Le `Pick<InputProps, …>` exclut `autoComplete`, `inputMode`, `required` et les `aria-*`. Un champ email ou nom ne peut pas déclarer son usage : le critère 1.3.5 est impossible à satisfaire côté consommateur. | Ajouter `"autoComplete" \| "inputMode" \| "required"` au `Pick`, les transmettre à `<Input>` (`:46-61`), et `required={field.required}` par défaut (P3.e). |
| TXT-2 | mineur | `Input.tsx:58-69, 91-102` | 1.3.1 | Un préfixe « https:// » ou un suffixe « € » n'est ni dans le nom ni dans la description de l'input. | Seulement si `typeof prefix === "string"` (le suffixe peut être un bouton, comme dans PasswordField) : `id` sur le div du préfixe ou du suffixe, ajouté à l'`aria-describedby` de l'input. Extraire `"aria-describedby"` des props avant `...rest` pour le fusionner avec celui de P3. |
| TXT-3 | mineur | `Input.tsx:52-53`, `Textarea.tsx:34-35` | 4.1.2 | `aria-readonly` n'est pas autorisé sur un `div` sans rôle (axe `aria-allowed-attr`), et `aria-disabled="false"` est rendu sur tous les wrappers. Ces attributs servent en fait au style (`others.css:103-109`, `base.css:21-24`). | Passer à `data-disabled` / `data-readonly`, et **ajouter** ces sélecteurs à côté des `[aria-*]` existants dans les deux CSS (d'autres composants utilisent encore les `[aria-*]`). |

### PasswordField — `src/components/fields/text/PasswordField.tsx`

**Déjà bien fait** : collage non bloqué (3.3.8) ; bascule native `password`/`text`.

#### PWD-1 — Bouton œil sans nom ni état · majeur · 4.1.2

**Où** : `PasswordField.tsx:30-40`.

**Correctif recommandé** (APG demande un libellé constant quand on utilise `aria-pressed`) :

```tsx
<Button …
  aria-label={t?.("password.show") ?? "Afficher le mot de passe"}
  aria-pressed={showPassword}
  aria-controls={id}
>
  <i aria-hidden="true" className={…} />
</Button>
```

**Alternative** : pas d'`aria-pressed`, et un libellé qui change (« Afficher » / « Masquer le mot de passe »). Ne pas cumuler les deux.

Dépend de P2.a : tant que `Button` injecte `aria-checked`, `aria-checked="false"` et `aria-pressed` coexistent.

#### PWD-2 — Pas d'`autocomplete` · majeur · 1.3.5, 3.3.8

**Correctif** : prop `autoComplete?: "current-password" | "new-password"`, avec `showScore ? "new-password" : "current-password"` par défaut. Elle facilite aussi les gestionnaires de mots de passe.

#### PWD-3 — Indicateur de force uniquement visuel · mineur · 1.3.1

**Où** : `PasswordField.tsx:46-58`.

**Pragmatique**
- Un `<span id={`${id}-strength`} className="sr-only">Robustesse : {label}</span>` dans le `children` d'`Input`.
- L'ajouter à l'`aria-describedby` de l'input : il est lu au focus.
- En option, `aria-live="polite"` avec un anti-rebond d'environ 1 s, pour ne pas annoncer à chaque frappe.

**Complète** : `role="meter"` avec `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` et `aria-label`. Plus riche, mais inégalement pris en charge par les lecteurs d'écran.

### Champs à input caché : SlugField, TotpField, DateField, FileField

#### CHP-1 — Le focus n'est pas renvoyé au champ visible en cas d'erreur · majeur · 3.3.1, 2.4.3

**Où**
- `SlugField.tsx:15-17, 32-38` ;
- `TotpField.tsx:12-14, 18` ;
- `DateField.tsx:39-51, 55` ;
- `FileField.tsx:53-60`.

**Problème**
- L'input qui porte `name` est `hidden`. `focusFirstInvalidField` de conform appelle `focus(element)`.
- Ce `focus` ne fait que déclencher des `FocusEvent` synthétiques (`@conform-to/dom` `dom.mjs:444-450`) : le vrai focus ne bouge pas.
- Résultat : un utilisateur clavier ou lecteur d'écran n'est pas amené sur l'erreur à la soumission.

**Correctif** : `useControl` accepte `onFocus`, prévu pour déléguer le focus à un input personnalisé.

```tsx
const inputRef = useRef<HTMLInputElement>(null);
const control = useControl({
  defaultValue: field.defaultValue,
  onFocus: () => inputRef.current?.focus(),
});
```

- **TOTP** : viser la première case, ou la première case vide si `TotpInput` expose ses refs.
- **DateField** : le ref existe déjà (`:37`).
- **FileField** : viser le bouton « Choisir » ou « Supprimer ».

#### SLG-2 — Transformation silencieuse de la saisie · mineur · 3.3.2

**Où** : `SlugField.tsx:19-21`.

Le lecteur d'écran répète le caractère tapé, mais la valeur est convertie en slug. Prévoir un hint par défaut (« Lettres minuscules, chiffres et tirets »), relié par P3.

### Textarea / TextareaField — `src/components/fields/textarea/`

- TXT-2 et TXT-3 s'appliquent aussi (`Textarea.tsx:34-35`, `38-49`, `65-76`).
- `TextareaField.tsx:5-9` : ajouter `required` et `autoComplete` au `Pick` (comme TXT-1).

### Checkbox / CheckboxField / CheckboxesField — `src/components/fields/checkbox/`

**Déjà bien fait**
- Case native en `appearance-none` : focusable, Espace natif.
- `<label>` englobant : bon nom et cible de 24 px.
- Focus visible ; groupe nommé.

#### CHK-1 — `indeterminate` purement visuel · majeur · 4.1.2

**Où** : `Checkbox.tsx:34`.

**Problème** : seule la classe `.indeterminate` est posée, jamais la propriété DOM. Le lecteur d'écran annonce « non coché » alors que l'écran montre l'état mixte.

**Correctif** :

```tsx
const innerRef = useRef<HTMLInputElement>(null);
useEffect(() => {
  if (innerRef.current) innerRef.current.indeterminate = !!indeterminate;
}, [indeterminate]);
// ref={composeRefs(ref, innerRef)} — composeRefs existe dans src/lib
```

- Garder la classe : le CSS en dépend (`input-outline.css:55, 80`).
- Ne pas utiliser `aria-checked="mixed"` sur une case native.

#### CHK-2 — Input de `CheckboxButton` déplacé hors écran · mineur

**Où** : `Checkbox.tsx:81-84` (`h-0 w-0 translate-x-[-9999px]`).

**Problème** : l'input reste focusable et annoncé, ce qui est bien. Mais le curseur du lecteur d'écran se dessine hors écran, et l'exploration tactile VoiceOver iOS ne le trouve pas.

**Correctif sans changement visuel**
- Remplacer par `absolute inset-0 m-0 cursor-pointer appearance-none opacity-0`.
- Le label a déjà `relative` via `buttonVariants`.
- Le focus visible reste assuré par `focus-visible-has`.

#### CHK-3 — `aria-invalid` sur chaque case · mineur

En mode groupe, l'erreur passe par l'`aria-describedby` du groupe (P3.a).

- **Pragmatique** : `aria-invalid={!!errors || undefined}` sur chaque `<Checkbox>` dans `CheckboxesField.tsx:37-44`.
- **Complète** : passer par le `FieldContext` de P3.

### Radio — `src/components/fields/radio/`

**Déjà bien fait** : radios natifs (flèches et Tab natifs) ; focus visible via `:has(input:focus)` ; groupe nommé.

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| RAD-1 | mineur, 2.5.3 | `Radio.tsx:59-76` | Dans `RadioWithLegend`, tout le texte de `children` est dans le `<label>`, donc dans le nom du radio. | `aria-labelledby={`${uid}-label`}` sur l'input, et `id` sur le `<span>` du label. **Ne pas** envelopper `children` : le sélecteur `[data-radio="legend"]:has(+ * :checked)` (`base.css:17`) dépend de l'adjacence. |
| RAD-2 | mineur, APG | `RadiosField.tsx:28`, `RadioWithLegendField.tsx:31`, `RadiosButtonIconField.tsx:26` | `role="group"` au lieu de `radiogroup`. Seul ce dernier prend en charge `aria-required` et `aria-invalid`. | Dans `Field` : `group?: boolean \| "radiogroup"`, puis `role={group === "radiogroup" ? "radiogroup" : "group"}`, avec `aria-invalid` et `aria-required` dans ce cas. |
| RAD-3 | mineur | `Radio.tsx:107` | `RadioButton` : input hors écran. | Même correctif que CHK-2. |
| RAD-4 | mineur | `RadiosButtonIconField.tsx:39` | Icône non masquée. | `aria-hidden="true"`. |

### Toggle — `src/components/fields/toggle/Toggle.tsx`

**TGL-1 · mineur · APG Switch** : `Toggle.tsx:22-33` est annoncé « case à cocher », ce qui est correct mais moins juste pour un interrupteur.
- Ajouter `role="switch"` sur l'`<input type="checkbox">`.
- **Ne pas** ajouter `aria-checked` : l'état natif `checked` est utilisé.

### TOTP — `src/components/fields/totp/`

**Déjà bien fait**
- Collage multi-caractères ; flèches gauche et droite, retour arrière.
- `inputMode="numeric"`, `autoCapitalize="none"`, `spellCheck={false}`.
- Contenu sélectionné au focus.

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| OTP-1 | majeur | `TotpInput.tsx:83-97` | Chaque case est annoncée « zone d'édition, vide », six fois. Seul le groupe est nommé. | **Pragmatique** : `aria-label={t?.("totp.digit") ?? `Caractère ${i + 1} sur ${length}`}`. **Complète** : un seul `<input maxLength={6} autoComplete="one-time-code">` avec un affichage segmenté en superposition (approche de type input-otp). Meilleure expérience au lecteur d'écran, mais c'est une réécriture, avec un risque sur le rendu. |
| OTP-2 | mineur | `TotpInput.tsx:11, 24-31` | `autoComplete="one-time-code"` est déclaré dans les props mais ni déstructuré ni transmis. | `autoComplete={i === 0 ? (autoComplete ?? "one-time-code") : "off"}`. Le remplissage multi-caractères de la case 0 est déjà géré. |
| OTP-3 | majeur | `TotpField.tsx` | Focus non renvoyé en cas d'erreur. | CHP-1. |
| OTP-4 | mineur | — | Les cases ne portent ni l'erreur ni l'invalidité. | Prop `invalid` sur `TotpInput`, qui pose `aria-invalid` sur chaque case. |
| OTP-5 | mineur, 3.2.2 | — | Le focus avance automatiquement d'une case à l'autre, sans prévenir. | Une phrase dans le hint ou la description, une fois P3 en place. |

### InputButton — `src/components/fields/input-button/InputButton.tsx`

**Déjà bien fait** : Entrée et Espace gérés (`:48-54`) ; `tabIndex=-1` et `aria-disabled` quand il est désactivé ; anneau de focus.

#### IB-1 — Le label du Field n'atteint pas l'élément focusable · majeur · 1.3.1, 4.1.2, 2.5.3

**Où** : `InputButton.tsx:57-75, 95-106`.

**Problème**
- `id` est posé sur le `<Button>` interne (`focusable={false}`). Le `<label for>` nomme donc un bouton inaccessible au clavier.
- Le `div role="button"` focusable prend son nom de son contenu (valeur ou placeholder) : le libellé du champ n'est jamais annoncé.

**Pragmatique** :

```tsx
<div role="button" id={id} aria-labelledby={id ? `${id}-label ${id}-value` : undefined} …>
  <div id={`${id}-value`} …>{label || placeholder}</div>
```

Annonce : « Pays, France, bouton ». Repose sur la convention `${id}-label` (P3.b).

**Complète** : `labelId` transmis par `FieldContext`.

Selon l'usage, le pattern APG « select-only combobox » serait plus juste : `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`. Le consommateur peut déjà passer ces attributs via `...rest`.

#### IB-2 — Contrôle interactif imbriqué · majeur · axe `nested-interactive`

**Où** : `InputButton.tsx:95-106`. Un vrai `<button>` se trouve dans un `role="button"`.

**Correctif sans changement visuel** :

```tsx
<span
  aria-hidden="true"
  data-color="gray"
  data-variant="text"
  className={buttonVariants({ variant: "text", size: "input", icon: true })}
>
  <i className="fe-angle-down" />
</span>
```

Le ripple est déjà désactivé (`withRipple={false}`).

#### IB-3 — `aria-readonly` sur `role="button"` · mineur

**Où** : `InputButton.tsx:61`. Non pris en charge par ce rôle. Utiliser `role="combobox"` (où il l'est) ou `data-readonly` (TXT-3).

### DateField — `src/components/fields/date/DateField.tsx`

**Déjà bien fait** : contrôle natif `date`/`datetime-local` (segments au clavier) ; label associé via `Slot`.

- **DAT-1 · majeur** : focus non renvoyé en cas d'erreur (CHP-1).
- **DAT-2** : bug de saisie, voir § 10.

### FileField — `src/components/fields/file/FileField.tsx`, `UploaderMock.tsx`

Il n'y a ni zone de dépôt ni `<input type="file">` dans ce code (mock : bouton puis modale). Ces aspects n'ont pas pu être audités.

**Déjà bien fait**
- Modale avec piège de focus.
- Actions de l'aperçu révélées au focus (`[:has(:focus)]:opacity-100`).
- Icônes SVG en `aria-hidden`.

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| FIL-1 | critique | `FileField.tsx:68-78` | Bouton supprimer sans nom, seul moyen de retirer le média. | `aria-label={t?.("file.remove") ?? "Supprimer le média"}`, et `aria-hidden` sur l'icône. |
| FIL-2 | majeur | `FileField.tsx:53-60` | Un `<input type="text">` de debug, sans `hidden` ni nom accessible, est **visible** et contient le JSON du média. La classe `hidden-focusable` a été commentée puis supprimée (commits `f241f5e`, `76df3fd`). Avec `tabIndex=-1`, il reste lu en mode lecture. Comme il n'est pas `hidden`, conform lui donne réellement le focus à la soumission. | Ajouter `hidden` (changement visuel, mais c'est un résidu de debug), et `onFocus` dans `useControl` (CHP-1). |
| FIL-3 | majeur, 2.5.3 | `FileField.tsx:61, 82`, `UploaderMock.tsx:83` | **Sans média** : `label for` vise le bouton « Choisir un média », qui s'appelle alors « Image de couverture » : le label prend le pas sur le contenu visible. **Avec média** : `id` va sur le `div` de `MediaPreview`, qu'un label ne peut pas cibler. | `<Field id={id} group …>` : le label devient le nom du groupe, et chaque bouton garde son propre nom. |
| FIL-4 | majeur, 2.4.3 | `FileField.tsx:69-71, 84-87` | Après « Supprimer », le bouton est démonté et le focus tombe sur `body`. Après un choix, `UploaderMock` et sa modale sont démontés : le retour de focus vise un déclencheur disparu. | Un ref `pendingFocus` positionné dans les deux callbacks, puis `useEffect(…, [media])` qui donne le focus au bouton « Supprimer » ou « Choisir ». `UploaderMock` expose un `buttonRef`. Différer avec `requestAnimationFrame` si le retour de focus de floating-ui passe après. Option : `<span className="sr-only" aria-live="polite">` « Média ajouté » / « Média supprimé ». |
| FIL-5 | majeur, 1.1.1 | `MediaPreview.tsx:52-63` | L'aperçu `<img>` n'a pas d'`alt` (voir MED-1). | `alt={t?.("file.preview") ?? "Aperçu du média sélectionné"}`. Pour les autres types : texte `sr-only` « Média sélectionné : {mimeType} ». |

---

## 5. Champs de formulaire complexes

### Select — `src/components/fields/select/`

**Déjà bien fait**
- `useRole({ role: "select" })` : `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded` et `aria-controls` sur la référence.
- `useListNavigation` (boucle, `selectedIndex`) ; `useTypeahead`, avec sélection directe quand la liste est fermée.
- Espace géré pendant la frappe ; focus rendu à la référence.
- `SelectField` : l'input caché est `hidden`, et `control.focus` est redirigé vers le combobox.

| ID | Sév. | Où | Critère | Problème | Correctif |
|---|---|---|---|---|---|
| SEL-1 | **critique** | `Select.tsx:156-191` | 4.1.2, 2.5.3 | L'`id` reçu du Field est posé sur le **bouton chevron** non focusable (`:181`). Le label nomme ce bouton, et le combobox focusable **n'a aucun nom** : « liste déroulante, France », sans dire de quel champ il s'agit. | Déplacer `id={id}` sur la `div` de référence (`:156`), avec `aria-labelledby={id ? `${id}-label` : undefined}`, plus une prop `aria-label` en repli. Sur le chevron : retirer `id` et ajouter `aria-hidden`. |
| SEL-2 | **critique** | `Select.tsx:218, 222` | 4.1.2 | `aria-selected={isSelected}` est **écrasé** par `getItemProps()`, qui fusionne la prop `item` de `useRole("select")` (`'aria-selected': selected`). Comme `selected` n'est pas fourni, aucune option n'est annoncée « sélectionnée ». | `getItemProps({ active: isActive, selected: isSelected, onClick…, onKeyDown… })`, et supprimer l'attribut manuel. |
| SEL-3 | critique | `Select.tsx:203` | P1 | `dialog` entre `listbox` et `option`. | `role="none"` |
| SEL-4 | majeur | `Select.tsx`, `SelectField.tsx:35-36` | 3.3.1 | Erreurs non reliées ; `Select` n'accepte pas de props ARIA libres. | Ajouter `"aria-invalid"` et `"aria-describedby"` aux `SelectProps`, posés sur la div de référence (P3). |
| SEL-5 | mineur | `Select.tsx:56` | 3.1.2 | Placeholder par défaut en anglais (« Select ... »), lu comme valeur du combobox. | Défaut traduisible (P5). Visible seulement si le consommateur ne passe pas de placeholder. |

### SelectLegacy — `src/components/select-legacy/`

**Déjà bien fait**
- `useRole({ role: "listbox" })` pose `role="combobox"` et les attributs ARIA sur la référence.
- Tabindex itinérant sur les options ; typeahead désactivé quand la recherche a le focus.
- La prop `multiple` de `SelectSelection` n'est jamais utilisée : le point « tags supprimables au clavier » est sans objet.

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| SLG-1 | **critique** | `Select.tsx:259-284` | Le label pointe sur l'`<input className="hidden-focusable">`, qui est **visible dans l'arbre d'accessibilité** (« Pays, zone de texte, lecture seule, fr », avec la valeur brute). La `div` combobox n'a **pas de nom**. | `aria-hidden` sur l'input : il garde son `id` pour la redirection du focus de conform, et renvoie aussitôt le focus, donc pas de piège. `aria-labelledby={id ? `${id}-label` : undefined}` sur la div. |
| SLG-2 | majeur | `Select.tsx:379`, `SelectOption.tsx:21` | `aria-selected={isActive && isSelected}` : l'option sélectionnée n'est annoncée que si elle est aussi active. | `aria-selected={isSelected}` |
| SLG-3 | majeur, 2.4.3 | `Select.tsx:292-309` | Bouton d'effacement sans nom. Après le clic, il est démonté (`showCancelButton` passe à false) et **le focus tombe sur `<body>`**. | `aria-label={t?.("select.clear") ?? "Effacer la sélection"}`, et `onClick={() => { handleSelect(null); divSelectionRef.current?.focus(); }}`. |
| SLG-4 | critique | `Select.tsx:338` | P1 | `role="none"` |
| SLG-5 | majeur, 4.1.3 | `Select.tsx:348-357` | Le champ de recherche (`searchable`) n'a qu'un placeholder anglais comme nom. Il est **dans** le `listbox`, ce qui est un enfant invalide. Le nombre de résultats filtrés n'est pas annoncé. | **Pragmatique** : `aria-label={t?.("select.filter") ?? "Filtrer les options"}`, plus `<div role="status" className="sr-only">` toujours monté hors du listbox (« n options » / « Aucune option »). **Complète** : `role="listbox"` sur une div interne qui n'enveloppe que les options (conteneur en `dialog` nommé), ou basculer ce mode vers le pattern Autocomplete. |
| SLG-6 | majeur | `Select.tsx:283` | `aria-invalid` et `aria-describedby` sont acceptés via `ComponentProps<"select">` mais jamais transmis à la div. | Les répercuter sur la div de référence. |

### Autocomplete — `src/components/autocomplete/`

**Déjà bien fait**
- Focus maintenu sur l'input (`virtual: true`) avec `aria-activedescendant`.
- Options avec `id` et `role="option"` ; `aria-autocomplete="list"`.
- Échap ; flèche bas ouvre la liste ; `aria-selected` suit l'option active (conforme à l'APG combobox).
- `id` répercuté sur l'input, donc le label du Field fonctionne.

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| AC-1 | majeur | `Autocomplete.tsx:207` | `<div role="combobox">` sans nom ni état, qui **contient** l'input, lui-même `role="combobox"` via `useRole` : deux combobox imbriqués, annonce en double. | Supprimer `role="combobox"` de la div. |
| AC-2 | majeur | `Autocomplete.tsx:210` vs `231` | `refs.setReference` est sur le **conteneur**, alors que `getReferenceProps` est sur l'**input**. Floating-ui ne reconnaît pas un combobox de saisie : `aria-activedescendant` est dupliqué sur le flottant. Avec `selectOnFocus={false}`, `FloatingFocusManager` (modal par défaut) pose `aria-hidden` sur l'extérieur, **y compris les ancêtres de l'input qui a le focus**, et rend des boutons « Dismiss » en anglais. | `ref={refs.setPositionReference}` sur la div conteneur, et `ref={useMergeRefs([ref, refs.setReference, inputRef])}` sur l'input. Aucun changement visuel. |
| AC-3 | majeur, 3.2.2 | `Autocomplete.tsx:255-256` | Entrée sur une option appelle `handleSelect` sans `preventDefault` : **choisir une suggestion au clavier soumet le formulaire**. | `if (e.key === "Enter" && isOpen && activeIndex != null) { e.preventDefault(); handleSelect(activeIndex); }` |
| AC-4 | majeur, 2.4.3 | `Autocomplete.tsx:264-281` | Bouton d'effacement sans nom. Il disparaît après le clic, donc le focus est perdu. | `aria-label={t?.("autocomplete.clear") ?? "Effacer la recherche"}`, puis `inputRef.current?.focus()` dans `onClick`. |
| AC-5 | majeur, 4.1.3 | `Autocomplete.tsx:215-217, 282-315` | Rien n'annonce le nombre de résultats, l'absence de résultat ou le chargement (le `Loader` est purement visuel). Avec 0 option, un listbox **vide** est ouvert. Particulièrement gênant pour `LazyAutocomplete`. | Live region toujours montée, hors portail : `<div role="status" className="sr-only">{message}</div>`, avec `message = loading ? "Recherche en cours…" : isOpen && searchValue.trim() ? (options.length ? `${options.length} résultat(s)` : "Aucun résultat") : ""`. Option, avec un léger impact visuel : `open: isOpen && options.length > 0`, pour ne plus afficher la petite boîte vide. |
| AC-6 | critique | `Autocomplete.tsx:301` | P1 | `role="none"` |
| AC-7 | info | `LazyAutocomplete.tsx:19` | `debounce = 5000` ms par défaut : 5 s sans retour avant la recherche. Pas une non-conformité, mais cela aggrave AC-5. | Valeur à vérifier. |

### Range / RangeField / AudioRange — `src/components/fields/range/`

**Déjà bien fait** (le composant le plus solide du périmètre)
- `input type="range"` natif : flèches, PageUp, PageDown, Home et End.
- `aria-valuetext` via `valueTextFormatter`.
- Valeurs affichées en `aria-hidden`.
- Focus visible reporté sur le thumb personnalisé.
- Zone cliquable de 32 px malgré le thumb réduit.
- Pas de double poignée dans le périmètre.

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| RNG-1 | majeur | `AudioRange.tsx:163-176` | Pas de nom par défaut ; les stories l'utilisent sans `aria-label`. | `aria-label={t?.("audio.seek") ?? "Position de lecture"}`, posé **avant** `{...rest}` pour rester surchargeable. |
| RNG-2 | mineur | `AudioRange.tsx:93` | Le `aria-valuetext` par défaut `"1:23 / 4:56"` est mal lu (« 1 deux-points 23 barre oblique… »). | Formateur verbal par défaut : `` `${m} min ${s} s sur ${M} min ${S} s` ``, distinct de `formatTime`. |

### Stars / MappedStars — `src/components/fields/stars/`

**Déjà bien fait** : une alternative clavier existe (un range natif hors écran), avec un focus visible reporté sur les étoiles (`peer-focus:outline`).

#### STAR-1 — Impossible de noter au clavier quand la valeur vaut `null` · critique · 2.1.1

**Où** : `Stars.tsx:79, 86`, `MappedStars.tsx:110`.

**Problème**
- Quand la valeur vaut `null` (cas initial courant), le range est **`disabled`**.
- Les étoiles sont des `<i onClick>`, non focusables : impossible de noter au clavier ou au lecteur d'écran.
- Après « réinitialiser », c'est définitivement bloqué.

**Pragmatique** (on garde le range, aucun impact visuel)
- Ne plus désactiver le range.
- `min={required && rangeValue !== null ? 1 : 0}`, `value={rangeValue ?? 0}`.
- Dans `handleInputChange` : `const v = e.target.valueAsNumber; onChange(v === 0 ? null : v)`.
- Pour ne pas soumettre « 0 » : `name={rangeValue === null ? undefined : rest.name}`.
- La prop `zeroAsResetValue` (`Stars.tsx:15`), déclarée mais jamais lue, semble prévue pour ce cas.
- Limite : avec `step` ≠ 1, la plage commence à 0 et non à 1.
- **MappedStars** : même principe avec `min={-1}` (index -1 = aucune valeur).

**Complète** : pattern APG radio group.
- Un `role="radio"` focusable par étoile (tabindex itinérant, flèches, `aria-checked`, `aria-label="3 étoiles sur 5"`), dans un `role="radiogroup"`.
- Un focus visible par étoile.

#### STAR-2 à STAR-6 — Autres constats

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| STAR-2 | majeur | `Stars.tsx:77-88` | Pas d'`aria-valuetext` : on entend « 3 » au lieu de « 3 étoiles sur 5 ». | `aria-valuetext={rangeValue === null ? "Aucune note" : `${rangeValue} étoile${rangeValue > 1 ? "s" : ""} sur ${max}`}`, avant `{...rest}`. |
| STAR-3 | majeur | `MappedStars.tsx:94-111` | `{...rest}` (dont l'`id` du Field, `aria-label`, `onBlur`) part sur l'`<input type="hidden">` (`:96`). Le range focusable n'a **aucun nom**. | `const { name, form, ...rangeProps } = rest;` : `name` et `form` sur l'input caché, `{...rangeProps}` sur le range. |
| STAR-4 | majeur | `MappedStars.tsx:102-111` | Pas d'`aria-valuetext` : on entend « 2 » au lieu du libellé de l'option. | `aria-valuetext={rangeValue === -1 ? "Aucune valeur" : options[rangeValue].label}` |
| STAR-5 | majeur, 2.4.3 | `Stars.tsx:114-115`, `MappedStars.tsx:137-138` | Bouton de réinitialisation sans nom ; il disparaît après le clic, donc le focus est perdu. | `aria-label="Effacer la note"`, puis focus sur le range (possible une fois STAR-1 corrigé). |
| STAR-6 | mineur | `Stars.tsx:96`, `MappedStars.tsx:119` | Les `<i>` étoiles sont exposés. | `aria-hidden` sur chaque étoile. |

### Couleur — `src/components/fields/color/`, `src/components/color/`

**Déjà bien fait**
- `ColorPreview` est un vrai `<button>`, nommé par le label du Field.
- La modale utilise `Tabs`.
- Les sliders de react-colorful ont `role="slider"`, `aria-valuetext` et le clavier.
- `NamedColorGrid` et `HarmonyColorGrid` ont `type="button"` et un `title`.
- La sélection est signalée par un contour, pas seulement par la couleur.

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| COL-1 | majeur | `ColorPreview.tsx:56-80` | Le nom vient du `<label>` et remplace le contenu : **la couleur actuelle n'est jamais annoncée**. « Ouvre une boîte de dialogue » n'est pas indiqué non plus. | `<span id={descId} className="sr-only">{value ? (value.type === "raw" ? value.hex : `${colorLabel}, ${variantLabel}`) : "Par défaut"}</span>`, puis `aria-describedby` (fusionné avec celui du Field) et `aria-haspopup="dialog"` sur le bouton. **Complète** : nom lisible plutôt que l'hexa (`colord` + plugin `names`, mais en anglais : il faudrait une table de traduction). |
| COL-2 | majeur | `ColorPicker.tsx:141` | La modale est un `dialog` **sans nom** : aucun `ModalHeading`. | `<ModalContent aria-label={t?.("color.pickerTitle") ?? "Choisir une couleur"} …>` |
| COL-3 | majeur | `ColorPicker.tsx:150-151` | Bouton de fermeture sans nom. | `aria-label` (P4). |
| COL-4 | majeur, 3.3.2 | `ColorPicker.tsx:110-115` | `HexColorInput` n'a aucun label. | `aria-label={t?.("color.hexCode") ?? "Code hexadécimal"}` (react-colorful répercute les attributs). |
| COL-5 | majeur, 2.4.6 | `RawColorGrid.tsx:18-28` | Nom = « 500 », sans la teinte : une vingtaine de boutons « 500 » indiscernables. Sélection non annoncée. Pas de `type="button"`. | `type="button"`, `aria-label={`${name} ${colorNumber}`}`, `aria-pressed={value?.hex === colorCode}`. `role="group"` + `aria-labelledby` sur chaque colonne. |
| COL-6 | majeur | `NamedColorGrid.tsx:75-86, 104-114` | Nom = `title` en anglais technique (« primary (-80%) ») alors que l'en-tête visible dit « Principale ». Sélection non annoncée. | `aria-label={`${label}, ${variant === 0 ? "teinte de base" : variant > 0 ? `${variant} % plus clair` : `${-variant} % plus foncé`}`}` (variant > 0 = mélange avec du blanc, selon `lib/palette.ts:77-80`), plus `aria-pressed={selected}`. `role="group"` + `aria-labelledby` par ligne. |
| COL-7 | mineur | `HarmonyColorGrid.tsx:43-52` | Nom = hexa sans contexte d'harmonie ; sélection non annoncée. | `role="group"` + `aria-labelledby` par ligne, `aria-pressed={value?.hex === hex}`. |
| COL-8 | mineur | les trois grilles | Chaque pastille est un arrêt de tabulation (plus de 200 dans le nuancier). | **Pragmatique** : COL-5 à COL-7 suffisent pour la conformité (2.1.1 est respecté). **Complète** : `Composite`/`CompositeItem` de floating-ui avec `cols` (tabindex itinérant, flèches), et `role="radiogroup"`/`role="radio"` + `aria-checked`. Coûteux, surtout pour `RawColorGrid`, dont le nombre de colonnes varie (`grid-cols-repeat-fill-50`). |
| COL-9 | mineur, 2.4.7 | `NamedColorGrid.tsx:44`, `RawColorGrid.tsx:18-25` | Les pastilles sont collées sans z-index au focus : le contour `:focus-visible` est en partie masqué par la pastille suivante. | `focus-visible:z-20` dans `colorButtonStyle.base` et dans `RawColorGrid` (visible seulement au clavier). |
| COL-10 | mineur | `ColorPicker.tsx:165`, `ColorPreview.tsx:44` | Coquille lue à voix haute : « Par défault ». | « Par défaut ». |

### Wysiwyg — `src/components/fields/wysiwyg/`

**Déjà bien fait**
- Lexical pose `role="textbox"` sur le contenteditable.
- Raccourcis Ctrl+B, I et U natifs.
- `aria-label` sur les boutons quand une traduction existe.
- Bouton masqué jusqu'au focus pour activer la tabulation dans la barre.
- L'éditeur de lien prend le focus en mode édition et gère Échap.
- `WysiwygReader` : HTML sémantique. Point éditorial : un `h1` dans le contenu peut casser la hiérarchie de titres de la page.

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| WYS-1 | **critique** | `Wysiwyg.tsx:199-210` | L'`id` du Field va sur le contenteditable, qu'un `<label for>` ne peut pas nommer : **l'éditeur n'a pas de nom**. | Props **camelCase** de Lexical : `ariaLabelledBy={id ? `${id}-label` : undefined}`. Ajouter une prop `ariaLabel` en repli, pour l'usage hors Field. |
| WYS-2 | majeur | `Wysiwyg.tsx:199-210` | Pas d'`aria-multiline` : annoncé comme une ligne unique alors qu'Entrée crée un paragraphe. | `ariaMultiline={true}` |
| WYS-3 | majeur, 3.3.1 | `WysiwygField.tsx:35, 63-64` | Erreurs non reliées (y compris les `itemErrors` agrégées). | Accepter `"aria-invalid"` et `"aria-describedby"` dans `Wysiwyg`, et les mapper sur `ariaInvalid` et `ariaDescribedBy` (P3). |
| WYS-4 | mineur | `Wysiwyg.tsx:202-203` | `aria-readonly={readOnly}` écrase la valeur calculée par Lexical. Avec `disabled` seul, on obtient `aria-readonly="false"` sur un éditeur non éditable. En lecture seule, Lexical pose `tabIndex=-1` : le contenu n'est plus atteignable. | Supprimer `aria-readonly`, garder `aria-disabled={disabled \|\| undefined}`. Si le contenu doit rester atteignable : `tabIndex={readOnly && !disabled ? 0 : undefined}`. |
| WYS-5 | majeur | `ToolbarPlugin.tsx:183` | La barre est une simple `div` : ni `role="toolbar"`, ni nom, ni lien avec l'éditeur. | `role="toolbar"`, `aria-label={t?.("wysiwyg.toolbar") ?? "Mise en forme"}`, `aria-controls={editorId}`. |
| WYS-6 | majeur | `ToolbarPlugin.tsx:45, 194-275` | Noms tirés de `translate?.(…)` **sans repli** : sans provider, tous les boutons sont sans nom (P5). | `translate?.("wysiwyg.button.undo") ?? "Annuler"`, etc., pour toutes les clés `wysiwyg.*`. |
| WYS-7 | majeur | `ToolbarPlugin.tsx:41-47` | L'état gras, italique, souligné ou lien passe par `aria-checked` sur un bouton (P2.a) : jamais annoncé « activé ». | `"aria-pressed": selected` dans `buttonBaseProps`, **uniquement** pour les boutons bascule. Pas d'`aria-pressed` sur annuler, rétablir et filet horizontal. |
| WYS-8 | mineur | `ToolbarPlugin.tsx:184-197` | Boutons en `tabIndex=-1` par défaut : il faut découvrir le bouton de bascule pour les atteindre. `focusNextElement` cible aussi les `button[tabindex=-1]` : en désactivant le mode, le focus atterrit sur un bouton hors de l'ordre de tabulation. | **Pragmatique** : garder le mécanisme, et faire `editor.focus()` au lieu de `focusNextElement()` après « désactiver ». **Complète** : tabindex itinérant APG (un seul arrêt, flèches, Home et End) via `Composite`, ce qui rend la bascule inutile. Délicat avec les déclencheurs `DropdownMenu`. |
| WYS-9 | majeur | `BlockFormatDropdown.tsx:37-39`, `ElementFormatDropdown.tsx:33-35` | Déclencheurs à deux icônes, **sans nom**. La valeur courante (« Titre 1 », « Centré ») n'est pas exposée. | `aria-label={`${t?.("wysiwyg.blockFormat") ?? "Type de bloc"} : ${label(blockType)}`}`, et de même pour l'alignement. |
| WYS-10 | majeur | `BlockFormatDropdown.tsx:43-97`, `ElementFormatDropdown.tsx:39-78` | L'option active n'est signalée que par `bg-gray-2!`. | `role="menuitemradio"` et `aria-checked={blockType === "h1"}` sur chaque `DropdownMenuItem`. `rest` passe après `role="menuitem"` et l'écrase. Aucune classe `current:` sur `.option`, donc aucun impact visuel. Dépend de DDM-1 (`role="menu"`). |
| WYS-11 | majeur, 3.3.2 | `FloatingLinkEditorPlugin.tsx:263` | Champ URL sans label. | `aria-label={t?.("wysiwyg.linkUrl") ?? "Adresse du lien"}` |
| WYS-12 | majeur | `FloatingLinkEditorPlugin.tsx:270-329` | Quatre boutons à icône sans nom : valider, annuler, modifier, supprimer. | `aria-label` : « Valider le lien », « Annuler », « Modifier le lien », « Supprimer le lien ». |
| WYS-13 | majeur, 2.4.3 | `FloatingLinkEditorPlugin.tsx:134, 214-216, 244, 288, 326` | Échap, Entrée, OK ou Annuler font passer `isLinkEditMode` à false : l'élément qui avait le focus est démonté, et **le focus tombe sur `<body>`**. | `editor.focus()` après chaque `setIsLinkEditMode(false)` et après le `TOGGLE_LINK_COMMAND` de suppression. Cela restaure aussi la sélection Lexical. |
| WYS-14 | mineur | `FloatingLinkEditorPlugin.tsx:260` | `Dialog` en `role="dialog"` sans nom, non modal. | `aria-label={t?.("wysiwyg.linkEditor") ?? "Édition du lien"}`, ou `role="group"` avec ce nom. |

---

## 6. Autres composants

### Accordion — `src/components/accordion/`

**Déjà bien fait** : `type="button"` ; focus visible.

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| ACC-1 | majeur, 4.1.2 | `AccordionTrigger.tsx:12-15` | Ni `aria-expanded`, ni `aria-controls`, ni `id` : « Configuration, bouton », sans état ouvert ou fermé. | `const baseId = useId()` dans `Accordion.tsx`, exposé par le contexte. Dans le trigger : `id={`${baseId}-trigger-${name}`} aria-expanded={isOpen} aria-controls={`${baseId}-content-${name}`}`. `name` sert dans l'IDREF : documenter l'interdiction des espaces, ou nettoyer la valeur. |
| ACC-2 | majeur, 2.4.3, 2.4.11 | `AccordionContent.tsx:33-40` | Fermé, le contenu est seulement en `h-0 overflow-hidden`. Il reste lu, et **ses éléments focusables restent atteignables au Tab** : le focus disparaît dans une zone invisible. | `id={`${baseId}-content-${name}`} role="region" aria-labelledby={`${baseId}-trigger-${name}`} inert={!isOpen}`. `inert` n'interrompt pas la transition de hauteur, contrairement à `hidden`. Omettre `role="region"` au-delà de 6 panneaux (recommandation APG). `peerDependencies.react` vaut `"*"`, or React 18 n'accepte pas `inert` booléen : `inert={isOpen ? undefined : ""}` si on veut le supporter. |
| ACC-3 | mineur | `AccordionTrigger.tsx:18-20` | Chevron non masqué. | `aria-hidden` sur le `div.flex-center`. |
| ACC-4 | mineur, 1.3.1 | `AccordionTrigger.tsx:12` | L'APG place le bouton dans un titre, pour la navigation par titres. | Prop `headingLevel?: 1..6` qui enveloppe le bouton dans `<div role="heading" aria-level={headingLevel}>`. À vérifier en rendu : `-mt-px` et `hover:z-1`, a priori inchangés. |

### Tabs — `src/components/tabs/Tabs.tsx`

**Déjà bien fait**
- Rôles `tab` et `tabpanel` ; `aria-selected` ; `aria-labelledby` ; `useId` ; `type="button"`.
- `<Activity mode="hidden">` retire bien le contenu de l'arbre d'accessibilité.

#### TAB-1 — Aucune navigation au clavier · critique · 2.1.1, APG Tabs

**Où** : `Tabs.tsx:66`, aucun `onKeyDown`.

**Problème** : le tabindex itinérant est posé, mais aucune gestion des flèches n'existe. Les onglets non sélectionnés (`tabIndex=-1`) sont **inatteignables au clavier**.

**Correctif** : un `onKeyDown` sur le tablist.

```tsx
const enabled = tabs.filter((t) => !t.disabled);
function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
  const i = enabled.findIndex((t) => t.id === value);
  const next = {
    ArrowRight: (i + 1) % enabled.length,
    ArrowLeft: (i - 1 + enabled.length) % enabled.length,
    Home: 0,
    End: enabled.length - 1,
  }[e.key];
  if (next === undefined) return;
  e.preventDefault();
  onChange(enabled[next].id);
  document.getElementById(`${baseId}-tab-${enabled[next].id}`)?.focus();
}
```

**Cas limite** : si `value` ne correspond à aucun onglet actif, aucun onglet n'a `tabIndex=0`. Donner alors `tabIndex=0` au premier onglet activable.

#### TAB-2 à TAB-6 — Autres constats

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| TAB-2 | majeur, 4.1.2 | `Tabs.tsx:50-55, 83` | `role="tablist"` est sur le conteneur qui englobe aussi l'`action` (un bouton qui n'est pas un onglet). Les flèches le captureraient. | Déplacer `role="tablist"` sur le `div.flex.h-full` de la ligne 55, avec un `aria-label` (nouvelle prop `label`) ou `aria-labelledby` : un tablist doit être nommé. |
| TAB-3 | mineur | `Tabs.tsx:67` | `disabled` retire l'onglet de la navigation. L'APG préfère `aria-disabled="true"` avec un clic ignoré, pour que l'onglet reste perceptible. | `aria-disabled` + garde dans `onClick`. |
| TAB-4 | mineur | `Tabs.tsx:85-90` | Le tabpanel n'est pas focusable. C'est recommandé quand le panneau ne contient aucun élément focusable. | `tabIndex={0}` sur le tabpanel. Le contour n'apparaît qu'au clavier. |
| TAB-5 | mineur | `Tabs.tsx:63-65` | `aria-controls` des onglets non sélectionnés pointe vers des `id` inexistants (un seul panneau est rendu). Un `id` d'onglet avec espaces casse les IDREF. | **Pragmatique** : `aria-controls={selected ? panelId : undefined}`. **Complète** : en mode `preload`, rendre un tabpanel par onglet. |
| TAB-6 | à valider en rendu, 2.4.7 | `Tabs.tsx:54, 69` | `focus-visible:outline-offset-0` dans un conteneur `overflow-x-scroll` : le contour est probablement rogné en haut et en bas. | `focus-visible:-outline-offset-2`. |

### Steps — `src/components/steps/`

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| STP-1 | mineur, 1.3.1 | `Steps.tsx:36` | Liste ordonnée rendue en `<ul>`. | `<ol role="list">`. Le preflight remet déjà `list-style` à zéro. `role="list"` compense Safari, qui retire la sémantique de liste quand `list-style: none`. |
| STP-2 | majeur, 1.3.1, 1.4.1 | `Step.tsx:25-38` | Le statut n'est exposé que par la classe `status-*` et la couleur. Rien n'annonce « terminé » ou « en cours ». | `aria-current={status === "current" ? "step" : undefined}` sur le `<li>`, plus `<span className="sr-only">{statusLabel} : </span>` dans `.content`. |
| STP-3 | mineur | `Step.tsx:26-37` | Le marqueur (« A », « B »…) est lu avant le contenu. | `aria-hidden` sur `.marker-container` s'il est décoratif, ou une prop pour le décider. |

### HrefButton, Href, ButtonGroup — `src/components/button/`, `src/components/href/`

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| HRB-1 | majeur, 4.1.2 | `HrefButton.tsx:38` | `role="button"` sur `<a href>` : annoncé « bouton », mais Espace ne l'active pas, et il disparaît des listes de liens. | Supprimer `role="button"`. |
| HRB-2 | majeur | `HrefButton.tsx:48` | `aria-checked` (comme P2.a). Pour un lien, l'attribut pertinent est `aria-current="page"`, que le variant `current` gère déjà. | Supprimer `aria-checked`. |
| HRB-3 | majeur, 4.1.2 | `HrefButton.tsx:39, 49` | Désactivé, le lien garde son `href` : il reste focusable et la navigation fonctionne. | `href={disabled ? undefined : href}` + `aria-disabled`. Un `<a>` sans `href` n'est pas focusable. |
| HRB-4 | mineur (bonne pratique G201) | `HrefButton`, `href/index.ts` | L'ouverture dans un nouvel onglet n'est pas signalée. | Si `target === "_blank"` : `<span className="sr-only">{t?.("link.newTab") ?? "(nouvel onglet)"}</span>`. |
| BTG-1 | mineur, 1.3.1 | `ButtonGroup.tsx:28` | `div` sans sémantique ; `...rest` n'est pas propagé. | `role="group"`, et accepter `aria-label`. Pour un choix exclusif, voir P2.a (complète). |

### Badge — `src/components/badge/Badge.tsx`

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| BDG-1 | critique | `Badge.tsx:46-51` | Bouton de suppression sans nom et sans `type`. | Voir ci-dessous. |
| BDG-2 | mineur | `Badge.tsx:39` | Pas de `type="button"`. | L'ajouter. |
| BDG-3 | majeur, 4.1.2 | `Badge.tsx:55` | Avec `url` combiné à `onClick` ou `onRemove`, des `<button>` sont imbriqués dans un `<a>`. HTML invalide, comportement imprévisible. | Rendre `url` exclusif de `onClick` (par le type), ou placer le `<a>` à la place du bouton principal plutôt qu'en enveloppe. |
| BDG-4 | majeur, 2.1.1, 1.4.13 | `Badge.tsx:61-65` | Infobulle sur un badge statique attachée à un `<span>` non focusable : elle ne s'ouvre qu'au survol. | `tabIndex={tooltip && !clickable && !onRemove ? 0 : undefined}` sur le `span` racine. |
| BDG-5 | mineur, 1.4.1 | — | Ne pas porter le sens uniquement par `color` (« Danger » en rouge sans texte). | À documenter. |

Correctif BDG-1 (fonctionne avec des `children` ReactNode) :

```tsx
const labelId = useId();
const removeId = useId();
// id={labelId} sur l'élément qui porte {children}
<button type="button" aria-labelledby={`${removeId} ${labelId}`} …>
  <i className="fe-cancel" aria-hidden="true" />
  <span id={removeId} className="sr-only">{t?.("badge.remove") ?? "Retirer"}</span>
</button>
// nom calculé : « Retirer Lonlat »
```

### Loader / RoundedRectLoader — `src/components/loader/`

#### LDR-1 — Le chargement n'est pas annoncé · majeur · 4.1.3, 1.1.1

**Où** : `Loader.tsx:56-94`. Un `Loader` autonome n'expose ni rôle ni texte.

**Correctif**
- Mettre le `<svg>` en `aria-hidden="true"`.
- **Mode indéterminé** : `<span role="status" className="sr-only">{loading ? label : ""}</span>`, rendu en permanence pour que la région existe avant le changement.
- **Mode déterminé** (`progression !== -1`) : `role="progressbar" aria-valuenow={progression} aria-valuemin={0} aria-valuemax={100} aria-label={label}`, **sur le `<svg>`**, pas sur le `div`.
  - `progressbar` a des enfants présentationnels : sur le `div`, il masquerait le `Button` passé en `children` (story `Loader.stories.tsx:62-72`).
- `label = t?.("loader.loading") ?? "Chargement…"`.
- Pour l'usage dans `Button`, prévoir une prop `decorative`, ou s'appuyer sur `aria-hidden` passé via `...rest`.

#### LDR-2 — SVG décoratif non masqué · mineur

**Où** : `RoundedRectLoader.tsx:34-42`. Ajouter `aria-hidden="true"` par défaut.

### Flash — `src/components/flash/Flash.tsx`

**Déjà correct** : `role="status"` ou `role="alert"` selon la couleur (`Flash.tsx:19-20`). `aria-live` est redondant avec le rôle, mais sans danger.

| ID | Sév. | Problème | Correctif |
|---|---|---|---|
| FLS-1 | mineur, 1.4.1 | La nature du message (erreur, avertissement, succès) n'est portée que par la couleur de la bordure. | Préfixe `sr-only` selon `color` (« Erreur : », « Avertissement : »), traduisible. |
| FLS-2 | mineur | Un `Flash` présent dès le rendu serveur n'est pas annoncé (une live region n'annonce que les changements). | Acceptable pour un message de page : à documenter. |

### Snack, Toasts, Notifications — `src/components/snack/`, `toast/`, `notification/`

**Déjà bien fait** : le focus n'est jamais volé ; `motion-safe:animate-fade-in` ; `toastsManager` ne fait pas expirer les erreurs.

#### SNK-1 — Bouton de fermeture sans nom · critique · 4.1.2

**Où** : `Snack.tsx:41-45`.

**Correctif** : `aria-label={t?.("button.close") ?? "Fermer"}` sur le `Button`, `aria-hidden` sur l'icône.

#### SNK-2 — Rôle inadapté pour le rouge · majeur · 4.1.2, 4.1.3

**Où** : `Snack.tsx:35`.

**Problème** : `role="alertdialog"` impose de déplacer le focus dans le dialogue et de le nommer. Ce n'est pas non plus une live region fiable.

**Correctif** : `role={color === "red" ? "alert" : "status"}`, ou voir SNK-3.

#### SNK-3 — Annonces non fiables · majeur · 4.1.3

**Problème**
- Chaque Snack est inséré avec son contenu et son propre rôle `status`.
- Une live region injectée avec son contenu n'est pas annoncée de façon fiable (NVDA et JAWS + Chrome notamment). `role="alert"` fait exception : il est généralement annoncé.

**Pragmatique** : rendre le **conteneur** persistant live region.
- `Toasts.tsx:13` : `<div … aria-live="polite" role="region" aria-label={t?.("toasts.label") ?? "Notifications"}>`.
- `NotificationsProvider.tsx:44-52` : mêmes attributs posés par `setAttribute` sur `container.current`, créé avant toute notification.
- Côté Snack : `role={color === "red" ? "alert" : "none"}`. Il faut passer `"none"` explicitement, car `Dialog` vaut `"dialog"` par défaut (P1).
- Risque résiduel : un message rouge peut être annoncé deux fois (`alert` dans un parent `polite`).

**Complète** : deux régions persistantes, l'une `polite`, l'autre `assertive`, avec un rendu dans l'une ou l'autre selon la couleur.

#### SNK-4 — Expiration sans pause · majeur · 2.2.1, 2.4.3

**Problème**
- Les messages expirent au bout de 5 s, sans pause au survol ni au focus, et sans réglage.
- Si le focus est sur le bouton de fermeture au moment de l'expiration, il est perdu.
- **Deux minuteries coexistent** : celle du manager (`toastsManager.ts:57-60`, `NotificationsContext.ts:49-52`) et celle du Snack (`Snack.tsx:21-28`).
  - Celle du Snack redémarre à chaque rendu du parent, car `onRemove` est une fonction fléchée recréée (`Toasts.tsx:15`, `NotificationsProvider.tsx:65`).
  - Dans les faits, c'est celle du manager qui gouverne.

**Pragmatique** : supprimer le `setTimeout` des managers, et garder celui du Snack, rendu pausable.

```tsx
const onRemoveRef = useRef(onRemove);
onRemoveRef.current = onRemove;
const remaining = useRef(expiration);
const [paused, setPaused] = useState(false);

useEffect(() => {
  if (expiration === -1 || paused) return;
  const start = Date.now();
  const id = setTimeout(() => onRemoveRef.current(), remaining.current);
  return () => {
    clearTimeout(id);
    remaining.current -= Date.now() - start;
  };
}, [paused, expiration]);
// sur <Dialog> : onMouseEnter/onMouseLeave et onFocus/onBlur (vérifier relatedTarget) → setPaused
```

**Attention** : `removeToast` et `removeNotification` sortent tôt si aucun `timeoutId` n'existe (`toastsManager.ts:19-22`, `NotificationsContext.ts:10-13`). Adapter cette garde, sinon la suppression ne fonctionne plus.

**Complète** : en plus, une prop globale (`<Toasts minExpiration>` ou `autoDismiss={false}`) pour que l'application puisse allonger ou désactiver l'expiration selon une préférence utilisateur.

#### SNK-5 et SNK-6 — Autres constats

- **SNK-5, majeur, 2.2.1** : `notifyError` produit `color: "red"` (`lib/error.ts:15`), mais l'expiration par défaut reste 5000 ms dans `NotificationsContext.ts:25`. Les erreurs disparaissent donc au bout de 5 s, alors que `toastsManager.ts:37` fait bien `-1` pour le rouge.
  - Correctif : `expiration = color === "red" ? -1 : 5000`, en sortant la valeur par défaut de la déstructuration.
- **SNK-6, mineur** : le loader du Snack (`Snack.tsx:39`) n'a pas de libellé. Le passer en `aria-hidden`, le texte du message suffit.

### Table — `src/components/table/`

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| TBL-1 | mineur, 1.3.1 | `TableHeaderCell.tsx:10` | Pas de `scope`. | `scope="col"` par défaut, avant `{...props}` pour rester surchargeable. |
| TBL-2 | mineur | `Table.tsx:9` | Pas de légende. | Prop `caption`, rendue en `<caption className="sr-only">`, ou documenter `aria-label`. Au passage, `className="w-full"` est écrasé quand on passe `className` (sans rapport avec l'accessibilité). |
| TBL-3 | mineur, à valider en rendu | `TableRow.tsx:10`, `TableCell.tsx:11`, `TableHeader.tsx:10` | Sous `lg`, les éléments passent en `display: block` et `thead` en `display: none`. Certains moteurs perdent alors la sémantique de tableau. | Rôles explicites : `table`, `rowgroup`, `row`, `cell`, `columnheader`. La prop `label`, visible seulement sur mobile, compense déjà bien la perte des en-têtes. |
| TBL-4 | info | — | Pas de tri. | Prévoir `aria-sort` sur `th` le jour où un tri arrive. |

### Resizable — `src/components/resizable/`

**RSZ-1 · majeur · 2.1.1, APG Window Splitter** : la poignée (`ResizableHandle.tsx:54-70`) ne réagit qu'au pointeur. Elle n'a ni rôle, ni focus, ni clavier.

**Correctif**, sur le `div` externe (aujourd'hui `...rest` va sur la barre interne) :

```tsx
<div
  role="separator"
  tabIndex={0}
  aria-orientation="vertical"
  aria-controls={panelId}
  aria-valuenow={Math.round(width)}
  aria-valuemin={min}
  aria-valuemax={max}
  aria-label={t?.("resizable.handle") ?? "Redimensionner le panneau"}
  onKeyDown={/* ←/→ ±10 px, Maj ±50 px, Home/End = min/max */}
>
```

- La largeur est déjà mesurée par le `ResizeObserver` de `Resizable.tsx:28-34`. Il suffit de la stocker en state et de l'exposer dans le contexte.
- `ResizablePanel` reçoit un `id` via `useId`.
- **Pragmatique** : `min = 0` et `max = largeur du conteneur`, puisqu'aucune contrainte n'existe aujourd'hui.

### ResizeArea — `src/components/resize-area/ResizeArea.tsx`

**RZA-1 · majeur, quasi critique · 4.1.2, 2.1.1**

**Où** : `ResizeArea.tsx:81`.

**Problème** : un `<button>` focusable **sans nom et sans action au clavier**. Au Tab, l'utilisateur tombe sur « bouton », et Entrée ou Espace ne font rien.

**Pragmatique** : `tabIndex={-1} aria-hidden="true"`. Supprime l'arrêt fantôme, mais le critère 2.1.1 reste non couvert.

**Complète** : remplacer par `<div className="area-button" role="separator" tabIndex={0} aria-orientation={…} aria-valuenow={…} aria-label={…} onKeyDown={…}>`.
- ARIA in HTML interdit `role="separator"` sur `<button>`, d'où le `div`.
- Aucun impact visuel : le style est porté par `.area-button` (`resize-area.css`), et le preflight neutralise déjà les styles natifs du bouton.
- `aria-valuenow` : lire `parseFloat(getComputedStyle(document.documentElement).getPropertyValue(cssVarName))` à chaque mouvement, et le stocker en state.

### Scroll — `src/components/scroll/Scroll.tsx`

**SCR-1 · majeur · 2.1.1** (règle axe `scrollable-region-focusable`)

**Où** : `Scroll.tsx:100-104`.

**Problème** : la zone défilante n'est pas focusable. Sans élément focusable à l'intérieur, elle ne défile pas au clavier sous Safari (Chrome ≥ 130 et Firefox compensent).

**Correctif** :

```tsx
const overflowing = showStartShadow || showEndShadow;
<div …
  tabIndex={overflowing ? 0 : undefined}
  role={label ? "region" : undefined}
  aria-label={label}
>
```

Il faut une nouvelle prop `label`, car `...rest` part sur le `div` externe (ligne 83). Le contour n'apparaît qu'au clavier.

### Separator — `src/components/separator/index.ts`

**SEP-1 · mineur · 1.3.1** : simple chaîne de classes posée sur un `div` (usages dans `QuickSettings.stories.tsx:96, 249`).
- Documenter `role="separator"`, ou exporter un composant `<Separator>` qui le pose.
- `<hr>` est déconseillé ici : le preflight lui donne `border-top: 1px`, ce qui changerait le rendu.

### MediaPreview / FileIcon — `src/components/media-preview/`

**Déjà bien fait**
- SVG de `getIconByMime` en `aria-hidden` et `focusable="false"`.
- Actions superposées visibles au focus (`[:has(:focus)]:opacity-100`).

| ID | Sév. | Où | Problème | Correctif |
|---|---|---|---|---|
| MED-1 | majeur, 1.1.1 | `MediaPreview.tsx:52-63` | `<img>` sans `alt` : le lecteur d'écran lit l'URL. Le type `Media` (`fields/file/types.ts:3-13`) n'a ni `alt` ni `name`. | Prop `alt?: string`, puis `alt={alt ?? ""}` (décoratif par défaut si le nom est affiché à côté). Au passage, `...rest` envoie `src`, `width` et `height` sur le `div`. |
| MED-2 | mineur, 1.1.1 | `FileIcon.tsx:17-28` | Le type de fichier n'est porté que par l'icône ; le « ? » de repli est lu tel quel. | Prop `label`, puis `role="img" aria-label={label}` quand elle est fournie. `aria-hidden` sur le `span` « ? ». |

### Highlight, Code, Card, Slot

- **Highlight** (`Highlight.tsx:22`) : `<mark>` est sémantique. La plupart des lecteurs d'écran ne l'annoncent pas, ce qui est acceptable pour un surlignage de recherche.
- **Code** : pas de bouton copier, donc sans objet. Si on en ajoute un :
  - `aria-label={t?.("code.copy") ?? "Copier"}` ;
  - annonce « Copié » dans un `<span role="status" className="sr-only">` rendu en permanence (HK-3).
- **Card** : chaînes de classes uniquement, rien à signaler.
- **Slot** : transparent. Le problème vient de ce que `Button` y injecte (P2.b).

### Stories QuickSettings — `src/components/quick-settings/QuickSettings.stories.tsx`

Ce sont des exemples d'usage. Ils servent de modèle aux consommateurs, donc ils méritent d'être corrigés.

- Les libellés `<div>Temps</div>`, `<div>Distance</div>`, etc. ne sont pas associés aux `Input` et `SelectLegacy`. Utiliser `<label htmlFor>` ou `aria-labelledby`.
- Les groupes de cases « Passages autorisés » et « Éviter » : `role="group" aria-labelledby`.
- Les boutons `fe-isochrone`, `fe-route` et `fe-sliders` (lignes 139-148, 184-186) n'ont pas de nom.
- Les paires « Distance / 325 km » pourraient être des `<dl>` (mineur).

---

## 7. CSS transversale

### Focus

- **Bon point** : `base.css:13-15`, `:focus-visible { outline-yellow-4 outline-2 }`, en vrai `outline`. Sa faiblesse est son contraste en thème clair (§ 11).
- **CSS-1, majeur, 2.4.7** : `.option` a `outline-none` sans repli (`others.css:33`). Voir CTX-3 et CSS-4.
- **CSS-2, mineur** : case, toggle et radio utilisent `:focus` et non `:focus-visible` (`input-outline.css:29-40`).
  - L'anneau apparaît donc aussi au clic. Ce n'est pas une non-conformité.
  - Passer à `:focus-visible` changerait le rendu au clic : c'est un choix de design.
- **Variant `ghost`** : voir § 11.

### Masquage pour lecteurs d'écran

- `sr-only` est disponible (utilitaire natif de Tailwind v4), mais aucun composant ne l'utilise encore.
- **CSS-3, mineur** : `hidden-focusable` (`utilities.css:20-30`) utilise `clip: rect(0,0,0,0)`, propriété dépréciée. Ajouter `clip-path: inset(50%);` à côté.
- Le motif `not-focus:hidden-focusable` (`ToolbarPlugin.tsx:186`) est bon.

### Forced-colors (mode contraste élevé de Windows)

**Bon point** : les conteneurs flottants utilisent `outline-hidden`, qui prévoit en v4 un `outline: 2px solid transparent` en forced-colors. `AudioRange` remplace correctement l'outline.

#### CSS-4 — Focus et sélection des options · majeur

`.option` supprime l'outline, et l'option active n'est signalée que par un fond, écrasé en forced-colors. À placer dans `others.css`, couche components :

```css
.option {
  /* … existant … */
  @media (forced-colors: active) {
    &:is(:focus, [aria-selected="true"]) {
      outline: 2px solid Highlight;
      outline-offset: -2px;
    }
  }
}
```

`:focus` couvre Select et DropdownMenu (focus réel). `[aria-selected="true"]` couvre Autocomplete (focus virtuel).

#### CSS-5 — Boutons `contained` et `light` · majeur

Leur contour ne vient que du fond et de l'ombre (`Button.tsx:84-86`) : en forced-colors, ils deviennent du texte nu. Ajouter `forced-colors:border forced-colors:border-[ButtonText]`.

#### CSS-6 — État sélectionné ou courant · majeur

`current:bg-custom-*` (Button `selected`, `CheckboxButton` sans `showInput`, variant `current`) est invisible en forced-colors. Dans `base.css` :

```css
@media (forced-colors: active) {
  [data-variant]:is([aria-pressed="true"], [aria-checked="true"], [aria-current="page"], :has(:checked)) {
    background-color: Highlight;
    color: HighlightText;
  }
}
```

#### CSS-7 — Cases et radios cochés · majeur

L'état coché tient à `bg-current` (écrasé) et à une coche SVG en `fill='%23333'` fixe, invisible sur fond noir (`input-outline.css:55-82`). Rendre la main au contrôle natif :

```css
@media (forced-colors: active) {
  :is(.p8n-input-checkbox, .p8n-input-radio) { appearance: auto; }
  :is(.p8n-input-checkbox, .p8n-input-radio)::after { content: none; }
}
```

#### CSS-8 — Nuanciers · majeur

Les couleurs sont posées en `style={{ backgroundColor }}`, ce que forced-colors écrase aussi : toutes les pastilles deviennent identiques.
- Où : `NamedColorGrid.tsx:86, 114`, `HarmonyColorGrid.tsx:52`, `RawColorGrid.tsx:27`, `ColorPreview.tsx:69`.
- Correctif : `forced-color-adjust-none` sur `colorButtonStyle.base` (`NamedColorGrid.tsx:44`), les boutons des deux autres grilles et l'aperçu.

#### CSS-9 — Onglets · mineur, à valider en rendu

L'onglet sélectionné se distingue par `border-t-yellow-3`, contre `border-t-transparent` pour les autres (`Tabs.tsx:69-73`). En forced-colors, une bordure transparente devient visible, donc tous les onglets se ressembleraient.

```css
@media (forced-colors: active) {
  [role="tab"][aria-selected="true"] { border-top-color: Highlight; }
  [role="tab"]:not([aria-selected="true"]) { border-top-color: Canvas; }
}
```

#### CSS-10 — Range · à valider en rendu

Le pouce (`range.css:19, 31, 43`, `bg-custom-4`) et la barre de progression (`Range.tsx:130-153`) risquent de disparaître. Corriger avec `background: ButtonText` sur le pouce sous `forced-colors`, ou `forced-color-adjust-none` sur le conteneur.

### `prefers-reduced-motion`

- **Bon point** : animations d'entrée et ripple sous `motion-safe:` (11 usages).
- **CSS-11, mineur** (2.3.3 est AAA) : les transitions ne sont pas conditionnées.
  - Concerne : `AccordionContent.tsx:36`, `AccordionTrigger.tsx:19`, `Toggle.tsx:27`, `ColorPreview.tsx:65`, `range.css`, `input-outline.css:69`, `resize-area.css:16-17`, `step.css:145`, `MediaPreview.tsx:73, 80`, `AudioRange.tsx`, `Scroll.tsx:86, 94`.
  - Aucun écouteur `transitionend` ou `animationend` n'existe dans `src`, donc un raccourcissement global est sans risque. Dans `base.css` :

    ```css
    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after {
        transition-duration: 0.01ms !important;
      }
    }
    ```

  - Ne pas toucher à `animation-*` globalement, sinon les loaders s'arrêtent.
- **CSS-12, mineur** : `Loader.tsx:82` et `RoundedRectLoader.tsx:56` tournent à l'infini même en `reduce`. C'est admis (2.2.2, indicateur de chargement essentiel). Option : les ralentir avec `motion-reduce:[animation-duration:3s]`.
- `--animate-flash` (`theme.css:189`) clignote à l'infini à 1 Hz. Aucun composant ne l'utilise. S'il l'est un jour, il faudra un moyen de l'arrêter (2.2.2).

### Divers

- **CSS-13, mineur** : `[aria-disabled="true"] { pointer-events: none }` (`others.css:20-26`) bloque la souris mais pas le clavier. Un élément `aria-disabled` reste activable avec Entrée ou Espace : bloquer l'action en JS dans les composants concernés, et le documenter.
- **CSS-14, mineur** : `prose.css:53-58`, `code::before/::after { content: "`" }`. Les accents graves sont lus. Ajouter `content: "`" / "";` après la déclaration existante.
- **CSS-15, mineur, 1.4.4, 1.4.12** : `.storybook/index.css:8-12` et le bloc `html` du `README.md` conseillent `html { font-size: 16px; line-height: 24px }`.
  - Cela ignore la taille de police choisie par l'utilisateur, et un `line-height` en px ne suit pas un agrandissement du texte seul.
  - Correctif, identique à l'œil au réglage par défaut : `font-size: 100%; line-height: 1.5;`.
- `cursor: copy` sur `.can-copy` et `cursor: help` sur `abbr` : cohérent.

### Tailles de cible (2.5.8, 24 × 24 px)

- **Conformes** : Button `small` (24 × 24) ; case et radio (`h-6 w-6`) ; `.option` (`h-8`) ; options de menu (32 px).
- **CSS-16, mineur** : `--resize-grip: 10px` (`theme.css:204`) donne une zone de saisie de 10 px. La zone est transparente (seul un trait de 2 px est visible) : passer à `24px` ne change pas l'aspect.
- Badge et Toggle sans texte : voir § 11.

---

## 8. Hooks

| ID | Sév. | Où | Constat | Correctif |
|---|---|---|---|---|
| HK-1 | mineur | `src/hooks/useRipple.tsx:40-53` | Le `<span>` créé au clic n'a ni `aria-hidden` ni `pointer-events: none`. En `reduce`, il est quand même inséré (resté à `scale(0)`). | `$child.setAttribute("aria-hidden", "true"); $child.style.pointerEvents = "none";`. Option : sortir tôt si `matchMedia("(prefers-reduced-motion: reduce)").matches`. |
| HK-2 | majeur pour les usages « confirmer », 4.1.3 | `src/hooks/useDoubleCheck.ts:17-42` | Le passage dans l'état intermédiaire n'est pas annoncé. Dans l'exemple `Tooltip.stories.tsx:155-182`, un changement de description sur un élément déjà focalisé n'est pas lu de façon fiable. Bon point : remise à zéro au `blur` et à Échap. | **Pragmatique** : documenter le motif `<span role="status" className="sr-only">{dc.doubleCheck ? confirmText : ""}</span>`. **Complète** : le hook accepte `{ confirmMessage }` et renvoie un `getStatusProps()` ou un composant `<DoubleCheckStatus/>`. |
| HK-3 | mineur | `src/hooks/useCopyToClipboard.ts` | Aucune annonce après la copie. | Même motif : `<span role="status" className="sr-only">{copiedText ? (t?.("common.copied") ?? "Copié") : ""}</span>`. |
| HK-4 | mineur | `src/hooks/useOnClickOutside.ts:9` | Écoute `mousedown` uniquement, donc au pointeur seulement. Hook non utilisé en interne. | À documenter : le combiner avec `focusin` (second appel) et avec Échap. |
| HK-5 | mineur | `src/hooks/useIsClosing.ts:3, 16` | Délai de fermeture fixe de 500 ms, même en `reduce` : l'élément reste dans le DOM et dans l'arbre d'accessibilité. | `const d = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : delay;` |
| HK-6 | info | `src/hooks/useRippleLegacy.tsx` | Code mort (non exporté, non importé). | Suppression envisageable. |

---

## 9. Langue et direction

- **Langue** : pas de `lang` ni de `dir` dans les composants, ce qui est normal pour une bibliothèque. Les replis bilingues du § P5 posent en revanche un problème de langue des passages (3.1.2).
- **Propriétés CSS logiques** : `prose.css` les utilise déjà (`ps-`, `pe-`, `border-s-`).
  - Les composants n'en ont **aucune** occurrence (`ms-`, `me-`, `ps-`, `pe-`), contre 49 occurrences physiques (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`).
  - S'y ajoutent `text-left` (`others.css:33`), `float-right` (en-têtes de modale et de popover) et `step.css:159`.
  - Ce n'est pas un critère WCAG. À traiter seulement si le RTL devient un objectif.

---

## 10. Bugs hors accessibilité relevés au passage

| Où | Bug |
|---|---|
| `src/components/fields/file/FileField.tsx:53-60` | Input texte de debug visible, qui contient le JSON du média (FIL-2). |
| `src/components/fields/date/DateField.tsx:27-31, 61-64` | Vider un segment produit `e.target.value === ""`, puis `new Date(0, NaN, …)`, puis une `RangeError` dans `toISOString()`. Correctif : `if (!e.target.value) { control.change(null); return; }`. Un `console.log` traîne aussi ligne 62. |
| `src/components/dropdown-menu-nested/MenuItemWithChildren.tsx:164` | Régression de ref (P7, NST-1). |
| `src/components/dropdown-menu-nested/MenuItemWithChildren.tsx:155` | `className={clsx(isNested && "option")}` écrase le `className` du consommateur. |
| `src/components/dropdown-menu/DropdownMenuItem.tsx:16` | `type` est déstructuré mais jamais transmis (DDM-4). |
| `src/components/context-menu/ContextMenuItem.tsx:27` | Pas de `type="button"` : l'item soumet le formulaire (CTX-6). |
| `src/components/autocomplete/Autocomplete.tsx:255` | Entrée sur une suggestion soumet le formulaire (AC-3). |
| `src/components/fields/wysiwyg/plugins/ToolbarPlugin.tsx:275` | Le filet horizontal reçoit `selected = toolbarState.isLink` : il paraît enfoncé quand le curseur est dans un lien. |
| `src/components/fields/stars/Stars.tsx:15` | `zeroAsResetValue` n'est jamais lu, reste dans `rest` et part dans le DOM (avertissement React). |
| `src/components/notification/NotificationsContext.ts:25` | Les erreurs expirent au bout de 5 s, contrairement à `toastsManager` (SNK-5). |
| `src/components/snack/Snack.tsx:21-28` | Double minuterie, redémarrée à chaque rendu du parent (SNK-4). |
| `src/components/table/Table.tsx:9` | `className="w-full"` est écrasé quand on passe `className`. |
| `src/components/media-preview/MediaPreview.tsx` | `...rest` envoie `src`, `width` et `height` sur le `div`. |
| `src/components/color/ColorPicker.tsx:165`, `ColorPreview.tsx:44` | Coquille « Par défault ». |
| `src/lib/palette.ts:83-128` | `isColorDark` utilise la formule YIQ au lieu de la luminance WCAG (voir § 11). |
| `src/components/modal/Components.tsx` | `ModalHeaderProps` est typé `"h2"`, mais ses props vont sur `<header>`. |

---

## 11. Hors contrainte : corrections qui changent le visuel

Pour information. Fonds : `#ffffff` en clair, `#151d1d` en sombre.

### Contraste du texte (1.4.3, 4,5:1 minimum)

| Usage | Couleurs | Ratio |
|---|---|---|
| Erreur `text-red-4`, `Field.tsx:54` (clair) | `#e63e3e` / `#fff` | **4,10** |
| Erreur `dark:text-red-2` (sombre) | `#e63e3e` / `#151d1d` | **4,18** |
| Avertissement `text-orange-4`, `Field.tsx:64` (clair) | `#e68c35` / `#fff` | **2,57** |
| Placeholder par défaut (preflight : 50 % de `currentColor`) | ≈ `#989898` / `#fff` | **2,88** (sombre ≈ 4,12) |
| Placeholder `text-gray-5` d'InputButton (clair) | `#8c8c8c` / `#fff` | **3,36** |
| `mark` en sombre (`base.css:68`, `prose.css:107`) | `#fff` / `#f59e0b` | **2,15** |
| Bouton `contained` rouge au survol (clair) | `#323232` / `#e63e3e` | **3,13** |
| Bouton `light` vert en sombre | `#fff` / `#4f9e23` | **3,36** |
| Dialog, Snack, Tooltip, Popover bleus en sombre (`Dialog.tsx:21`) | `#dcdcdc` / `#257e9e` | **3,36** |
| Idem, vert (`Dialog.tsx:22`) | `#dcdcdc` / `#4f9e23` | **2,45** |
| Idem, orange (`Dialog.tsx:23`) | `#dcdcdc` / `#b35b26` | **3,45** |

Combinaisons conformes, pour mémoire :

| Usage | Ratio clair | Ratio sombre |
|---|---|---|
| Texte principal `gray-7` / `gray-0` | 12,82 | 12,50 |
| Texte secondaire `text-gray-6` / `gray-0` | 6,90 | 8,27 |
| `text-gray-6` / `gray-1` | 6,16 | 7,58 |
| `text-gray-6` / `gray-2` | 5,42 | 6,18 |
| Bouton `contained` jaune | 10,27 | 13,72 |
| Bouton `contained` gris, bleu, vert, orange | 4,87 à 7,98 | 5,92 à 10,11 |
| Bouton `contained` rouge au repos | 4,73 | 6,33 |
| Dialogs colorés | 10,0 à 11,8 | — |
| Outline de focus | — | 15,3 et 16,1 |

### Contraste des composants et des états (1.4.11, 3:1 minimum)

| Usage | Ratio clair | Ratio sombre |
|---|---|---|
| Bordure d'input `border-custom-2` = `gray-2` (`input-outline.css:10`) | **1,27** | **1,34** |
| Bordure d'input en erreur (`red-2`) | **1,65** | — |
| **Focus global `yellow-4`** (`base.css:14`) | **1,55** | 15,26 ✔ |
| Focus d'input `outline-custom-4` jaune (`input-outline.css:39`) | **1,55** | — |
| Focus de bouton jaune `outline-custom-5` | **2,15** (1,72 contre le fond `#ffe822`) | — |
| Case cochée : fond `yellow-3` / bord `yellow-4` | **1,25 / 1,55** | — |
| Toggle : piste `gray-1` / fond | **1,12** | **1,09** |
| Toggle : bouton `gray-2` / piste | **1,14** | **1,23** |
| Range : progression `yellow-4` / piste `gray-1` | **1,39** | — |
| Range : pouce / fond | **1,55** | — |
| Étoiles pleines (`yellow-3` / `yellow-4`) | **1,25 / 1,55** | — |
| Étoiles vides `gray-2` | **1,27** | **1,34** |
| Onglet actif (bordure `yellow-3`) | **1,25** | — |
| État `current` en `outlined` jaune (fond `yellow-3`) | **1,25** | — |
| Puces `marker:text-gray-3` de prose | 1,61 (plutôt décoratif) | — |

Les focus des couleurs rouge, bleu, vert, orange et gris passent en clair (3,36 à 6,52), ainsi que tous les focus en sombre.

**Le jaune de focus en thème clair est le point le plus important de cette section** : la visibilité de tout le parcours clavier en dépend.

### Information portée uniquement par la couleur (1.4.1)

- **Steps** : `done` et `current` ont le même marqueur (classe `active`, `Step.tsx:31`). Seule la couleur du trait les distingue (`gray-3` contre `gray-2`, `step.css:127-140`). Il faudrait une icône distincte, par exemple une coche.
- **ButtonGroup** : l'état `selected` n'est porté que par le fond (`current:bg-custom-3/4`).
- **Liens** : `linkVariant` et `decoratedLinkVariant` (`href/index.ts:4-11`) ne sont pas soulignés au repos. Dans un paragraphe, seule la couleur les distingue, sauf si le contraste avec le texte environnant atteint 3:1.
- **`errors={true}` ou `warning={true}` sans message** (`Field.tsx:52, 63, 72`) : seule la bordure rouge signale l'erreur. `aria-invalid` (P3) informe le lecteur d'écran, mais pas une personne daltonienne.
- **Grilles de couleurs** : les contours de sélection (`outline-yellow-5`, décalage -1) et de focus (`outline-yellow-4`, décalage 0) sont quasi identiques. Au clavier, on ne distingue pas « focalisé » de « sélectionné ». Il faudrait un indicateur différent, par exemple une coche.
- **Options de liste** : sélectionnée = `bg-gray-2`, active = `bg-gray-1`. Contraste entre les deux à vérifier.

### Autres

- **Variant `ghost`** (`input-outline.css:9, 38`) : pas d'anneau de focus, seulement un changement de fond `bg-gray-0`.
  - Pour un champ texte, le curseur clignotant compte comme indicateur : problème mineur.
  - Un anneau sur `:has(input:focus-visible)` apparaîtrait aussi au clic.
- **Champ obligatoire** non signalé visuellement (3.3.2) : il faudrait un astérisque ou une mention.
- **Erreurs non traduites concaténées** sans séparateur (« RequiredTooShort », `Field.tsx:43-46`).
- **Cibles** :
  - bouton de suppression du Badge : environ 18 × 24 px, collé au bouton libellé ; le `truncate` empêche d'agrandir la zone sans effet visible ;
  - Toggle sans texte : 30 × 18 px ;
  - étoiles accolées, probablement sous 24 px (à mesurer).
- **Dragging Movements (2.5.7)** : `ResizableHandle` et `ResizeArea` ne s'utilisent qu'en glissant. Le clavier (RSZ-1, RZA-1) ne satisfait pas ce critère, qui demande une alternative au pointeur sans glisser : boutons réduire/agrandir, ou menu.
- **`isColorDark`** (`src/lib/palette.ts:83-128`) : la formule YIQ choisit du texte blanc sur `#00c950`, soit **2,22:1**, alors que du noir donnerait 9,47:1. La fonction est exportée mais non utilisée en interne. Correctif : choisir la couleur au contraste WCAG le plus élevé.
- **Placeholder par défaut des Select** (SEL-5) : le traduire change le texte affiché si le consommateur n'en passe pas.
- **Autocomplete** : ne pas ouvrir de liste vide (AC-5) supprime la petite boîte vide affichée aujourd'hui.

---

## 12. Points à valider en rendu

Ces points n'ont pas pu être confirmés sans navigateur :

- **Forced-colors** : bordures transparentes des onglets (CSS-9), pouce et progression du Range (CSS-10).
- **Tabs** : contour de focus rogné par `overflow-x-scroll` (TAB-6).
- **Accordion** : `-mt-px` et `hover:z-1` inchangés avec un wrapper `role="heading"` (ACC-4).
- **Table** : perte de sémantique en `display: block` sous `lg` (TBL-3).
- **DropdownMenuNested** : positionnement probablement cassé par la régression de ref (NST-1).
- **DateField** : comportement exact lors de l'effacement d'un segment.
- **Tooltip** : annonce de la description quand `aria-describedby` est posé juste après le focus (TT-5).
- **Lecteurs d'écran** (NVDA + Firefox/Chrome, VoiceOver + Safari) : annonce des live regions après correctifs (P3.c, SNK-3, AC-5).

---

## 13. Ordre de traitement suggéré

### Étape 1 — Primitives à fort effet de levier (petits changements)

- [ ] P1 — `<Dialog role="none">` dans Select, SelectLegacy, Autocomplete, ContextMenu, DropdownMenu, Popover, Tooltip
- [ ] P2.a / P2.b — `Button` : `aria-pressed` optionnel, suppression de `role="button"`, variant `current` étendu
- [ ] HRB-1 à HRB-3 — `HrefButton` : rôle, `aria-checked`, lien désactivé
- [ ] P6 — `@custom-variant dark`
- [ ] P7 — refs des déclencheurs `asChild`
- [ ] DDM-1 — `useRole(context, { role: "menu" })`

### Étape 2 — Bloquants

- [ ] TAB-1, TAB-2 — clavier des Tabs
- [ ] CTX-1 — activation clavier du ContextMenu
- [ ] STAR-1 — notation au clavier quand la valeur vaut `null` (+ STAR-2 à STAR-5)
- [ ] SEL-1, SEL-2 — nom du combobox, `aria-selected`
- [ ] SLG-1 — nom de SelectLegacy
- [ ] WYS-1, WYS-2 — nom et `aria-multiline` du wysiwyg
- [ ] IB-1, IB-2 — InputButton
- [ ] P4 — `aria-label` sur tous les boutons à icône seule (tableau du § P4)

### Étape 3 — Formulaires

- [ ] P3 — `Field` : ids, `aria-describedby`, `aria-invalid`, live region, hint, `role="group"`, `required`
- [ ] CHP-1 — focus des champs à input caché
- [ ] TXT-1, PWD-1, PWD-2 — `autoComplete`, bouton œil
- [ ] CHK-1 — `indeterminate`
- [ ] OTP-1, OTP-2 — TOTP
- [ ] FIL-1 à FIL-5 — FileField
- [ ] AC-1 à AC-5 — Autocomplete
- [ ] SLG-2 à SLG-6 — SelectLegacy
- [ ] COL-1 à COL-7 — couleurs
- [ ] WYS-3 à WYS-14 — wysiwyg

### Étape 4 — Overlays et composants

- [ ] MOD-1, POP-1 — nom des modales et popovers
- [ ] TT-1, TT-2 — Tooltip
- [ ] CTX-3, NST-2 — focus visible des options
- [ ] ACC-1, ACC-2 — Accordion
- [ ] SNK-1 à SNK-5 — Snack et Toasts
- [ ] LDR-1 — Loader
- [ ] STP-2 — Steps
- [ ] BDG-1 à BDG-4 — Badge
- [ ] RSZ-1, RZA-1 — poignées de redimensionnement
- [ ] SCR-1 — Scroll
- [ ] MED-1 — `alt` de MediaPreview

### Étape 5 — CSS et finitions

- [ ] CSS-4 à CSS-10 — forced-colors
- [ ] CSS-11 — transitions sous `prefers-reduced-motion`
- [ ] P4 (global) — `content: … / ""` dans le gabarit fontello
- [ ] P5 — clés i18n et replis homogènes
- [ ] HK-1 à HK-5 — hooks
- [ ] Constats mineurs restants

### En parallèle

- [ ] Corriger les bugs du § 10 (FileField, DateField en priorité)
- [ ] Décider des points du § 11 avec le design, en commençant par le jaune de focus en thème clair
- [ ] Valider les points du § 12 avec un navigateur et un lecteur d'écran
