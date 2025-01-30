"use client"

import { ReactNode } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CompanyLayout({ children }: { children: ReactNode }) {
    const { id } = useParams();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-64 bg-white border-r border-gray-200 p-6">
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <Link
                                href={`/companies/${id}/add-product`}
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                ➕ Novo Produto
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`/companies/${id}/inventory`}
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                📦 Ver Inventário
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}