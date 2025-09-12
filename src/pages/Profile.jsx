import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function Profile() {
  const { user, token, setUser } = useAuth();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(user?.photo || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [photoFile, setPhotoFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      let res, data;
      if (photoFile) {
        // Envoi multipart si fichier
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        if (password) formData.append("password", password);
        formData.append("photoFile", photoFile);
        res = await fetch(`http://localhost:5000/api/users/me`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        // Sinon, envoi JSON (URL)
        res = await fetch(`http://localhost:5000/api/users/me`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            password: password || undefined,
            photo,
          }),
        });
      }
      data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Erreur lors de la mise à jour");
      setUser(data.user);
      setSuccess("Profil mis à jour !");
      setEdit(false);
      setPassword("");
      setPhotoFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Mon profil</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {edit ? (
        <form onSubmit={handleSave} className="space-y-3">
          <div
            className={
              "flex flex-col items-center mb-2 border-2 rounded-lg p-2 " +
              (dragActive ? "border-blue-400 bg-blue-50" : "border-transparent")
            }
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setPhotoFile(e.dataTransfer.files[0]);
                setPhoto("");
              }
            }}
          >
            {photo || photoFile ? (
              <img
                src={photoFile ? URL.createObjectURL(photoFile) : photo}
                alt="Profil"
                className="w-24 h-24 rounded-full object-cover border mb-2"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-500 mb-2">
                {name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <input
              className="input w-full mb-1"
              type="url"
              value={photo}
              onChange={(e) => {
                setPhoto(e.target.value);
                setPhotoFile(null);
              }}
              placeholder="URL de la photo de profil"
            />
            <input
              className="input w-full"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPhotoFile(e.target.files[0]);
                  setPhoto("");
                }
              }}
            />
            <span className="text-xs text-gray-500 mt-1">
              URL, image locale ou glisser-déposer (max 2 Mo)
            </span>
            {dragActive && (
              <div className="absolute inset-0 bg-blue-100 bg-opacity-30 flex items-center justify-center pointer-events-none rounded-lg">
                <span className="text-blue-600 font-bold">
                  Déposez l’image ici…
                </span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Nom</label>
            <input
              className="input w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="input w-full"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Nouveau mot de passe
            </label>
            <input
              className="input w-full"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Laisser vide pour ne pas changer"
            />
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "..." : "Enregistrer"}
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setEdit(false)}
              disabled={loading}
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-2 flex flex-col items-center">
          {user?.photo ? (
            <img
              src={user.photo}
              alt="Profil"
              className="w-24 h-24 rounded-full object-cover border mb-2"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-500 mb-2">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div>
            <span className="font-medium">Nom :</span> {user?.name}
          </div>
          <div>
            <span className="font-medium">Email :</span> {user?.email}
          </div>
          <div>
            <span className="font-medium">Rôle :</span> {user?.role}
          </div>
          <button
            className="btn btn-primary mt-3"
            onClick={() => setEdit(true)}
          >
            Modifier mon profil
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
