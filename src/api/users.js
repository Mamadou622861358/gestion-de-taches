const API_URL = "http://localhost:5000/api/users";

export async function fetchUsers(token) {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
  return res.json();
}
