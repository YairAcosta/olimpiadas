"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserApiResponse } from "../types/ApiResponse";
import { profileRQ, logoutRQ } from "../app/api/auth";
// Estructura del contexto de autenticación
interface AuthContextType {
  user: UserApiResponse | null;
  isAuthenticated: boolean;
  loading: boolean; // Estado de autenticación: cargando/verificando
  login: () => Promise<void>; // disparar la recarga del perfil
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserApiResponse | null>(null); // Guarda el Usuario
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Estado de autenticación
  const [loading, setLoading] = useState<boolean>(true); // True al inicio para verificar la sesión
  const router = useRouter();

  // Verificar el perfil del usuario (y así la validez del token/cookie)
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await profileRQ();
      setUser(res.data.user);
      setIsAuthenticated(true);
      console.log("Usuario autenticado:", res.data.user);
    } catch (error) {
      // Si el token no es válido/no existe (ej. 401, 403), el perfil fallará
      setUser(null);
      setIsAuthenticated(false);
      console.log("No user authenticated or token invalid.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    //intenta verificar si hay una sesión activa
    checkAuth();
  }, [checkAuth]);

  // Función de login (se llama después de una respuesta exitosa de login/register)
  // Ya que el token se guarda en una cookie httpOnly en el backend,
  // esta función solo necesita disparar la verificación del perfil
  // para actualizar el estado del frontend.
  const login = useCallback(async () => {
    await checkAuth(); // Vuelve a verificar la autenticación para obtener los datos del usuario
  }, [checkAuth]);

  // Función de logout
  const logout = useCallback(async () => {
    try {
      await logoutRQ();
      setUser(null);
      setIsAuthenticated(false);
      alert("Sesión cerrada correctamente.");
      router.push("/login"); // Redirige al login después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Ocurrió un error al cerrar sesión.");
    }
  }, [router]);

  const contextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
