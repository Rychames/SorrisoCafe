import { PlusCircleIcon, ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline";

interface ProductInventoryCardProps {
  quantity: number;
  onAddStock: () => void;
  onWithdraw: () => void;
}

export const ProductInventoryCard = ({ 
  quantity, 
  onAddStock, 
  onWithdraw 
}: ProductInventoryCardProps) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-lg font-semibold mb-4">Controle de Estoque</h2>
    <div className="bg-indigo-50 p-4 rounded-lg text-center mb-4">
      <div className="text-3xl font-bold text-indigo-600">{quantity}</div>
      <div className="text-sm text-indigo-500">Unidades disponíveis</div>
    </div>
    <div className="space-y-4">
      <button 
        onClick={onAddStock}
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
      >
        <PlusCircleIcon className="w-5 h-5" />
        Adicionar Estoque
      </button>
      <button 
        onClick={onWithdraw}
        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
      >
        <ArchiveBoxArrowDownIcon className="w-5 h-5" />
        Retirar Unidades
      </button>
    </div>
  </div>
);