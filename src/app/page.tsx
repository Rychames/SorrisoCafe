
import { PlusCircleIcon, QrCodeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';

export default function Home() {
  return (
    <>
      <section className="flex flex-col items-center justify-center text-center py-16 px-6">
        <h1 className="text-4xl font-bold mb-6 text-primary">
          Gerencie Seu Inventário com <span className="text-secondary">Facilidade</span>
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Organize, visualize e acesse as informações dos seus produtos com QR Codes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-secondary shadow-md p-6 rounded-lg">
            <PlusCircleIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Adicione Produtos</h3>
            <p className="text-gray-600">
              Cadastre móveis, materiais de escritório e muito mais em categorias organizadas.
            </p>
          </div>
          <div className="bg-secondary shadow-md p-6 rounded-lg">
            <QrCodeIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Gere QR Codes</h3>
            <p className="text-gray-600">
              Crie e imprima QR Codes para identificar e acessar facilmente seus produtos.
            </p>
          </div>
          <div className="bg-secondary shadow-md p-6 rounded-lg">
            <ClipboardDocumentListIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Visualize o Inventário</h3>
            <p className="text-gray-600">
              Veja informações completas dos itens escaneando o QR Code.
            </p>
          </div>
        </div>

        <button className="mt-8 px-6 py-3 bg-primary text-secondary font-semibold rounded-lg hover:bg-green-500">
          Começar Agora
        </button>
      </section>
    </>
  );
}
