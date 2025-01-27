"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react"; // Corrigido para usar QRCodeSVG


export default function ProductDetails() {
  const params = useParams(); // Acessa os parâmetros de URL
  const [product, setProduct] = useState<any>(null);

  // Função para buscar o produto usando o ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!params.id) return; // Verifica se o ID existe
        const response = await fetch(`https://ppscannerbackend-production.up.railway.app/api/inventory/detail/${params.id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar o produto");
        }
        const data = await response.json();
        setProduct(data); // Define os dados do produto
      } catch (error) {
        console.error("Erro ao buscar o produto:", error);
      }
    };

    fetchProduct();
  }, [params.id]);

  // Função para imprimir a página
  const handlePrint = () => {
    window.print(); // Chama a função de impressão do navegador
  };

  // Carregamento de dados
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
            <strong className="text-gray-700">Entregue por:</strong> {product.deliveredBy}
          </p>

          <p className="text-lg">
            <strong className="text-gray-700">Recebido por:</strong> {product.receivedBy}
          </p>

          {/* Renderização do QR Code */}
          <div className="print-only">
            <h1 className="text-xl font-bold">Produto: {product.name}</h1>
            <QRCodeSVG value={`http://192.168.1.142/:3000/product/${product.id}`} size={256} className="mx-auto my-4" />
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
