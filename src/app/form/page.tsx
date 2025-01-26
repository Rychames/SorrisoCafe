"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function FormPage() {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        quantity: 0,
    });
    const router = useRouter();

    const categories = ["Eletrônicos", "Móveis", "Alimentos", "Vestuário", "Outros"];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("https://ppscannerbackend-production.up.railway.app//api/inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error("Erro ao cadastrar produto.");
            Swal.fire("Sucesso!", "Produto cadastrado com sucesso!", "success");
            router.push("/inventory");
        } catch (error) {
            Swal.fire("Erro!", "Falha ao cadastrar produto.", "error");
        }
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Cadastrar Produto</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="name"
                    type="text"
                    placeholder="Nome do Produto"
                    className="w-full border border-gray-300 p-2 rounded"
                    onChange={handleInputChange}
                    required
                />
                <select
                    name="category"
                    className="w-full border border-gray-300 p-2 rounded"
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Selecione uma Categoria</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <textarea
                    name="description"
                    placeholder="Descrição"
                    className="w-full border border-gray-300 p-2 rounded"
                    onChange={handleInputChange}
                    required
                />
                <input
                    name="quantity"
                    type="number"
                    placeholder="Quantidade"
                    className="w-full border border-gray-300 p-2 rounded"
                    onChange={handleInputChange}
                    required
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Cadastrar
                </button>
            </form>
        </div>
    );
}
