# 🗂️ Gestionnaire de Tâches (React)

Application React simple et propre pour gérer vos tâches, avec persistance locale, routing et tests.

## ✨ Fonctionnalités
- Ajouter, supprimer, marquer fait/non fait
- Persistance `localStorage`
- Compteur (total, terminées, restantes)
- Routing (Home / About)
- Tailwind CSS
- Optimisations: `React.memo`, `useCallback`, `useMemo`
- Tests: **Jest + React Testing Library**

## 🚀 Démarrage

```bash
npm install
npm run dev
```

Ouvrez http://localhost:5173

## 🧪 Tests

```bash
npm test
```

## 🧱 Structure

```
src/
  components/ (TaskForm, TaskList, TaskItem, Counter, Navbar)
  context/ TaskContext.jsx
  hooks/ useTasks.js
  pages/ Home.jsx, About.jsx
  App.jsx, main.jsx, index.css
```

## ⚙️ Choix techniques
- **localStorage** pour une persistance simple côté client
- **Découpage en composants** pour la lisibilité
- **React.memo / useCallback / useMemo** pour réduire les re-rendus
- **Jest + RTL** pour des tests fonctionnels user-centric

## 📝 Note technique (exemple court)
- `TaskItem` est mémoïsé avec `React.memo` : il ne se re-rend que si la tâche change.
- Les handlers (`addTask`, `toggleTask`, `removeTask`) sont stabilisés via `useCallback`.
- Les statistiques sont calculées via `useMemo` pour éviter les recalculs.

## 📸 Captures
Ajoutez vos captures d’écran de l’appli ici.

---

> Bonus: vous pouvez ajouter un filtrage (toutes / actives / terminées) ou une recherche.
