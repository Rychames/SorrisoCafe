"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { BASE_URL } from '@/app/utils/constants';
import { Company } from '@/app/models';

export default function CompanyPage() {
  const params = useParams();
  const { companyId, productId } = params as { companyId: string; productId: string };  
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/companies/${companyId}`);
        
        const companyData = {
          id: response.data.data.id,
          name: response.data.data.name,
          logo: response.data.data.logo || '',
          cnpj: response.data.data.cnpj,
          address: response.data.data.address
        };
        
        setCompany(companyData);
        setError(null);
      } catch (error) {
        console.error("Erro ao carregar empresa:", error);
        setError('Não foi possível carregar os dados da empresa');
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [companyId]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando dados da empresa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 text-red-700 rounded-lg">
        <p className="font-medium">❌ Erro: {error}</p>
        <p className="mt-2 text-sm">Verifique o ID da empresa ou tente novamente mais tarde.</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Nenhuma empresa encontrada com este ID</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        {company.logo && (
          <img 
            src={company.logo} 
            alt={`Logo da ${company.name}`}
            className="w-32 h-32 object-contain mx-auto mb-4"
          />
        )}
        <h1 className="text-2xl font-bold text-center mb-2">
          Bem-vindo à {company.name}
        </h1>
        <p className="text-center text-gray-500 text-sm">ID: {company.id}</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-500 mb-1">CNPJ</label>
          <p className="font-mono text-gray-700">{company.cnpj}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-500 mb-1">Endereço</label>
          <p className="text-gray-700">{company.address}</p>
        </div>
      </div>
    </div>
  );
}
