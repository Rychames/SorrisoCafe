// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/app/utils/constantes";

type AuthContextType = {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Lista de rotas públicas compartilhada
const publicRoutes = ["/login", "/signup", "/VerifyCodePage", "/not-found"];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    router.push("/login");
  }, [router]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}user/login/`, {
        email,
        password,
      });

      const { data } = response.data;
      const accessToken = data.access;

      setToken(accessToken);
      localStorage.setItem("authToken", accessToken);

      const userResponse = await axios.get(`${BASE_URL}user/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      setUser(userResponse.data);
      router.push("/");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao fazer login"
      );
    }
  }, [router]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("authToken");
      
      if (storedToken) {
        try {
          const userResponse = await axios.get(`${BASE_URL}user/`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          
          setUser(userResponse.data);
          setToken(storedToken);
        } catch (error) {
          console.error("Erro na verificação do token:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [logout]);

  useEffect(() => {
    if (!loading) {
      const isPublicPath = publicRoutes.includes(pathname);
      
      // Redireciona usuários não autenticados tentando acessar rotas privadas
      if (!user && !isPublicPath) {
        router.push("/login");
      }
      
      // Redireciona usuários autenticados tentando acessar rotas públicas
      if (user && isPublicPath) {
        router.push("/");
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};