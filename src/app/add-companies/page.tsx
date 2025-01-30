"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "@/app/utils/";

export default function AddCompanyPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        cnpj: "",
        address: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Validação básica
        if (!formData.name || !formData.cnpj || !formData.address) {
            setError("Todos os campos são obrigatórios");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}api/companies/`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.status === 201) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Empresa cadastrada com sucesso',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    router.push("/"); // Ajuste a rota conforme sua aplicação
                });
            }
        } catch (error: any) {
            console.error("Erro ao cadastrar empresa:", error);
            setError(error.response?.data?.message || "Erro ao cadastrar empresa");
            Swal.fire('Erro!', error.response?.data?.message || 'Falha no cadastro', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Cadastrar Nova Empresa
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome da Empresa *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            minLength={1}
                            maxLength={255}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CNPJ *
                        </label>
                        <input
                            type="text"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleInputChange}
                            required
                            minLength={1}
                            maxLength={40}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Endereço Completo *
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            minLength={1}
                            maxLength={300}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isLoading ? 'Cadastrando...' : 'Cadastrar Empresa'}
                    </button>
                </form>
            </div>
        </div>
    );
}