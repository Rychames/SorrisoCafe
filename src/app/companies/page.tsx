"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { BASE_URL } from '@/app/utils/constantes';
import { Company } from '@/app/models';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/companies`);
        setCompanies(response.data.data);
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCompanies();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando empresas...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {companies.map((company) => (
        <Link
          key={company.id}
          href={`/companies/${company.id}`}
          className="relative group block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <img
            src={company.logo}
            alt={company.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 className="text-white text-2xl font-bold">{company.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
