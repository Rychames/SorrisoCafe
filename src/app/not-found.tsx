"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  // Redireciona automaticamente após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => router.push("/login"), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[green] text-white">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl mt-4">Página não encontrada</p>
      <p className="mt-2">Redirecionando em 5 segundos...</p>
      <Link href="/login" className="mt-6 px-6 py-3 bg-white text-[#004022] rounded-lg hover:bg-gray-200 transition-colors">
        Voltar agora
      </Link>
    </div>
  );
}