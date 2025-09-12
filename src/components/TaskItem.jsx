import { clsx } from "clsx";
import React, { memo, useCallback } from "react";
import { addComment, deleteComment } from "../api/comments";
import { useAuth } from "../context/AuthContext.jsx";
import useTasks from "../hooks/useTasks";

function TaskItemBase({ task }) {
  // Hooks d’édition de commentaire
  const [editingCommentId, setEditingCommentId] = React.useState("");
  const [editingCommentText, setEditingCommentText] = React.useState("");
  const [commentEditLoading, setCommentEditLoading] = React.useState("");

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.text);
    setCommentError("");
  };

  const handleEditCommentCancel = () => {
    setEditingCommentId("");
    setEditingCommentText("");
  };

  const handleEditCommentSave = async (commentId) => {
    if (!editingCommentText.trim()) return;
    setCommentEditLoading(commentId);
    setCommentError("");
    try {
      await import("../api/comments").then((m) =>
        m.editComment(taskId, commentId, editingCommentText, token)
      );
      setEditingCommentId("");
      setEditingCommentText("");
      if (typeof fetchTasks === "function") fetchTasks();
    } catch (err) {
      setCommentError("Erreur lors de la modification du commentaire");
    } finally {
      setCommentEditLoading("");
    }
  };
  const { toggleTask, removeTask, editTask, fetchTasks } = useTasks();
  const { user, token } = useAuth();
  const [editing, setEditing] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(task.title);
  const [newDescription, setNewDescription] = React.useState(
    task.description || ""
  );
  const [newPriority, setNewPriority] = React.useState(
    task.priority || "moyenne"
  );
  const [newDeadline, setNewDeadline] = React.useState(
    task.deadline ? task.deadline.slice(0, 10) : ""
  );
  // Commentaires
  const [comments, setComments] = React.useState(task.comments || []);
  const [commentText, setCommentText] = React.useState("");
  const [commentLoading, setCommentLoading] = React.useState(false);
  const [commentError, setCommentError] = React.useState("");
  const [commentDeleteLoading, setCommentDeleteLoading] = React.useState(""); // id du commentaire en suppression
  // Suppression d'un commentaire
  const handleDeleteComment = async (commentId) => {
    setCommentDeleteLoading(commentId);
    setCommentError("");
    try {
      await deleteComment(taskId, commentId, token);
      if (typeof fetchTasks === "function") fetchTasks();
    } catch (err) {
      // Affichage du message d’erreur détaillé si disponible
      if (err && err.message) {
        setCommentError("Suppression impossible : " + err.message);
      } else {
        setCommentError("Erreur lors de la suppression du commentaire");
      }
    } finally {
      setCommentDeleteLoading("");
    }
  };

  // Utiliser _id pour les actions
  const taskId = task._id || task.id;

  const onToggle = useCallback(() => toggleTask(taskId), [toggleTask, taskId]);
  const onRemove = useCallback(() => removeTask(taskId), [removeTask, taskId]);
  const onEdit = useCallback(() => setEditing(true), []);
  const onCancel = useCallback(() => {
    setEditing(false);
    setNewTitle(task.title);
    setNewDescription(task.description || "");
    setNewPriority(task.priority || "moyenne");
    setNewDeadline(task.deadline ? task.deadline.slice(0, 10) : "");
  }, [task.title, task.description, task.priority, task.deadline]);
  const onSave = useCallback(() => {
    if (newTitle.trim()) {
      editTask(taskId, {
        title: newTitle,
        description: newDescription,
        priority: newPriority,
        deadline: newDeadline || undefined,
      });
    }
    setEditing(false);
  }, [editTask, taskId, newTitle, newDescription, newPriority, newDeadline]);

  React.useEffect(() => {
    if (!editing) {
      setNewTitle(task.title);
      setNewDescription(task.description || "");
      setNewPriority(task.priority || "moyenne");
      setNewDeadline(task.deadline ? task.deadline.slice(0, 10) : "");
    }
    setComments(task.comments || []);
  }, [
    editing,
    task.title,
    task.description,
    task.priority,
    task.deadline,
    task.comments,
  ]);

  // Ajout d'un commentaire
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    setCommentError("");
    try {
      await addComment(taskId, commentText, token);
      setCommentText("");
      // Rafraîchir toutes les tâches pour mettre à jour l’UI
      if (typeof fetchTasks === "function") fetchTasks();
    } catch (err) {
      setCommentError("Erreur lors de l'ajout du commentaire");
    } finally {
      setCommentLoading(false);
    }
  };

  // Affichage de l’historique si admin ou assigné
  const canSeeHistory =
    user?.role === "admin" || (task.user && user && task.user._id === user._id);

  // Calcul de l’alerte deadline
  let deadlineAlert = "";
  let deadlineColor = "";
  if (task.deadline) {
    const now = new Date();
    const d = new Date(task.deadline);
    const diff = d - now;
    if (!task.done) {
      if (diff < 0) {
        deadlineAlert = "ÉCHUE";
        deadlineColor = "text-red-600 font-bold";
      } else if (diff < 3 * 24 * 60 * 60 * 1000) {
        deadlineAlert = "Bientôt !";
        deadlineColor = "text-orange-500 font-semibold";
      }
    }
  }

  return (
    <li className="card flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex items-center gap-3 w-full md:w-auto">
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
          <>
            <input
              className="input flex-1 min-w-[180px] md:min-w-[220px]"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
            <input
              className="input flex-1 min-w-[180px] md:min-w-[220px]"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description"
            />
            <select
              className="input min-w-[120px] md:min-w-[150px]"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
            >
              <option value="basse">Priorité basse</option>
              <option value="moyenne">Priorité moyenne</option>
              <option value="haute">Priorité haute</option>
            </select>
            <input
              type="date"
              className="input min-w-[120px] md:min-w-[150px]"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              aria-label="Date d'échéance"
            />
          </>
        ) : (
          <span
            className={clsx(
              "flex-1",
              task.done && "line-through text-gray-400"
            )}
          >
            {task.title}
          </span>
        )}
      </div>
      <div className="flex-1 text-xs text-gray-600">
        {editing ? null : (
          <>
            {task.description && (
              <span>Description : {task.description} | </span>
            )}
            <span>Priorité : {task.priority || "moyenne"}</span>
            {task.deadline && (
              <span className={clsx("ml-2", deadlineColor)}>
                Échéance : {new Date(task.deadline).toLocaleDateString()}{" "}
                {deadlineAlert && `(${deadlineAlert})`}
              </span>
            )}
            {user?.role === "admin" && (
              <span className="ml-2 text-xs text-gray-500">
                {task.user?.name ? `Assignée à : ${task.user.name}` : ""}
                {task.createdBy?.name
                  ? ` | Créée par : ${task.createdBy.name}`
                  : ""}
              </span>
            )}
          </>
        )}
      </div>
      <div className="flex gap-2">
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
      </div>
      {canSeeHistory &&
        Array.isArray(task.history) &&
        task.history.length > 0 && (
          <div className="mt-2 bg-gray-50 rounded p-2 text-xs text-gray-700">
            <div className="font-bold mb-1">Historique :</div>
            <ul className="space-y-1">
              {task.history
                .slice()
                .reverse()
                .map((h, i) => (
                  <li key={i}>
                    <span className="font-semibold">{h.action}</span> —{" "}
                    {h.details}{" "}
                    <span className="text-gray-400">
                      ({new Date(h.date).toLocaleString()})
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}

      {/* Bloc commentaires */}
      <div className="mt-2 bg-gray-50 rounded p-2 text-xs text-gray-700">
        <div className="font-bold mb-1">Commentaires :</div>
        {Array.isArray(comments) && comments.length > 0 ? (
          <ul className="space-y-1 mb-2">
            {comments
              .slice()
              .reverse()
              .map((c, i) => {
                const isAuthor =
                  user && (c.by?._id === user._id || c.by === user._id);
                const canDelete = isAuthor || (user && user.role === "admin");
                const canEdit = isAuthor || (user && user.role === "admin");
                const cid = c._id;
                // Affichage personnalisé auteur/réception
                let auteurLabel = c.by?.name || c.by || "Utilisateur";
                let recuLabel = "";
                if (user) {
                  const isAuteur = c.by?._id === user._id || c.by === user._id;
                  const isAssigne = task.user && task.user._id === user._id;
                  if (isAuteur) {
                    auteurLabel = "Vous";
                  }
                  if (isAssigne && !isAuteur) {
                    recuLabel = "(Reçu)";
                  }
                }
                return (
                  <li key={i} className="flex items-center gap-2">
                    <span className="font-semibold">
                      {auteurLabel} {recuLabel}
                    </span>{" "}
                    :
                    {editingCommentId === cid ? (
                      <>
                        <input
                          className="input input-xs flex-1"
                          value={editingCommentText}
                          onChange={(e) =>
                            setEditingCommentText(e.target.value)
                          }
                          disabled={commentEditLoading === cid}
                          style={{ minWidth: 80 }}
                        />
                        <button
                          className="btn btn-xs btn-primary ml-1"
                          onClick={() => handleEditCommentSave(cid)}
                          disabled={
                            commentEditLoading === cid ||
                            !editingCommentText.trim()
                          }
                        >
                          {commentEditLoading === cid ? "..." : "Valider"}
                        </button>
                        <button
                          className="btn btn-xs btn-ghost ml-1"
                          onClick={handleEditCommentCancel}
                          disabled={commentEditLoading === cid}
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{c.text}</span>
                        <span className="text-gray-400">
                          ({new Date(c.date).toLocaleString()})
                        </span>
                        {canEdit && (
                          <button
                            className="btn btn-xs btn-ghost ml-1"
                            title="Modifier le commentaire"
                            onClick={() => handleEditComment(c)}
                            disabled={editingCommentId}
                          >
                            Modifier
                          </button>
                        )}
                      </>
                    )}
                    {canDelete && (
                      <button
                        className="btn btn-xs btn-error ml-2"
                        title="Supprimer le commentaire"
                        onClick={() => handleDeleteComment(cid)}
                        disabled={
                          commentDeleteLoading === cid ||
                          editingCommentId === cid
                        }
                      >
                        {commentDeleteLoading === cid ? "..." : "Supprimer"}
                      </button>
                    )}
                  </li>
                );
              })}
          </ul>
        ) : (
          <div className="text-gray-400 mb-2">Aucun commentaire.</div>
        )}
        {user && (
          <form className="flex gap-2 mt-1" onSubmit={handleAddComment}>
            <input
              className="input flex-1"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Ajouter un commentaire..."
              disabled={commentLoading}
            />
            <button
              className="btn btn-primary btn-xs"
              type="submit"
              disabled={commentLoading || !commentText.trim()}
            >
              {commentLoading ? "..." : "Envoyer"}
            </button>
          </form>
        )}
        {commentError && (
          <div className="text-red-500 mt-1">{commentError}</div>
        )}
      </div>
    </li>
  );
}

const TaskItem = memo(TaskItemBase);
export default TaskItem;
