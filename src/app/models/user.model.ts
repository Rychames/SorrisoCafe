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
    role: UserRole,
    is_active: boolean,
}

export type UserRole = 'COMMON' | 'MODERATOR' | 'ADMIN';

export function isAdmin(user: UserModel | null): boolean {
    if (user?.role === 'ADMIN'){
        return true
    }
    return false
}

export function isModerator(user: UserModel | null): boolean {
    if (user?.role === 'MODERATOR'){
        return true
    }
    else if (user?.role === 'ADMIN'){
        return true
    }
    return false
}

export function isCommon(user: UserModel | null): boolean {
    if (user?.role === 'COMMON'){
        return true
    }
    return false
}


