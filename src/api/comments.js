export async function editComment(taskId, commentId, text, token) {
  const res = await fetch(`${API_URL}/${taskId}/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Erreur lors de la modification du commentaire");
  return res.json();
}
export async function deleteComment(taskId, commentId, token) {
  const res = await fetch(`${API_URL}/${taskId}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression du commentaire");
  return res.json();
}
const API_URL = "https://backendgestiondetaches.onrender.com/api/tasks";

export async function addComment(taskId, text, token) {
  const res = await fetch(`${API_URL}/${taskId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Erreur lors de l'ajout du commentaire");
  return res.json();
}
