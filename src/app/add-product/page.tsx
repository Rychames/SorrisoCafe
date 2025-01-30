"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import FormPPInventory from "../components/formPagePP";
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
            const response = await fetch(`${BASE_URL}api/companies/`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCompanies(data['data']);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching companies:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleInventoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setInventoryType(e.target.value);
        const selectedCompany = companies.find(company => company.id === parseInt(e.target.value));
    
        if (selectedCompany) {
            setCompanySelection(selectedCompany);
        }
        console.log(`Empresa selecionada ${e.target.value}`)
    };

    if (isLoading) {
        return <div>Loading companies...</div>;
    }

    return (
        <div className="p-6 md:p-12 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen relative z-10">
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden p-8">
                <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
                    Cadastrar Produto
                </h1>

                {/* Seletor de Tipo de Inventário */}
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

                {/* Renderização do Formulário */}
                <div className="transition-all duration-300 ease-in-out">
                    {inventoryType && <FormOtherCompaniesInventory company={companySelection} companies={companies}/>}
                </div>
            </div>
        </div>
    );
}