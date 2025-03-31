import { TruckIcon, ChartPieIcon, TrashIcon } from "@heroicons/react/24/outline";

interface ProductActionsProps {
  onShipping: () => void;
  onReport: () => void;
  onDelete: () => void;
}

export const ProductActions = ({ onShipping, onReport, onDelete }: ProductActionsProps) => (
  <div className="max-w-7xl mx-auto mt-6 bg-white rounded-xl shadow-sm p-6">
    <div className="flex flex-wrap gap-4">
      <button
        onClick={onShipping}
        className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
      >
        <TruckIcon className="w-5 h-5" />
        Registrar Envio
      </button>
      <button
        onClick={onReport}
        className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
      >
        <ChartPieIcon className="w-5 h-5" />
        Gerar Relatório
      </button>
      <button
        onClick={onDelete}
        className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
      >
        <TrashIcon className="w-5 h-5" />
        Excluir Produto
      </button>
    </div>
  </div>
);