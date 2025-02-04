"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import { Product, Company } from "@/app/models";
import PDFGenerator from "@/app/components/PDFGenerator";
import { useFilter } from "@/app/context/FilterContext";

export default function ProductDetails() {
  const params = useParams();
  const { companyId, productId } = params as { companyId: string; productId: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const { filters } = useFilter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) return;
        const response = await axios.get(`/api/products/${productId}/`);
        const productData = response.data["data"];
        setProduct(productData);
        setCompany(productData.current_company);
      } catch (error) {
        console.error("Erro ao buscar o produto:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handlePrint = () => {
    window.print();
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
        {filters.onlyQRCode ? (
          <>
            <h1 className="text-xl font-bold text-center text-gray-800 mb-4">
              {product.name}
            </h1>
            <QRCodeSVG
              value={`https://ppscanner.vercel.app/companies/${companyId}/product/${product.id}`}
              size={256}
              className="mx-auto my-4"
            />
            <p className="text-sm text-center">
              Escaneie o código para acessar a página do produto.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-center text-gray-800 mb-4">
              Detalhes do Produto
            </h1>
            <div className="space-y-4">
              {filters.showProductDetails && (
                <>
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
                </>
              )}
              {filters.showUserInfo && product.received_by && (
                <p className="text-lg">
                  <strong className="text-gray-700">Recebido por:</strong> {product.received_by.email}
                </p>
              )}
              {filters.showCompanyInfo && company && (
                <p className="text-lg">
                  <strong className="text-gray-700">Empresa:</strong> {company.name}
                </p>
              )}
            </div>
            <div className="flex justify-center mt-4">
              <QRCodeSVG
                value={`https://ppscanner.vercel.app/companies/${companyId}/product/${product.id}`}
                size={128}
                className="mx-auto my-4"
              />
            </div>
          </>
        )}

        <div className="flex justify-end mt-6 gap-2 hidden-print">
          {company && <PDFGenerator product={product} company={company} />}
          <button
            onClick={handlePrint}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow-md"
          >
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
