# Note technique – Gestion et modification des tâches

## Structure et logique

L’application utilise React avec un découpage en composants :
- `TaskForm` : ajout de tâches
- `TaskList` : affichage de la liste
- `TaskItem` : chaque tâche, avec actions (marquer, modifier, supprimer)
- `Counter` : statistiques
- `Navbar` : navigation

La gestion des tâches repose sur le contexte React (`TaskContext.jsx`) :
- Les tâches sont stockées dans un state local et synchronisées avec le `localStorage` pour la persistance.
- Les actions principales sont :
  - `addTask` : ajoute une tâche
  - `removeTask` : supprime une tâche
  - `toggleTask` : marque comme faite/non faite
  - `editTask` : modifie le titre d’une tâche

## Fonctionnalité de modification

- Dans `TaskItem.jsx`, un bouton « Modifier » permet d’éditer le texte d’une tâche.
- Lors du clic, le texte devient un champ input :
  - On peut valider (bouton ou touche Entrée) ou annuler (bouton ou touche Échap).
  - La modification est appliquée via la fonction `editTask` du contexte.
- L’état local du composant gère l’affichage du champ d’édition et la valeur temporaire.

## Optimisations

- Les handlers (`onToggle`, `onRemove`, `onEdit`, etc.) sont mémorisés avec `useCallback` pour éviter les re-rendus inutiles.
- Les statistiques sont calculées avec `useMemo`.
- Le composant `TaskItem` est mémoïsé avec `React.memo`.

## Tests

Des tests fonctionnels vérifient l’ajout, la suppression et le marquage des tâches.
La modification peut être testée de la même façon (interaction utilisateur et vérification du rendu).

---

Ce fonctionnement garantit une application réactive, optimisée et facile à maintenir.
Tu peux enrichir la logique (filtrage, recherche) ou les tests selon tes besoins.
