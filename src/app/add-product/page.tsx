"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import FormOtherCompaniesInventory from "../components/formPageOthers";
import { BASE_URL } from "../utils/constantes";
import { Company } from "@/app/models";

export default function AddProduct() {
    const [inventoryType, setInventoryType] = useState('');
    const [companySelection, setCompanySelection] = useState<Company>();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get(`${BASE_URL}api/companies/`, {
                validateStatus: () => true // Permite tratar manualmente os status
            });

            if (response.status < 200 || response.status >= 300) {
                throw new Error('Network response was not ok');
            }

            setCompanies(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching companies:', error);
            Swal.fire('Erro!', 'Não foi possível carregar as empresas.', 'error');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleInventoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setInventoryType(selectedValue);
        
        const selectedCompany = companies.find(company => 
            company.id === parseInt(selectedValue)
        );

        if (selectedCompany) {
            setCompanySelection(selectedCompany);
        }
    };

    if (isLoading) {
        return <div>Carregando empresas...</div>;
    }

    return (
        <div className="p-6 md:p-12 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen relative z-10">
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden p-8">
                <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
                    Cadastrar Produto
                </h1>

                <div className="mb-8">
                    <label className="block text-gray-700 font-semibold mb-3 text-lg">
                        Tipo de Inventário
                    </label>
                    <select
                        className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 ease-in-out"
                        onChange={handleInventoryChange}
                        value={inventoryType}
                    >
                        <option value="">Selecione o Tipo de Inventário</option>
                        {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="transition-all duration-300 ease-in-out">
                    {inventoryType && companySelection && (
                        <FormOtherCompaniesInventory 
                            company={companySelection} 
                            companies={companies}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}