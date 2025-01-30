"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/app/utils/constants";
import { Product } from "@/app/models";

export default function InventoryPage() {
    const { id } = useParams(); // Obtendo companyId da URL
    const companyId = Number(id);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/products/?companyId=${companyId}`);
                setProducts(response.data.data);
            } catch (error) {
                console.error("Erro ao carregar os produtos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (companyId) fetchProducts();
    }, [companyId]);

    if (isLoading) {
        return <div>Carregando produtos...</div>;
    }

    return (
        <div className="p-6 md:p-12 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
                Inventário da Empresa {companyId}
            </h1>

            {products.length === 0 ? (
                <p>Nenhum produto encontrado.</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((product) => (
                        <li key={product.id} className="p-4 bg-white shadow rounded-lg">
                            <h2 className="text-xl font-bold">{product.name}</h2>
                            <p>Quantidade: {product.quantity}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
