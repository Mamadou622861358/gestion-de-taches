import { useCallback, useEffect, useState } from "react";
import { fetchUsers } from "../api/users";
import { useAuth } from "../context/AuthContext.jsx";
import useTasks from "../hooks/useTasks";

export default function TaskForm() {
  const { addTask } = useTasks();
  const { user, token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("moyenne");
  const [deadline, setDeadline] = useState("");
  const [users, setUsers] = useState([]);
  const [assigned, setAssigned] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers(token)
        .then(setUsers)
        .catch(() => setUsers([]));
    }
  }, [user, token]);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!title.trim()) return;
      const data = {
        title,
        description,
        priority,
        deadline: deadline || undefined,
      };
      if (user?.role === "admin") {
        if (!assigned) {
          setError("Sélectionnez un utilisateur");
          return;
        }
        data.user = assigned;
        addTask(data);
      } else {
        // Pour un utilisateur simple, il ne peut créer que pour lui-même
        data.user = user._id;
        addTask(data);
      }
      setTitle("");
      setDescription("");
      setPriority("moyenne");
      setDeadline("");
      setAssigned("");
      setError("");
    },
    [title, description, priority, deadline, assigned, addTask, user]
  );

  return (
    <form
      onSubmit={onSubmit}
      className="card flex flex-wrap gap-2 items-center"
    >
      <input
        aria-label="Nouvelle tâche"
        className="input flex-1"
        placeholder="Ajouter une tâche..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        aria-label="Description"
        className="input flex-1"
        placeholder="Description (optionnelle)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="input"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="basse">Priorité basse</option>
        <option value="moyenne">Priorité moyenne</option>
        <option value="haute">Priorité haute</option>
      </select>
      <input
        type="date"
        className="input"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        aria-label="Date d'échéance"
      />
      {user?.role === "admin" && (
        <select
          className="input"
          value={assigned}
          onChange={(e) => setAssigned(e.target.value)}
          required
        >
          <option value="">Assigner à...</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      )}
      <button type="submit" className="btn btn-primary">
        Ajouter
      </button>
      {error && <span className="text-red-600 ml-2">{error}</span>}
    </form>
  );
}
