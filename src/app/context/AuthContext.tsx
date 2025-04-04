'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { BASE_URL } from '@/app/utils/constants';
import { UserModel, handleError, isAdmin, isApiError, isCommon, isModerator } from '@/app/models/user.model';

type AuthContextType = {
  user: UserModel | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isModerator: boolean;
  isCommon: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserModel | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);
const publicRoutes = ['/login', '/signup', '/VerifyCodePage', '/not-found'];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  axios.defaults.baseURL = BASE_URL;

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    router.push('/login');
  }, [router]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post('user/login/', { email, password });
      const { data } = response.data;
      const accessToken = data.access;

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setToken(accessToken);
      localStorage.setItem('authToken', accessToken);

      const userResponse = await axios.get('user/profile/');
      setUser(userResponse.data.data);
      router.push('/');
    } catch (error) {
      const handledError = handleError(error);
      throw new Error(handledError.message);
    }
  }, [router]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        const userResponse = await axios.get('user/profile/');
        setUser(userResponse.data.data);
        setToken(storedToken);
      } catch (error) {
        if (isApiError(error) && error.status === 401) {
          logout();
        }
        console.error('Erro na verificação do token:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [logout]);

  useEffect(() => {
    if (loading || !pathname) return;

    const isPublicPath = publicRoutes.includes(pathname);
    if (!user && !isPublicPath) {
      router.push('/login');
    }
    if (user && isPublicPath) {
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  const contextValue = {
    user,
    token,
    login,
    logout,
    isAdmin: isAdmin(user),
    isModerator: isModerator(user),
    isCommon: isCommon(user),
    setUser,
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};