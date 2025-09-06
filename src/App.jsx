import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import About from "./pages/About.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="container-page py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </TaskProvider>
  );
}
