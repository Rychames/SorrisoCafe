'use client';

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dados simulados para empresas e produtos
interface Product {
  id: number;
  name: string;
  price: number;
  createdAt: string;
}

interface Company {
  id: number;
  name: string;
  products: Product[];
}

export default function DashboardAllCompanies() {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: 1,
      name: 'Company A',
      products: [
        { id: 1, name: 'Produto A1', price: 100, createdAt: '2023-01-01' },
        { id: 2, name: 'Produto A2', price: 200, createdAt: '2023-02-01' },
      ],
    },
    {
      id: 2,
      name: 'Company B',
      products: [
        { id: 3, name: 'Produto B1', price: 150, createdAt: '2023-03-01' },
      ],
    },
    {
      id: 3,
      name: 'Company C',
      products: [
        { id: 4, name: 'Produto C1', price: 250, createdAt: '2023-04-01' },
        { id: 5, name: 'Produto C2', price: 300, createdAt: '2023-05-01' },
        { id: 6, name: 'Produto C3', price: 50, createdAt: '2023-06-01' },
      ],
    },
  ]);

  // Dados simulados
  const totalUsers = 50;
  const totalCompanies = companies.length;
  const totalProducts = companies.reduce((acc, company) => acc + company.products.length, 0);
  const totalProductValue = companies.reduce((acc, company) => {
    const companyTotal = company.products.reduce((sum, prod) => sum + prod.price, 0);
    return acc + companyTotal;
  }, 0);

  // Dados para o gráfico: Número de produtos por empresa
  const chartData = {
    labels: companies.map((company) => company.name),
    datasets: [
      {
        label: 'Número de Produtos',
        data: companies.map((company) => company.products.length),
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  // Último produto cadastrado
  let latestProduct: Product | null = null;
  let latestProductCompany: Company | null = null;
  companies.forEach((company) => {
    company.products.forEach((prod) => {
      if (!latestProduct || new Date(prod.createdAt) > new Date(latestProduct.createdAt)) {
        latestProduct = prod;
        latestProductCompany = company;
      }
    });
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Geral de Empresas</h1>

      {/* Cards de informações */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Empresas</h2>
          <p className="text-3xl">{totalCompanies}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Produtos</h2>
          <p className="text-3xl">{totalProducts}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Usuários</h2>
          <p className="text-3xl">{totalUsers}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Valor Total em Produtos</h2>
          <p className="text-3xl">R$ {totalProductValue}</p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="mb-8 bg-white p-4 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Produtos por Empresa</h2>
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>

      {/* Último Produto Cadastrado */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Último Produto Cadastrado</h2>
        {latestProduct && latestProductCompany ? (
          <ul>
            <li><strong>Produto:</strong> {latestProduct.name}</li>
            <li><strong>Empresa:</strong> {latestProductCompany.name}</li>
            <li><strong>Preço:</strong> R$ {latestProduct.price}</li>
            <li><strong>Data de Cadastro:</strong> {latestProduct.createdAt}</li>
          </ul>
        ) : (
          <p>Nenhum produto cadastrado.</p>
        )}
      </div>
    </div>
  );
}
