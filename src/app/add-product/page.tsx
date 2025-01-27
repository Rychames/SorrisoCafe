"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
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
} from "react-icons/fa"; // Ícones

export default function FormPage() {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        quantity: 0,
        size: "",
        model: "",
        brand: "",
        unitOrBox: false,
        deliveryCompany: "",
        deliveredBy: "",
        receivedBy: "",
        deliveryTime: "",
        images: [],
    });

    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    const router = useRouter();

    const categories = ["Eletrônicos", "Móveis", "Alimentos", "Vestuário", "Outros"];
    const deliveryCompanies = [
        "Mercado Livre",
        "Shein",
        "Shopee",
        "Amazon",
        "Outros",
    ];

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
            setFormData({ ...formData, [name]: e.target.checked });
        } else if (e.target instanceof HTMLInputElement && e.target.type === "file") {
            const files = Array.from(e.target.files || []);
            const newImages = [...images, ...files];

            if (newImages.length > 5) {
                Swal.fire("Erro!", "Você pode enviar no máximo 5 imagens.", "error");
                return;
            }

            setImages(newImages);

            // Atualiza as pré-visualizações
            const previews = newImages.map((file) => URL.createObjectURL(file));
            setPreviewImages(previews);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const setCurrentTime = () => {
        const currentTime = new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
        setFormData({ ...formData, deliveryTime: currentTime });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                const value = formData[key as keyof typeof formData];
                formDataToSend.append(key, value.toString());
            });

            images.forEach((image) => {
                formDataToSend.append("images", image);
            });

            const response = await fetch(
                "https://ppscannerbackend-production.up.railway.app/api/inventory",
                {
                    method: "POST",
                    body: formDataToSend,
                }
            );

            if (!response.ok) throw new Error("Erro ao cadastrar produto.");
            Swal.fire("Sucesso!", "Produto cadastrado com sucesso!", "success");
            router.push("/inventory");
        } catch (error) {
            Swal.fire("Erro!", "Falha ao cadastrar produto.", "error");
        }
    };

    return (
        <div className="p-6 md:p-12 bg-gray-100 min-h-screen relative z-10">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
                <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
                    Cadastrar Produto
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
                                name="brand"
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
                                <option value="P">P</option>
                                <option value="M">M</option>
                                <option value="G">G</option>
                            </select>
                        </div>
                    </div>

                    {/* CheckBox */}
                    <div className="flex items-center space-x-3">
                        <FaCheckSquare className="text-green-500" />
                        <input
                            name="unitOrBox"
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
                                name="deliveredBy"
                                type="text"
                                placeholder="Entregue Por"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaUser className="text-green-500" />
                            <input
                                name="receivedBy"
                                type="text"
                                placeholder="Recebido Por"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaClock className="text-green-500" />
                            <input
                                name="deliveryTime"
                                type="text"
                                placeholder="Horário de Entrega"
                                value={formData.deliveryTime}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                onClick={setCurrentTime}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Hora Atual
                            </button>
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
                                    onChange={handleInputChange}
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
                                            className="w-full h-32 object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Botão */}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 font-bold shadow-md"
                    >
                        Cadastrar Produto
                    </button>
                </form>
            </div>
        </div>
    );
}
