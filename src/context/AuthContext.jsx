import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Corrige l’URL de la photo si besoin (migration depuis localhost)
  function fixUserPhoto(u) {
    if (!u || !u.photo) return u;
    if (u.photo.startsWith("http://localhost:5000/uploads")) {
      return {
        ...u,
        photo: u.photo.replace(
          "http://localhost:5000/uploads",
          "https://addgestion-de-taches.onrender.com/uploads"
        ),
      };
    }
    return u;
  }
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem("auth_user");
    const parsed = data ? JSON.parse(data) : null;
    return fixUserPhoto(parsed);
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("auth_token") || ""
  );

  useEffect(() => {
    if (user) {
      // Corrige la photo avant de stocker
      const fixed = fixUserPhoto(user);
      localStorage.setItem("auth_user", JSON.stringify(fixed));
    } else {
      localStorage.removeItem("auth_user");
    }
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");
  }, [user, token]);

  const login = (data) => {
    setUser(data.user);
    setToken(data.token);
  };
  const logout = () => {
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
