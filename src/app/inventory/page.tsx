"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Definir o tipo para o item do inventário
interface InventoryItem {
  id: number;
  name: string;
  category: string;
  description: string;
  quantity: number;
  qr_code: string;
}

export default function InventoryPage() {
  // Tipar os estados para armazenar os itens
  const [items, setItems] = useState<InventoryItem[]>([]); // Todos os itens
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]); // Itens filtrados
  const [categoryFilter, setCategoryFilter] = useState(""); // Filtro de categoria
  const router = useRouter();

  // Carregar itens da API ao montar o componente
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("https://ppscannerbackend-production.up.railway.app/api/inventory");
        const data = await response.json();
        console.log("Dados carregados:", data); // Log para verificar os dados
        setItems(data);
        setFilteredItems(data); // Inicialmente, todos os itens são exibidos
      } catch (error) {
        console.error("Erro ao carregar os itens:", error);
      }
    };
    fetchItems();
  }, []);

  // Lidar com mudança no filtro de categoria
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setCategoryFilter(category);

    if (category === "") {
      // Mostrar todos os itens se o filtro estiver vazio
      setFilteredItems(items);
    } else {
      // Filtrar itens pela categoria selecionada
      setFilteredItems(
        items.filter((item) => item.category && item.category === category)
      );
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Inventário</h1>

      {/* Filtro por categoria */}
      <div className="mb-4">
        <select
          className="border border-gray-300 p-2 rounded"
          value={categoryFilter}
          onChange={handleFilterChange}
        >
          <option value="">Todas as Categorias</option>
          {/* Gerar opções de categoria dinamicamente */}
          {[...new Set(items.map((item) => item.category))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de itens */}
      <ul className="space-y-4">
        {filteredItems.map((item) => (
          <li
            key={item.id}
            className="p-4 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => router.push(`/product/${item.id}`)}
          >
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p>Categoria: {item.category || "Sem Categoria"}</p>
            <p>Descrição: {item.description}</p>
            <p>Quantidade: {item.quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
