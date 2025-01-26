"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch("http://26.102.188.40:5000/api/inventory");
      const data = await response.json();
      setItems(data);
      setFilteredItems(data);
    };
    fetchItems();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setCategoryFilter(category);
    if (category === "") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.category === category));
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Inventário</h1>
      <div className="mb-4">
        <select
          className="border border-gray-300 p-2 rounded"
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
      <ul className="space-y-4">
        {filteredItems.map((item) => (
          <li
            key={item.id}
            className="p-4 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => router.push(`/product/${item.id}`)}
          >
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p>Categoria: {item.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
