// src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from './ui/ConfirmDialog';

// Isotipo cuadrado, sin texto (PNG con transparencia)
import spIcon from '../assets/sp-icon.png';

const link = ({ isActive }) =>
  "px-3 py-2 rounded-lg text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500 " +
  (isActive ? "bg-slate-800 border-slate-700" : "border-transparent hover:bg-slate-800");

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { isAuth, logout } = useAuth();
  const navigate = useNavigate();
  const menuBtnRef = useRef(null);

  const handleLogoutConfirmed = () => {
    setConfirmLogout(false);
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <nav className="container-app h-14 flex items-center justify-between">
          {/* Marca: icono + texto aparte */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={spIcon}
              alt="StatsPrime icon"
              className="h-9 w-9 rounded-xl object-contain select-none shadow-[0_0_0_1px_rgba(99,102,241,.25)] group-hover:scale-[1.03] transition"
              decoding="async"
              loading="eager"
              fetchpriority="high"
            />
            <span className="text-lg md:text-xl font-semibold tracking-tight leading-none">
              <span className="text-slate-200">Stats</span>
              <span className="text-indigo-400">Prime</span>
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={link}>Home</NavLink>
            {isAuth && <NavLink to="/stats" className={link}>Stats</NavLink>}
            {!isAuth && <NavLink to="/login" className={link}>Iniciar sesión</NavLink>}
            {!isAuth && <NavLink to="/register" className={link}>Registrarse</NavLink>}
            {isAuth && <NavLink to="/profile" className={link}>Perfil</NavLink>}
            {isAuth && (
              <button
                type="button"
                className="px-3 py-2 rounded-lg text-sm font-medium border border-transparent hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setConfirmLogout(true)}
              >
                Cerrar sesión
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            ref={menuBtnRef}
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setOpen(v => !v)}
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            ☰
          </button>
        </nav>

        {/* Menú móvil */}
        {open && (
          <div id="mobile-menu" className="md:hidden border-t border-slate-800 bg-slate-950">
            <div className="container-app py-2 flex flex-col gap-1">
              <NavLink to="/" className={link} onClick={() => setOpen(false)}>Home</NavLink>
              {isAuth && <NavLink to="/stats" className={link} onClick={() => setOpen(false)}>Stats</NavLink>}
              {!isAuth && <NavLink to="/login" className={link} onClick={() => setOpen(false)}>Iniciar sesión</NavLink>}
              {!isAuth && <NavLink to="/register" className={link} onClick={() => setOpen(false)}>Registrarse</NavLink>}
              {isAuth && <NavLink to="/profile" className={link} onClick={() => setOpen(false)}>Perfil</NavLink>}
              {isAuth && (
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg text-left hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => { setOpen(false); setConfirmLogout(true); }}
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Confirmación de logout */}
      <ConfirmDialog
        open={confirmLogout}
        title="¿Cerrar sesión?"
        description="Se cerrará tu sesión en este dispositivo."
        confirmText="Sí, cerrar sesión"
        cancelText="Cancelar"
        onConfirm={handleLogoutConfirmed}
        onClose={() => setConfirmLogout(false)}
      />
    </>
  );
}
