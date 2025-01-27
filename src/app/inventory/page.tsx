"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

// Definir o tipo para o item do inventário
interface InventoryItem {
  id: number;
  name: string;
  category: string;
  description: string;
  quantity: number;
  qr_code: string;
  images: string[]; // Array de URLs de imagens
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]); // Todos os itens
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]); // Itens filtrados
  const [categoryFilter, setCategoryFilter] = useState(""); // Filtro de categoria
  const [searchTerm, setSearchTerm] = useState(""); // Termo de pesquisa
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const router = useRouter();

  // Carregar itens da API ao montar o componente
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          "https://ppscannerbackend-production.up.railway.app/api/inventory"
        );
        const data = await response.json();
        setItems(data);
        setFilteredItems(data); // Inicialmente, todos os itens são exibidos
      } catch (error) {
        console.error("Erro ao carregar os itens:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Lidar com mudança no filtro de categoria
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setCategoryFilter(category);
    applyFilters(searchTerm, category);
  };

  // Lidar com a pesquisa
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(term, categoryFilter);
  };

  // Aplicar filtros (categoria e pesquisa)
  const applyFilters = (term: string, category: string) => {
    let filtered = items;

    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (term) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  // Lidar com exclusão de item
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `https://ppscannerbackend-production.up.railway.app/api/inventory/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Erro ao excluir o produto.");
      setItems((prev) => prev.filter((item) => item.id !== id));
      setFilteredItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao excluir o produto:", error);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      ) : (
        <div className="flex">
          {/* Sidebar com Filtros */}
          <div className="w-1/4 p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-bold mb-4">Filtros</h2>
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                className="border border-gray-300 p-2 rounded w-full"
                value={categoryFilter}
                onChange={handleFilterChange}
              >
                <option value="">Todas as Categorias</option>
                {[...new Set(items.map((item) => item.category))].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Área de Resultados */}
          <div className="w-3/4 pl-6">
            {/* Barra de Pesquisa */}
            <div className="flex items-center mb-6">
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-l w-full"
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-r">
                <FaSearch />
              </button>
            </div>

            {/* Lista de Itens */}
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <li
                  key={item.id}
                  className="p-4 bg-white shadow rounded-lg relative"
                  onClick={() => router.push(`/product/${item.id}`)}
                >
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  {item.images && item.images.length > 0 ? (
                    <div>
                      <img
                        src={item.images[0]}
                        alt={`${item.name} image`}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      {item.images.length > 1 && (
                        <p>{`Mais ${item.images.length - 1} imagem(s) disponível(s)`}</p>
                      )}
                    </div>
                  ) : (
                    <p>No image available</p>
                  )}
                  <p>Categoria: {item.category || "Sem Categoria"}</p>
                  <p>Descrição: {item.description}</p>
                  <p>Quantidade: {item.quantity}</p>

                  {/* Botões de Ação */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                      onClick={() => router.push(`/product/edit/${item.id}`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
