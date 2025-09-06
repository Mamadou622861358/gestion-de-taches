import { useMemo } from "react";
import useTasks from "../hooks/useTasks.js";
import TaskItem from "./TaskItem.jsx";

export default function TaskList() {
  const { tasks } = useTasks();

  const sorted = useMemo(() => {
    // Tri simple: non terminées d'abord, puis par date desc
    return [...tasks].sort(
      (a, b) => Number(a.done) - Number(b.done) || b.createdAt - a.createdAt
    );
  }, [tasks]);

  if (!sorted.length) {
    return (
      <p className="text-center text-gray-500">
        Aucune tâche. Ajoutez-en une pour commencer ✨
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {sorted.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
