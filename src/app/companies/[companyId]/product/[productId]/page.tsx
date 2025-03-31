"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useFilter } from "@/app/context/FilterContext";
import { Product } from "@/app/models";
import { 
  ProductHeader,
  ProductGallery,
  ProductInfoCard,
  ProductQRCard,
  ProductInventoryCard,
  ProductActions,
  ProductAlerts,
  showSuccessAlert,
  showErrorAlert
} from "@/app/components/Product";
import Swal from "sweetalert2";

export default function ProductDetails() {
  const params = useParams();
  const { companyId, productId } = params as { companyId: string; productId: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [company, setCompany] = useState<Product["current_company"] | null>(null);
  const [history, setHistory] = useState<{ type: string; date: string; details: any }[]>([]);
  const { filters } = useFilter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) return;
        const response = await axios.get(
          `https://ppscanner.pythonanywhere.com/api/products/${productId}/`
        );
        const productData: Product = response.data.data;
        setProduct(productData);
        setCompany(productData.current_company || null);
        setHistory([
          { type: "entrada", date: "2025-03-28", details: { quantity: 10, by: "Cindy" } },
          { type: "saída", date: "2025-03-29", details: { quantity: 3, by: "Brasil" } },
        ]);
      } catch (error) {
        console.error("Erro ao buscar o produto:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleWithdrawal = async () => {
    if (!product) return;

    const result = await ProductAlerts.withdraw(product.quantity);

    if (result.isConfirmed) {
      const { quantity } = result.value;
      try {
        await axios.patch(`https://ppscanner.pythonanywhere.com/api/products/${productId}/`, {
          quantity: product.quantity - quantity,
        });
        setProduct({ ...product, quantity: product.quantity - quantity });
        setHistory([...history, { type: "saída", date: new Date().toISOString().split("T")[0], details: result.value }]);
        showSuccessAlert("Sucesso!", `Retirada de ${quantity} unidade(s) registrada.`);
      } catch (error) {
        showErrorAlert("Erro!", "Falha ao registrar a retirada.");
      }
    }
  };

  const handleShipping = async () => {
    const result = await ProductAlerts.shipping();

    if (result.isConfirmed) {
      setHistory([...history, { type: "envio", date: new Date().toISOString().split("T")[0], details: result.value }]);
      Swal.fire("Sucesso!", "Envio registrado com sucesso.", "success");
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    const result = await ProductAlerts.delete(product.name);

    if (result.isConfirmed) {
      try {
        // Lógica de exclusão aqui
        Swal.fire("Excluído!", "O produto foi excluído com sucesso.", "success");
      } catch (error) {
        Swal.fire("Erro!", "Falha ao excluir o produto.", "error");
      }
    }
  };

  const handleAddMore = async () => {
    const result = await ProductAlerts.addStock();

    if (result.isConfirmed && product) {
      const quantity = Number(result.value);
      setProduct({ ...product, quantity: product.quantity + quantity });
      setHistory([...history, { type: "entrada", date: new Date().toISOString().split("T")[0], details: { quantity } }]);
      Swal.fire("Sucesso!", `${quantity} unidade(s) adicionada(s).`, "success");
    }
  };

  if (!product) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 print-area">
      <ProductHeader product={product} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProductGallery product={product} />
          <ProductInfoCard product={product} company={company} />
        </div>

        <div className="space-y-6">
          <ProductQRCard
            companyId={companyId}
            productId={productId}
            productName={product.name}
          />
          <ProductInventoryCard
            quantity={product.quantity}
            onAddStock={handleAddMore}
            onWithdraw={handleWithdrawal}
          />
        </div>
      </div>

      {!filters.onlyQRCode && (
        <ProductActions
          onShipping={handleShipping}
          onReport={() => showSuccessAlert("Relatório", "Funcionalidade em desenvolvimento!")}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}