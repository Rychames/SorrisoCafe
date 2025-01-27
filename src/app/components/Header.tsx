'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, PlusCircle, Search, LogIn, User, LogOut } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext'; // Importe o contexto de autenticação

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Use o contexto de autenticação para obter o token e o usuário
  const { user, token, logout } = useAuth();

  useEffect(() => {
    // O token será gerido no AuthContext, então podemos remover a lógica aqui
  }, [token]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout(); // Chama a função logout do contexto para remover o token e deslogar
  };

  return (
    <header className="bg-[#004022] text-white shadow-md top-0 w-full z-50 print:hidden">
      <nav className="bg-[#004022]">
        <div className="max-w-screen-xl flex flex-col lg:flex-row items-center justify-between mx-auto p-4">
          <div className="flex items-center space-x-8 mb-4 lg:mb-0">
            <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="/ppscanner.svg" className="h-[4rem] w-auto" alt="Logo" />
            </a>
            <button
              onClick={toggleMenu}
              type="button"
              className="md:hidden inline-flex items-center p-2 w-10 h-10 justify-center text-white rounded-lg hover:bg-[#4b6b65] focus:outline-none focus:ring-2 focus:ring-[#4b6b65]"
              aria-controls="navbar-default"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          <div
            className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:flex md:items-center md:w-auto`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:flex-row md:space-x-8 w-full md:w-auto border border-gray-100 rounded-lg bg-[#004022] md:mt-0 md:border-0 md:bg-transparent">
              <li className="flex-1 md:flex-none">
                <Link href="/" className="group flex items-center justify-center py-3 px-4 text-white hover:text-gray-300 relative">
                  Home
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004022] to-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
              </li>
              <li className="flex-1 md:flex-none">
                <Link href="/add-product" className="group flex items-center justify-center py-3 px-4 text-white hover:text-gray-300 relative">
                  Novo Produto
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004022] to-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
              </li>
              <li className="flex-1 md:flex-none">
                <Link href="/inventory" className="group flex items-center justify-center py-3 px-4 text-white hover:text-gray-300 relative">
                  Consultar Produtos
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004022] to-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
              </li>
              {token ? (
                <li className="flex-1 md:flex-none relative">
                  {/* Ícone de usuário com dropdown */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center py-3 px-4 text-white hover:text-gray-300"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Perfil
                  </button>
                  {isDropdownOpen && (
                    <ul className="absolute bg-white text-black rounded-md shadow-lg right-0 mt-2 py-2 w-40">
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm hover:bg-gray-200"
                        >
                          <LogOut className="w-4 h-4 inline mr-2" />
                          Sair
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              ) : (
                <li className="flex-1 md:flex-none">
                  {/* Botão de Login */}
                  <Link href="/login" className="group flex items-center justify-center py-3 px-4 text-white bg-[#004022] rounded-lg hover:bg-[#3f5c57] relative">
                    <LogIn className="mr-2 w-5 h-5 group-hover:text-gray-300" />
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
