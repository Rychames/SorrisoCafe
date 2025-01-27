"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/app/utils/constantes"; // Importando a URL base

export default function VerifyCodePage() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await axios.post(
                `${apiUrl}user/register/verify-code/`, // Concatena a URL base com o endpoint
                {
                    email,
                    code,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                setSuccess("Email foi verificado com sucesso!");
                setTimeout(() => {
                    router.push("/login"); // Redireciona para a página de login
                }, 2000);
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Erro ao verificar o código. Tente novamente."
            );
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:border-gray-700">
                <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    Verificar Código
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="code"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Código
                        </label>
                        <input
                            type="text"
                            id="code"
                            className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Insira o código"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="text-sm text-green-500">
                            {success}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white rounded-lg p-2.5 hover:bg-green-600"
                    >
                        Verificar Código
                    </button>
                </form>
            </div>
        </section>
    );
}
