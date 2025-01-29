"use client"; // Marca este componente como um Client Component

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#004022] text-white">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl mt-4">Página não encontrada</p>
      <p className="mt-2">A página que você está tentando acessar não existe.</p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-white text-[#004022] rounded-lg hover:bg-gray-200 transition-colors"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
}