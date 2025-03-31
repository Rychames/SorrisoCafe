import { Product } from "@/app/models";

interface ProductHeaderProps {
  product: Product;
}

export const ProductHeader = ({ product }: ProductHeaderProps) => (
  <div className="max-w-7xl mx-auto mb-6">
    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
    <p className="text-gray-500 mt-2">{product.category}</p>
  </div>
);