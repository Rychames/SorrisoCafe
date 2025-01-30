export interface SendFormCompany{
    logo: File,
    name: string,
    cnpj: string,
    address: string,
}

export interface Company{
    id: number,
    logo: string,
    name: string,
    cnpj: string,
    address: string,
}