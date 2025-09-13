// src/api/tasks.js

const API_URL = "https://backendgestiondetaches.onrender.com/api/tasks";

export async function fetchTasks(token) {
  const res = await fetch(API_URL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des tâches");
  return res.json();
}

export async function addTask(data, token) {
  // data: { title, user, description, priority, deadline }
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de l'ajout de la tâche");
  return res.json();
}

export async function toggleTask(id, token) {
  const res = await fetch(`${API_URL}/${id}/toggle`, {
    method: "PATCH",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Erreur lors du changement d'état");
  return res.json();
}

export async function editTask(id, data, token) {
  // data: { title, description, priority, deadline }
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la modification");
  return res.json();
}

export async function removeTask(id, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
  return res.json();
}
