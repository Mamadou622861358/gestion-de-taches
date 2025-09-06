import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const base = "px-3 py-2 rounded-xl"
  return (
    <header className="bg-white shadow">
      <nav className="container-page flex items-center gap-3 py-3">
        <div className="font-bold text-xl">🗂️ Gestionnaire</div>
        <div className="ml-auto flex gap-2">
          <NavLink
            to="/"
            className={({ isActive }) => `${base} ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
          >
            Tâches
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `${base} ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
          >
            À propos
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
