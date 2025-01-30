// pages/add-product.tsx
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

// Interfaces de tipo
interface User {
    first_name: string;
    last_name: string;
}

interface Company {
    name: string;
    cnpj: string;
    address: string;
}

interface ProductFormData {
    name: string;
    category: string;
    model: string;
    company_brand: string;
    description: string;
    quantity: number;
    size: string;
    lot: boolean;
    sector: string;
    delivered_by: string;
    received_by: User;
    received_company: Company;
    current_company: Company;
    images: File[];
}

// Props para o componente CompanyFields
interface CompanyFieldsProps {
    prefix: string;
    data: Company;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function FormPPInventory() {
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        category: '',
        model: '',
        company_brand: '',
        description: '',
        quantity: 0,
        size: '',
        lot: false,
        sector: '',
        delivered_by: '',
        received_by: {
            first_name: '',
            last_name: ''
        },
        received_company: {
            name: '',
            cnpj: '',
            address: ''
        },
        current_company: {
            name: '',
            cnpj: '',
            address: ''
        },
        images: []
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof ProductFormData] as Record<string, any>,
                    [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
                }
            }));
        } else {
            const key = name as keyof ProductFormData;
            const newValue = type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : value;

            setFormData(prev => ({
                ...prev,
                [key]: key === 'quantity' ? Number(newValue) : newValue
            }));
        }
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setFormData(prev => ({
            ...prev,
            images: files
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();

            // Anexar imagens
            formData.images.forEach(file => {
                formDataToSend.append('images', file);
            });

            // Anexar campos principais
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('model', formData.model);
            formDataToSend.append('company_brand', formData.company_brand);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('quantity', formData.quantity.toString());
            formDataToSend.append('size', formData.size);
            formDataToSend.append('lot', formData.lot.toString());
            formDataToSend.append('sector', formData.sector);
            formDataToSend.append('delivered_by', formData.delivered_by);

            // Anexar dados aninhados
            formDataToSend.append('received_by.first_name', formData.received_by.first_name);
            formDataToSend.append('received_by.last_name', formData.received_by.last_name);

            // Anexar empresas
            const companies = [
                { prefix: 'received_company', data: formData.received_company },
                { prefix: 'current_company', data: formData.current_company }
            ];

            companies.forEach(({ prefix, data }) => {
                formDataToSend.append(`${prefix}.name`, data.name);
                formDataToSend.append(`${prefix}.cnpj`, data.cnpj);
                formDataToSend.append(`${prefix}.address`, data.address);
            });

            const response = await axios.post(
                'https://ppscanner.pythonanywhere.com/api/products/',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        // Adicione aqui outros headers necessários (ex: authorization)
                    }
                }
            );

            alert('Produto cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            alert('Erro ao cadastrar produto');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Adicionar Novo Produto</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Informações Básicas */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Nome do Produto*</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label>Categoria*</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Selecione</option>
                            {['Eletrônicos', 'Móveis', 'Alimentos', 'Vestuário', 'Outros'].map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Recebido por */}
                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="text-lg font-semibold mb-2">Recebido por</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label>Primeiro Nome</label>
                            <input
                                type="text"
                                name="received_by.first_name"
                                value={formData.received_by.first_name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label>Último Nome</label>
                            <input
                                type="text"
                                name="received_by.last_name"
                                value={formData.received_by.last_name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                </div>

                {/* Empresas */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 p-4 rounded">
                        <h2 className="text-lg font-semibold mb-2">Empresa Destinatária*</h2>
                        <CompanyFields
                            prefix="received_company"
                            data={formData.received_company}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="bg-gray-100 p-4 rounded">
                        <h2 className="text-lg font-semibold mb-2">Empresa Atual*</h2>
                        <CompanyFields
                            prefix="current_company"
                            data={formData.current_company}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Demais Campos */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Modelo*</label>
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label>Marca da Empresa*</label>
                        <input
                            type="text"
                            name="company_brand"
                            value={formData.company_brand}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label>Descrição*</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Quantidade*</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            min="0"
                            required
                        />
                    </div>

                    <div>
                        <label>Tamanho</label>
                        <select
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Selecione</option>
                            {['S', 'M', 'G'].map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="lot"
                        checked={formData.lot}
                        onChange={handleChange}
                        className="h-4 w-4"
                    />
                    <label>Lote</label>
                </div>

                <div>
                    <label>Setor*</label>
                    <input
                        type="text"
                        name="sector"
                        value={formData.sector}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label>Entregue por*</label>
                    <input
                        type="text"
                        name="delivered_by"
                        value={formData.delivered_by}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {/* Upload de Imagens */}
                <div>
                    <label>Imagens</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Cadastrar Produto
                </button>
            </form>
        </div>
    );
}

// Componente CompanyFields
function CompanyFields({ prefix, data, onChange }: CompanyFieldsProps) {
    return (
        <>
            <div className="mb-2">
                <label>Nome*</label>
                <input
                    type="text"
                    name={`${prefix}.name`}
                    value={data.name}
                    onChange={onChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-2">
                <label>CNPJ*</label>
                <input
                    type="text"
                    name={`${prefix}.cnpj`}
                    value={data.cnpj}
                    onChange={onChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <label>Endereço*</label>
                <input
                    type="text"
                    name={`${prefix}.address`}
                    value={data.address}
                    onChange={onChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
        </>
    );
}