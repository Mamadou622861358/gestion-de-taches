import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import About from "./pages/About.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <div className="min-h-screen">
          <Navbar />
          <main className="container-page py-6">
            <Routes>
              <Route path="/login" element={<LoginWrapper />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </TaskProvider>
    </AuthProvider>
  );
}

function LoginWrapper() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  if (user) return <Navigate to="/" />;
  return (
    <Login
      onLogin={(data) => {
        login(data);
        navigate("/");
      }}
    />
  );
}
