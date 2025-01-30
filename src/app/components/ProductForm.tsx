// app/components/ProductForm.tsx
"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    FaUser,
    FaTag,
    FaClipboard,
    FaBox,
    FaCheckSquare,
    FaClock,
    FaPen,
    FaWeight,
    FaImage,
    FaPlus,
} from "react-icons/fa";
import { Company, SendFormProduct } from "@/app/models";
import { BASE_URL } from "../utils/constantes";

interface ProductFormProps {
    company: Company; // A empresa passada deve ser recebida aqui
}

const ProductForm = ({ company }: ProductFormProps) => {
    const [formData, setFormData] = useState<SendFormProduct>({
        name: '',
        category: '',
        model: '',
        company_brand: '',
        description: '',
        quantity: 0,
        size: '',
        lot: false,
        sector: '',
        delivered_by: '',
        delivery_man_signature: null,
        received_company: company.id, // Garantir que o id da empresa está correto
        current_company: company.id,  // Garantir que o id da empresa está correto
        images: null,
    });

    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const router = useRouter();

    const categories = ["Eletrônicos", "Roupas", "Alimentos"]; // Exemplo de categorias

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                        ? 1
                        : 0
                    : value,
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        setImages(files);

        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, String(value));
        });

        images.forEach((image) => {
            form.append("images", image); // "images" será a chave usada no backend
        });

        form.append("delivery_man_signature", images[0]);

        try {
            const response = await axios.post(
                `${BASE_URL}api/products/`,
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                }
            );

            if (response.data['success'] === true) {
                Swal.fire("Sucesso", "Produto cadastrado com sucesso!", "success");
                router.push("/inventory");  // Redirecionando para a página de inventário após sucesso
            }
        } catch (error) {
            console.error("Erro ao enviar o formulário:", error);
            Swal.fire("Erro", "Falha ao cadastrar o produto.", "error");
        }
    };

    return (
        <div className="p-6 md:p-12 bg-gray-100 min-h-screen relative z-10">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
                <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
                    {company.name} - Inventário
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nome e Categoria */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <FaUser className="text-green-500" />
                            <input
                                name="name"
                                type="text"
                                placeholder="Nome do Produto"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaTag className="text-green-500" />
                            <select
                                name="category"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
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
                        </div>
                    </div>

                    {/* Modelo e Marca */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <FaClipboard className="text-green-500" />
                            <input
                                name="model"
                                type="text"
                                placeholder="Modelo do Produto"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaBox className="text-green-500" />
                            <input
                                name="company_brand"
                                type="text"
                                placeholder="Marca"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <FaPen className="text-green-500" />
                            <textarea
                                name="description"
                                placeholder="Descrição do Produto"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Quantidade e Tamanho */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <FaWeight className="text-green-500" />
                            <input
                                name="quantity"
                                type="number"
                                placeholder="Quantidade"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaTag className="text-green-500" />
                            <select
                                name="size"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione o Tamanho</option>
                                <option value="S">P</option>
                                <option value="M">M</option>
                                <option value="G">G</option>
                            </select>
                        </div>
                    </div>

                    {/* CheckBox */}
                    <div className="flex items-center space-x-3">
                        <FaCheckSquare className="text-green-500" />
                        <input
                            name="lot"
                            type="checkbox"
                            id="unitOrBox"
                            className="h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-green-300"
                            onChange={handleInputChange}
                        />
                        <label htmlFor="unitOrBox" className="text-gray-700">
                            Por Caixa (desmarcar para Unidade)
                        </label>
                    </div>

                    {/* Entrega */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <FaUser className="text-green-500" />
                            <input
                                name="delivered_by"
                                type="text"
                                placeholder="Entregue Por"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Upload de Imagens */}
                    <div className="space-y-4">
                        <label className="text-gray-700 font-bold mb-2 flex items-center space-x-2">
                            <FaImage className="text-green-500" />
                            <span>Imagens do Produto</span>
                        </label>
                        <div className="border border-gray-300 p-4 rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between">
                                <p className="text-gray-500 text-sm">
                                    Você pode enviar até 5 imagens.
                                </p>
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                                >
                                    <FaPlus className="text-white" />
                                    <span>Adicionar Imagem</span>
                                </label>
                                <input
                                    type="file"
                                    name="images"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    id="image-upload"
                                    onChange={handleImageUpload}
                                />
                            </div>
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                                {previewImages.map((src, index) => (
                                    <div
                                        key={index}
                                        className="relative rounded-lg overflow-hidden shadow-lg"
                                    >
                                        <img
                                            src={src}
                                            alt={`Prévia ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
                    >
                        Cadastrar Produto
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
