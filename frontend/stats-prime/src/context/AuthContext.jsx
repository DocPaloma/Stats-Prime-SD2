import { createContext, useContext, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  // Inicializa leyendo localStorage de forma sincrónica
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem("sp_isAuth") === "true");

  const login = () => {
    setIsAuth(true);
    localStorage.setItem("sp_isAuth", "true");
  };

  const logout = () => {
    setIsAuth(false);
    localStorage.setItem("sp_isAuth", "false");
  };

  const value = { isAuth, login, logout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthCtx);
