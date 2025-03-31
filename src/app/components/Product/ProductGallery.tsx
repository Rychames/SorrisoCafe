import { Product } from "@/app/models";

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery = ({ product }: ProductGalleryProps) => {
  if (!product.images?.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Galeria</h2>
      <div className="grid grid-cols-3 gap-4">
        {product.images.map((img) => (
          <div key={img.id} className="aspect-square relative group">
            <img
              src={img.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg border border-gray-100"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button className="text-white bg-blue-600 px-3 py-1 rounded-md text-sm">
                Ampliar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};