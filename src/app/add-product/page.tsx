"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import FormPPInventory from "../components/formPagePP";
import FormOtherCompaniesInventory from "../components/formPageOthers";

export default function AddProduct() {
    const [inventoryType, setInventoryType] = useState("");

    const handleInventoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setInventoryType(e.target.value);
    };

    return (
        <div className="p-6 md:p-12 bg-gray-100 min-h-screen relative z-10">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
                <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
                    Cadastrar Produto
                </h1>
                
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2">Tipo de Inventário</label>
                    <select
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                        onChange={handleInventoryChange}
                        value={inventoryType}
                    >
                        <option value="">Selecione o Tipo de Inventário</option>
                        <option value="pp">Inventário da PP</option>
                        <option value="outras">Inventário outras empresas</option>
                    </select>
                </div>

                {inventoryType === "pp" && <FormPPInventory />}
                {inventoryType === "outras" && <FormOtherCompaniesInventory />}
            </div>
        </div>
    );
}
