import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as api from "../api/tasks";
import { useAuth } from "./AuthContext.jsx";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Fonction pour rafraîchir manuellement les tâches
  const fetchTasks = useCallback(async () => {
    if (!token) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.fetchTasks(token);
      setTasks(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Charger les tâches depuis le backend au montage
  useEffect(() => {
    fetchTasks();
    // recharge les tâches quand le token change (login/logout)
  }, [fetchTasks]);

  const addTask = useCallback(
    async (data) => {
      try {
        await api.addTask(data, token);
        await fetchTasks(); // Rafraîchir la liste complète après ajout
      } catch (e) {
        setError(e.message);
      }
    },
    [token, fetchTasks]
  );

  const toggleTask = useCallback(
    async (id) => {
      try {
        const updated = await api.toggleTask(id, token);
        setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      } catch (e) {
        setError(e.message);
      }
    },
    [token]
  );

  const removeTask = useCallback(
    async (id) => {
      try {
        await api.removeTask(id, token);
        setTasks((prev) => prev.filter((t) => t._id !== id));
      } catch (e) {
        setError(e.message);
      }
    },
    [token]
  );

  const editTask = useCallback(
    async (id, data) => {
      try {
        const updated = await api.editTask(id, data, token);
        setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      } catch (e) {
        setError(e.message);
      }
    },
    [token]
  );

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;
    return { total, done, remaining: total - done };
  }, [tasks]);

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      toggleTask,
      removeTask,
      editTask,
      fetchTasks,
      stats,
      loading,
      error,
    }),
    [
      tasks,
      addTask,
      toggleTask,
      removeTask,
      editTask,
      fetchTasks,
      stats,
      loading,
      error,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
