import { clsx } from "clsx";
import React, { memo } from "react";
import { addComment, deleteComment } from "../api/comments";
import { useAuth } from "../context/AuthContext.jsx";
import useTasks from "../hooks/useTasks";

function TaskItemBase({ task }) {
  // Hooks d’édition de commentaire
  const [editingCommentId, setEditingCommentId] = React.useState("");
  const [editingCommentText, setEditingCommentText] = React.useState("");
  const [commentEditLoading, setCommentEditLoading] = React.useState("");
  const [commentText, setCommentText] = React.useState("");
  const [commentLoading, setCommentLoading] = React.useState(false);
  const [commentError, setCommentError] = React.useState("");
  const [commentDeleteLoading, setCommentDeleteLoading] = React.useState("");
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
  const [comments, setComments] = React.useState(task.comments || []);
  const { toggleTask, removeTask, editTask, fetchTasks } = useTasks();
  // ...autres hooks et fonctions utilitaires (user, deadlineColor, deadlineAlert, canSeeHistory, etc.) à ajouter ici si besoin...

  // Fonctions utilitaires (exemples, à adapter selon le contexte global)
  const { user, token } = useAuth();
  const canSeeHistory = true; // À adapter selon la logique d'accès
  const deadlineColor = ""; // À calculer selon la logique métier
  const deadlineAlert = ""; // À calculer selon la logique métier

  // Fonctions de gestion des commentaires (exemples, à adapter)
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
        m.editComment(task._id, commentId, editingCommentText, token)
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

  const handleDeleteComment = async (commentId) => {
    setCommentDeleteLoading(commentId);
    setCommentError("");
    try {
      await deleteComment(task._id, commentId, token);
      if (typeof fetchTasks === "function") fetchTasks();
    } catch (err) {
      setCommentError("Erreur lors de la suppression du commentaire");
    } finally {
      setCommentDeleteLoading("");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    setCommentError("");
    try {
      await addComment(task._id, commentText, token);
      setCommentText("");
      if (typeof fetchTasks === "function") fetchTasks();
    } catch (err) {
      setCommentError("Erreur lors de l'ajout du commentaire");
    } finally {
      setCommentLoading(false);
    }
  };

  const onToggle = () => toggleTask(task._id);
  const onRemove = () => removeTask(task._id);
  const onEdit = () => setEditing(true);
  const onCancel = () => {
    setEditing(false);
    setNewTitle(task.title);
    setNewDescription(task.description || "");
    setNewPriority(task.priority || "moyenne");
    setNewDeadline(task.deadline ? task.deadline.slice(0, 10) : "");
  };
  const onSave = () => {
    editTask(task._id, {
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      deadline: newDeadline,
    });
    setEditing(false);
  };

  // Affichage principal
  return (
    <li className="card flex flex-col gap-3 md:gap-3">
      {/* Tâche principale */}
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
      {/* Infos secondaires */}
      <div className="flex-1 text-xs text-gray-600">
        {!editing && (
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
      {/* Actions */}
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
      {/* Historique juste sous la tâche */}
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
      {/* Bloc commentaires tout en bas */}
      <div className="mt-2 bg-gray-50 rounded p-2 text-xs text-gray-700 flex flex-col">
        <div className="font-bold mb-1">Commentaires :</div>
        <div className="flex-1 overflow-y-auto max-h-48">
          {Array.isArray(comments) && comments.length > 0 ? (
            <ul className="flex flex-col gap-2 mb-2 max-w-full">
              {comments
                .slice()
                .reverse()
                .map((c, i) => {
                  const isAuthor =
                    user && (c.by?._id === user._id || c.by === user._id);
                  const canDelete = isAuthor || (user && user.role === "admin");
                  const canEdit = isAuthor || (user && user.role === "admin");
                  const cid = c._id;
                  let auteurLabel = c.by?.name || c.by || "Utilisateur";
                  let recuLabel = "";
                  if (user) {
                    const isAuteur =
                      c.by?._id === user._id || c.by === user._id;
                    const isAssigne = task.user && task.user._id === user._id;
                    if (isAuteur) {
                      auteurLabel = "Vous";
                    }
                    if (isAssigne && !isAuteur) {
                      recuLabel = "(Reçu)";
                    }
                  }
                  return (
                    <li
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 w-full break-words"
                    >
                      <span className="font-semibold shrink-0">
                        {auteurLabel} {recuLabel}
                      </span>
                      <span className="hidden sm:inline">:</span>
                      {editingCommentId === cid ? (
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                          <input
                            className="input input-xs flex-1 min-w-0"
                            value={editingCommentText}
                            onChange={(e) =>
                              setEditingCommentText(e.target.value)
                            }
                            disabled={commentEditLoading === cid}
                            style={{ minWidth: 80 }}
                          />
                          <div className="flex gap-1">
                            <button
                              className="btn btn-xs btn-primary"
                              onClick={() => handleEditCommentSave(cid)}
                              disabled={
                                commentEditLoading === cid ||
                                !editingCommentText.trim()
                              }
                            >
                              {commentEditLoading === cid ? "..." : "Valider"}
                            </button>
                            <button
                              className="btn btn-xs btn-ghost"
                              onClick={handleEditCommentCancel}
                              disabled={commentEditLoading === cid}
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                          <span className="break-words flex-1">{c.text}</span>
                          <span className="text-gray-400 shrink-0">
                            ({new Date(c.date).toLocaleString()})
                          </span>
                          {canEdit && (
                            <button
                              className="btn btn-xs btn-ghost"
                              title="Modifier le commentaire"
                              onClick={() => handleEditComment(c)}
                              disabled={editingCommentId}
                            >
                              Modifier
                            </button>
                          )}
                        </div>
                      )}
                      {canDelete && (
                        <button
                          className="btn btn-xs btn-error mt-1 sm:mt-0 sm:ml-2"
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
        </div>
        {/* Champ de saisie TOUJOURS collé en bas */}
        {user && (
          <form
            className="flex flex-col sm:flex-row gap-2 mt-2 w-full"
            onSubmit={handleAddComment}
          >
            <input
              className="input flex-1 min-h-[38px] min-w-0"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Ajouter un commentaire..."
              disabled={commentLoading}
              style={{ resize: "vertical" }}
            />
            <button
              className="btn btn-primary btn-xs self-end sm:self-auto"
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
