import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const link = ({ isActive }) =>
  "px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 " +
  (isActive ? "bg-slate-800" : "");

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-wide">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 text-xs">SP</span>
          <span>stats-prime</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={link}>Home</NavLink>
          <NavLink to="/login" className={link}>Login</NavLink>
          <NavLink to="/register" className={link}>Register</NavLink>
          <NavLink to="/profile" className={link}>Perfil</NavLink>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-800"
          onClick={() => setOpen(v => !v)}
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </nav>

      {/* Menú móvil */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-2 flex flex-col gap-1">
            <NavLink to="/" className={link} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/login" className={link} onClick={() => setOpen(false)}>Login</NavLink>
            <NavLink to="/register" className={link} onClick={() => setOpen(false)}>Register</NavLink>
            <NavLink to="/profile" className={link} onClick={() => setOpen(false)}>Perfil</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
