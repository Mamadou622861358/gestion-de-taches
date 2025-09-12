import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const base = "px-3 py-2 rounded-xl";
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow">
      <nav className="container-page flex items-center gap-3 py-3">
        <div className="font-bold text-xl">🗂️ Gestionnaire</div>
        <div className="ml-auto flex gap-2 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${base} ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`
            }
          >
            Tâches
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${base} ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`
            }
          >
            À propos
          </NavLink>
          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${base} ${
                    isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                  }`
                }
              >
                Connexion
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `${base} ${
                    isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                  }`
                }
              >
                Inscription
              </NavLink>
            </>
          )}
          {user && (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${base} flex items-center gap-2 ${
                    isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                  }`
                }
              >
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt="Profil"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <span className="inline-block w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
                <span className="text-gray-700 font-medium">
                  {user.name} ({user.role})
                </span>
              </NavLink>
              <button
                className="ml-2 px-3 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
