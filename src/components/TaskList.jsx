import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import useTasks from "../hooks/useTasks.js";
import TaskItem from "./TaskItem.jsx";

export default function TaskList() {
  const { tasks } = useTasks();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [state, setState] = useState("");
  const [assigned, setAssigned] = useState("");

  // Pour l'admin, extraire la liste des utilisateurs assignés
  const users = useMemo(() => {
    if (!user || user.role !== "admin") return [];
    const map = {};
    tasks.forEach((t) => {
      if (t.user && t.user._id && t.user.name) map[t.user._id] = t.user.name;
    });
    return Object.entries(map);
  }, [tasks, user]);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (priority && t.priority !== priority) return false;
      if (state === "done" && !t.done) return false;
      if (state === "todo" && t.done) return false;
      if (assigned && t.user && t.user._id !== assigned) return false;
      return true;
    });
  }, [tasks, search, priority, state, assigned]);

  const sorted = useMemo(() => {
    // Tri simple: non terminées d'abord, puis par date desc
    return [...filtered].sort(
      (a, b) => Number(a.done) - Number(b.done) || b.createdAt - a.createdAt
    );
  }, [filtered]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <input
          className="input"
          placeholder="Rechercher par titre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Toutes priorités</option>
          <option value="basse">Basse</option>
          <option value="moyenne">Moyenne</option>
          <option value="haute">Haute</option>
        </select>
        <select
          className="input"
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
          <option value="">Toutes</option>
          <option value="todo">À faire</option>
          <option value="done">Terminées</option>
        </select>
        {user?.role === "admin" && (
          <select
            className="input"
            value={assigned}
            onChange={(e) => setAssigned(e.target.value)}
          >
            <option value="">Tous les utilisateurs</option>
            {users.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        )}
      </div>
      {sorted.length === 0 ? (
        <p className="text-center text-gray-500">
          Aucune tâche ne correspond à la recherche.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {sorted.map((task) => (
            <TaskItem key={task._id || task.id} task={task} />
          ))}
        </ul>
      )}
    </div>
  );
}
