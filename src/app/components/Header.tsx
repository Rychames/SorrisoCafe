'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-[#5a7f78] text-white shadow-md fixed top-0 w-full z-50 print:hidden">
      <nav className="bg-[#5a7f78]">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="https://flowbite.com/docs/images/logo.svg" // Substitua por uma logo transparente
              className="h-8"
              alt="Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              Flowbite
            </span>
          </a>

          {/* Botão do menu hamburguer */}
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-[#4b6b65] focus:outline-none focus:ring-2 focus:ring-[#4b6b65]"
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <Bars3Icon className="w-5 h-5" />
            )}
          </button>

          {/* Menu */}
          <div
            className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:flex md:items-center md:w-auto`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-[#5a7f78] md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-[#5a7f78]">
              <li>
                <Link
                  href="/"
                  className="block py-2 px-3 text-white hover:text-gray-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/form"
                  className="block py-2 px-3 text-white hover:text-gray-300"
                >
                  Novo Produto
                </Link>
              </li>
              <li>
                <Link
                  href="/inventory"
                  className="block py-2 px-3 text-white hover:text-gray-300"
                >
                  Consultar Produtos
                </Link>
              </li>
              <li>
                {/* Botão de Login */}
                <Link
                  href="/login"
                  className="block py-2 px-4 text-white bg-[#4b6b65] rounded-lg hover:bg-[#3f5c57]"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
