export interface SendFormCompany {
    logo?: File | string;  // Permite ambos os tipos para upload e atualização
    name: string;
    cnpj: string;
    address: string;
    // Campos opcionais para expansão futura
    industry?: string;
    employees?: number;
    location?: string;
}

export interface Company {
    id: number;
    logo: string;
    name: string;
    cnpj: string;
    address: string;
    // Campos opcionais que podem ser adicionados posteriormente
    industry?: string;
    employees?: number;
    location?: string;
    products_count?: number;
    created_at?: string;
    updated_at?: string;
}

// Tipo utilitário para atualizações parciais
export type UpdateCompany = Partial<SendFormCompany> & { id: number };