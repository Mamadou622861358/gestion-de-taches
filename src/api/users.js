const API_URL = "https://backendgestiondetaches.onrender.com/api/users";

export async function fetchUsers(token) {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
  return res.json();
}
