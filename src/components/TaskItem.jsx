import { clsx } from "clsx";
import React, { memo, useCallback } from "react";
import useTasks from "../hooks/useTasks";

function TaskItemBase({ task }) {
  const { toggleTask, removeTask, editTask } = useTasks();
  const [editing, setEditing] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(task.title);

  const onToggle = useCallback(
    () => toggleTask(task.id),
    [toggleTask, task.id]
  );
  const onRemove = useCallback(
    () => removeTask(task.id),
    [removeTask, task.id]
  );
  const onEdit = useCallback(() => setEditing(true), []);
  const onCancel = useCallback(() => {
    setEditing(false);
    setNewTitle(task.title);
  }, [task.title]);
  const onSave = useCallback(() => {
    if (newTitle.trim() && newTitle.trim() !== task.title) {
      editTask(task.id, newTitle);
    }
    setEditing(false);
  }, [editTask, task.id, newTitle, task.title]);

  React.useEffect(() => {
    if (!editing) setNewTitle(task.title);
  }, [editing, task.title]);

  return (
    <li className="card flex items-center gap-3">
      <input
        type="checkbox"
        className="checkbox"
        checked={task.done}
        onChange={onToggle}
        aria-label={`Marquer ${task.title} comme ${
          task.done ? "non faite" : "faite"
        }`}
      />
      {editing ? (
        <input
          className="input flex-1"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave();
            if (e.key === "Escape") onCancel();
          }}
          autoFocus
        />
      ) : (
        <span
          className={clsx("flex-1", task.done && "line-through text-gray-400")}
        >
          {task.title}
        </span>
      )}
      {editing ? (
        <>
          <button
            className="btn btn-primary"
            onClick={onSave}
            aria-label="Valider modification"
          >
            Valider
          </button>
          <button
            className="btn btn-ghost"
            onClick={onCancel}
            aria-label="Annuler modification"
          >
            Annuler
          </button>
        </>
      ) : (
        <>
          <button
            className="btn btn-ghost"
            onClick={onEdit}
            aria-label={`Modifier ${task.title}`}
          >
            Modifier
          </button>
          <button
            className="btn btn-ghost"
            onClick={onRemove}
            aria-label={`Supprimer ${task.title}`}
          >
            Supprimer
          </button>
        </>
      )}
    </li>
  );
}

const TaskItem = memo(TaskItemBase);
export default TaskItem;
