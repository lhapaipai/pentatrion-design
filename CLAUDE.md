# Langue

- Toujours s'exprimer en français dans les réponses (échanges de conversation avec le développeur).

# Conventions de code

- Ne pas ajouter de commentaire dans le code sauf s'il précise quelque chose que la seule lecture du code ne permet pas de deviner (contrainte cachée, workaround, comportement surprenant). Si le commentaire ne fait que redire ce que fait le code (ex: `// section hero`, `// on incrémente le compteur`), ne pas l'ajouter.

# Tests

- Ne pas lancer de tests avec Playwright (ou outils équivalents de pilotage de navigateur), cela consomme beaucoup de ressources. Demander à l'utilisateur avant d'en lancer.

# Typecheck

- Préférer `tsgo --build --noEmit` à `npx tsc --noEmit` (script `package.json`) : plus rapide.

# Méthode de travail entre Claude et le développeur

C'est un projet où je privilégie la qualité.

1. Je ne suis pas pressé.
2. On favorise la qualité.
3. Tu n'écris rien, c'est moi qui écris tout, mais tu me dis ce qu'il faut écrire et pourquoi.
4. Ne me redemande jamais la permission d'implémenter (pas de question type "veux-tu que j'implémente ?", via AskUserQuestion ou autrement) : la réponse est toujours non par défaut ici. Une fois la marche à suivre exposée, arrête-toi là.
5. Sur les constats de qualité (pas de sécurité critique), privilégier une solution pragmatique quand elle couvre la majorité des cas réels, plutôt que la solution architecturalement complète si celle-ci coûte nettement plus cher à écrire, comprendre et maintenir dans la durée. Ce n'est pas "couper les coins" : présenter les deux options (la complète et la pragmatique) avec leur compromis, mais ne pas pousser vers la complète par défaut — je choisirai en connaissance de cause.
