"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react"; // Corrigido para usar QRCodeSVG
import { BASE_URL } from "@/app/utils/constants";
import { Product } from "@/app/models";
import axios from "axios";

export default function ProductDetails() {
  const params = useParams(); 
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!params.id) return;
        const response = await axios.get(`api/products/${params.id}/`);

        setProduct(response.data['data'])
      } catch (error) {
          console.error("Erro ao buscar o produto:", error);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handlePrint = () => {
    window.print(); 
  };

  if (!product) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">Carregando...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
        {/* Cabeçalho da página */}
        <h1 className="text-xl font-bold text-center text-gray-800 mb-4">Detalhes do Produto</h1>
        <div className="space-y-4">
          {/* Informações do produto */}
          <p className="text-lg">
            <strong className="text-gray-700">Nome:</strong> {product.name}
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">Categoria:</strong> {product.category}
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">Descrição:</strong> {product.description}
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">Quantidade:</strong> {product.quantity}
          </p>

          <p className="text-lg">
            <strong className="text-gray-700">Entregue por:</strong> {product.delivered_by}
          </p>

          <p className="text-lg">
            <strong className="text-gray-700">Recebido por:</strong> {product.received_by.email}
          </p>

          {/* Renderização do QR Code */}
          <div className="print-only">
            <h1 className="text-xl font-bold">Produto: {product.name}</h1>
            <QRCodeSVG value={`https://ppscanner.vercel.app/product/${product.id}`} size={256} className="mx-auto my-4" />
            <p className="text-sm">Escaneie o código para acessar a página do produto.</p>
          </div>
        </div>

        {/* Botão de impressão */}
        <div className="flex justify-end mt-6 hidden-print">
          <button
            onClick={handlePrint}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}