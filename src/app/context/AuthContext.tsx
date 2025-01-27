"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiUrl } from "@/app/utils/constantes";

type AuthContextType = {
    user: any; // Ajuste o tipo para refletir a estrutura do usuário (pode ser um objeto mais detalhado)
    setUser: React.Dispatch<React.SetStateAction<any>>;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");

        if (storedToken) {
            setToken(storedToken);

            // Simula busca de informações do usuário com o token
            (async () => {
                try {
                    const response = await axios.get(`${apiUrl}user/login/`, {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    });

                    setUser(response.data);
                } catch (error) {
                    console.error("Erro ao buscar dados do usuário", error);
                    logout();
                }
            })();
        }
    }, []);

    const login = async (email: string, password: string) => {
        console.log("Fazendo Post")
        try {
            const response = await axios.post(`${apiUrl}user/login/`, {
                email,
                password,
            });

            const { data } = response.data;

            // Salva o token e configura o usuário
            const accessToken = data.access;
            setToken(accessToken);
            localStorage.setItem("authToken", accessToken);
            console.log(response.data);
            console.log(accessToken);

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
