export interface SendFormUserManagerModel{
    role: 'COMMON' | 'MODERATOR' | 'ADMIN',
    is_active: boolean,
}

export interface SendFormUserModel{
    profile_image: File,
    first_name: string,
    last_name: string,
}

export type UpdateSendFormUserManagerModel = Partial<SendFormUserManagerModel>;
export type UpdateSendFormUserModel = Partial<SendFormUserModel>;

export interface UserModel{
    id?: number,
    profile_image: string,
    email: string,
    first_name: string,
    last_name: string,
    role: 'COMMON' | 'MODERATOR' | 'ADMIN',
    is_active: boolean,
}