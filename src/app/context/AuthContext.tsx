"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Importe usePathname
import axios from "axios";
import { apiUrl } from "@/app/utils/constantes";

type AuthContextType = {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Adicionando estado de loading
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname para obter o caminho atual

  // Lista de rotas públicas (não requerem autenticação)
  const publicRoutes = ["/login", "/signup", "/VerifyCodePage"]; // Adicione outras rotas públicas aqui

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      setToken(storedToken);

      // Busca informações do usuário com o token
      (async () => {
        try {
          const response = await axios.get(`${apiUrl}user/`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          setUser(response.data);
        } catch (error) {
          console.error("Erro ao buscar dados do usuário", error);
          logout();
        } finally {
          setLoading(false); // Finaliza o loading
        }
      })();
    } else {
      setLoading(false); // Finaliza o loading

      // Verifica se a rota atual é pública
      if (!publicRoutes.includes(pathname)) {
        // Redireciona para o login apenas se a rota não for pública e o usuário não estiver logado
        router.push("/login");
      }
    }
  }, [pathname]); // Adicione pathname como dependência

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${apiUrl}user/login/`, {
        email,
        password,
      });

      const { data } = response.data;
      const accessToken = data.access;

      setToken(accessToken);
      localStorage.setItem("authToken", accessToken);

      setUser({ email }); // Adicione mais detalhes conforme necessário
      router.push("/");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao fazer login"
      );
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  // Deslogar ao fechar a aba/navegador
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("authToken");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Deslogar após 30 minutos de inatividade
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        logout();
      }, 1800000); // 30 minutos
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      clearTimeout(inactivityTimer);
    };
  }, [logout]);

  // Se estiver carregando, não renderize nada
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
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