export default function About() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">À propos</h1>
      <div className="card space-y-2">
        <p>
          Ce projet est un gestionnaire de tâches complet réalisé avec React. Il
          a pour objectif de mettre en pratique les concepts fondamentaux du
          framework : composants, gestion d’état, routing, optimisation et
          tests.
        </p>
        <p>
          L’application permet d’ajouter, modifier, supprimer et marquer les
          tâches comme faites ou non faites. Toutes les tâches sont sauvegardées
          dans le <code>localStorage</code> pour garantir leur persistance même
          après fermeture du navigateur.
        </p>
        <p>
          La navigation entre les pages (Accueil, À propos) est assurée par
          React Router. L’interface est moderne et responsive grâce à Tailwind
          CSS.
        </p>
        <ul className="list-disc pl-6">
          <li>
            Découpage en composants réutilisables : TaskForm, TaskList,
            TaskItem, Counter, Navbar
          </li>
          <li>Modification des tâches en temps réel</li>
          <li>
            Optimisations : <code>React.memo</code>, <code>useCallback</code>,{" "}
            <code>useMemo</code> pour des performances accrues
          </li>
          <li>Tests fonctionnels avec Jest et React Testing Library</li>
          <li>Persistance locale des données</li>
        </ul>
        <p>
          Ce projet est idéal pour découvrir les bonnes pratiques de
          développement React et servir de base à des applications plus
          avancées.
        </p>
        <p className="mt-4 font-semibold text-blue-700">
          Pour utiliser au mieux ce site, veuillez consulter&nbsp;
          <a
            href="https://mamadou622861358.github.io/l-utilisation-du-site-de-gestion-de-taches/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-700 hover:text-blue-900"
          >
            ce guide d’utilisation détaillé
          </a>
          .
        </p>
      </div>
    </section>
  );
}
