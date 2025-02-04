"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { FaSearch, FaPlus, FaBoxOpen } from "react-icons/fa";
import { use } from "react";

import { Product } from "@/app/models";
import { BASE_URL } from "@/app/utils/constants";
import ExportButton from "@/app/components/ExportButton"; // ajuste o caminho conforme sua estrutura

interface InventoryPageProps {
    params: Promise<{ id: string }>;
}

const InventoryPage = ({ params }: InventoryPageProps) => {
    const { id } = use(params);
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        category: "",
        status: "all",
    });
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/products/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                console.log("Resposta da API:", response.data);

                const productsArray = Array.isArray(response.data)
                    ? response.data
                    : response.data.data;

                const filteredProducts = productsArray.filter((product: Product) => {
                    return product.current_company?.id === Number(id);
                });

                setProducts(filteredProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [id]);

    // Aplica os filtros (busca, categoria, status)
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory = filters.category
            ? product.category === filters.category
            : true;
        const matchesStatus =
            filters.status === "all"
                ? true
                : filters.status === "in_stock"
                    ? product.quantity > 0
                    : product.quantity === 0;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Mapeia os dados para o formato que será exportado  
    // Aqui, definimos os nomes dos campos exatamente como serão exibidos na planilha
    const exportData = filteredProducts.map((product) => ({
        Nome: product.name,
        Categoria: product.category,
        Modelo: product.model,
        Marca: product.company_brand,
        Descrição: product.description,
        Quantidade: product.quantity,
        Setor: product.sector,
        "Empresa Atual": product.current_company?.name || "",
        "Data de Cadastro": product.date_receipt,
    }));

    const handleQuickView = (productId: number) => {
        router.push(`/product/${productId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Cabeçalho */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex gap-4 items-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Inventário Digital
                            <span className="block text-lg text-emerald-600 dark:text-emerald-400">
                                {products.length} itens registrados
                            </span>
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        {/* Botão Gerar Planilha */}
                        <ExportButton exportData={exportData} />

                        {/* Botão Novo Produto */}
                        <Link
                            href={`/companies/${id}/add-product`}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-all"
                        >
                            <FaPlus />
                            Novo Produto
                        </Link>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar produto..."
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-4 text-gray-400" />
                        </div>

                        <select
                            className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
                            value={filters.category}
                            onChange={(e) =>
                                setFilters({ ...filters, category: e.target.value })
                            }
                        >
                            <option value="">Todas Categorias</option>
                            <option value="Eletrônicos">Eletrônicos</option>
                            <option value="Roupas">Roupas</option>
                            <option value="Alimentos">Alimentos</option>
                        </select>

                        <select
                            className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
                            value={filters.status}
                            onChange={(e) =>
                                setFilters({ ...filters, status: e.target.value })
                            }
                        >
                            <option value="all">Todos Status</option>
                            <option value="in_stock">Em Estoque</option>
                            <option value="out_of_stock">Esgotado</option>
                        </select>
                    </div>
                </div>

                {/* Grid de Produtos */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl">
                        <FaBoxOpen className="mx-auto text-4xl text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            Nenhum produto encontrado
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                                onClick={() => handleQuickView(product.id)}
                            >
                                <div
                                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm ${product.quantity > 0
                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                        }`}
                                >
                                    {product.quantity > 0 ? "Em Estoque" : "Esgotado"}
                                </div>

                                <div className="h-48 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0].image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <FaBoxOpen className="text-3xl" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        {product.category}
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                            {product.quantity} unidades
                                        </span>
                                        <button
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleQuickView(product.id);
                                            }}
                                        >
                                            Detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryPage;
