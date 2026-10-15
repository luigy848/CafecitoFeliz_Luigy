import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService } from "../services/authService";
import { getMe } from "../services/userService";
import {
  clearToken,
  decodeToken,
  getToken,
  isTokenExpired,
  saveToken,
} from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      clearToken();
      setLoading(false);
      return;
    }

    const payload = decodeToken(token);
    if (payload) {
      setUser({ id: payload.userId, name: payload.name, role: payload.role });
    }
    setLoading(false);

    refreshUser();
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "authToken" && !event.newValue) {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const refreshUser = async () => {
    try {
      const me = await getMe();
      setUser({ id: me._id, name: me.name, role: me.role });
      return me;
    } catch (error) {
      console.warn("No se pudo refrescar el perfil:", error.message || error.kind);
      return null;
    }
  };

  const login = async (credentials) => {
    const { token } = await loginService(credentials);
    saveToken(token);

    const payload = decodeToken(token);
    if (!payload) throw new Error("Token invalido del backend");

    const loggedUser = {
      id: payload.userId,
      name: payload.name,
      role: payload.role,
    };
    setUser(loggedUser);

    return loggedUser;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    loading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
