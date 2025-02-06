export interface SendFormCompany {
    logo?: File | string; 
    name: string;
    cnpj: string;
    address: string;
    industry?: string;
    location?: string;
}

export interface Company {
    id: number;
    logo: string;
    name: string;
    cnpj: string;
    address: string;
    industry?: string;
    location?: string;
    products_count?: number;
    created_at?: string;
    updated_at?: string;
}

// Tipo utilitário para atualizações parciais
export type UpdateCompany = Partial<SendFormCompany> & { id: number };