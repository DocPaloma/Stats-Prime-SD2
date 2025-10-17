import { createContext, useContext, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  // Inicializa leyendo localStorage de forma sincrónica
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem("sp_isAuth") === "true");

  const login = (newToken) => {
    setToken(newToken);
    setIsAuth(true);
    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("sp_isAuth", "true");
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("accessToken");
    setIsAuth(false);
    localStorage.setItem("sp_isAuth", "false");
  };

  const value = { isAuth, token, login, logout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthCtx);
