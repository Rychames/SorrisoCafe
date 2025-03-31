import { Product } from "@/app/models";

interface ProductInfoCardProps {
  product: Product;
  company?: Product["current_company"] | null; // Aceita undefined ou null
}

export const ProductInfoCard = ({ product, company }: ProductInfoCardProps) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-lg font-semibold mb-4">Especificações</h2>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="space-y-2">
        <div className="flex justify-between border-b pb-1">
          <span className="text-gray-500">Modelo</span>
          <span className="text-gray-900">{product.model}</span>
        </div>
        <div className="flex justify-between border-b pb-1">
          <span className="text-gray-500">Marca</span>
          <span className="text-gray-900">{product.company_brand}</span>
        </div>
        <div className="flex justify-between border-b pb-1">
          <span className="text-gray-500">Entregue por</span>
          <span className="text-gray-900">{product.delivered_by}</span>
        </div>
      </div>
      <div className="space-y-2">
        {company && (
          <div className="flex justify-between border-b pb-1">
            <span className="text-gray-500">Empresa Atual</span>
            <span className="text-gray-900">{company.name}</span>
          </div>
        )}
        {product.received_by && (
          <div className="flex justify-between border-b pb-1">
            <span className="text-gray-500">Recebido por</span>
            <span className="text-gray-900">{product.received_by.email}</span>
          </div>
        )}
        <div className="flex justify-between border-b pb-1">
          <span className="text-gray-500">Última Atualização</span>
          <span className="text-gray-900">28/03/2024</span>
        </div>
      </div>
    </div>
  </div>
);