import Link from "next/link";
import {
  PlusCircleIcon,
  QrCodeIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/solid";



export default function Home() {
  return (
    <>
      <section className="flex flex-col items-center justify-center text-center py-16 px-6 mt-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary-700">
          Gerencie Seu Inventário com{" "}
          <span className="text-accent">Facilidade</span>
        </h1>
        <p className="text-lg text-gray-700 mb-12 max-w-3xl">
          Bem-vindo ao PPSCANNER, um sistema inovador que permite organizar,
          gerenciar e acessar informações detalhadas sobre o seu inventário.
          Registre produtos, controle movimentações e tenha tudo sob controle.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {/* Adicionar Produtos */}

          <Link href="/add-companies">
            <div className="bg-primary-100 hover:bg-primary-200 shadow-lg hover:shadow-xl p-6 rounded-xl cursor-pointer transition transform hover:-translate-y-2">
              <BuildingOfficeIcon className="h-14 w-14 text-primary-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-primary-800">
                Adicione uma nova empresa
              </h3>
              <p className="text-gray-600">
                Cadastre uma nova empresa para registrar um novo produto!
              </p>
            </div>
          </Link>

          {/* Controle de Produtos */}
          <Link href="/product-control">
            <div className="bg-primary-100 hover:bg-primary-200 shadow-lg hover:shadow-xl p-6 rounded-xl cursor-pointer transition transform hover:-translate-y-2">
              <QrCodeIcon className="h-14 w-14 text-primary-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-primary-800">
                Controle de Produtos
              </h3>
              <p className="text-gray-600">
                Registre e gerencie os produtos que chegam e saem da empresa,
                garantindo um controle detalhado de cada item.
              </p>
            </div>
          </Link>

          {/* Visualizar Inventário */}
          <Link href="/inventory">
            <div className="bg-primary-100 hover:bg-primary-200 shadow-lg hover:shadow-xl p-6 rounded-xl cursor-pointer transition transform hover:-translate-y-2">
              <ClipboardDocumentListIcon className="h-14 w-14 text-primary-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-primary-800">
                Visualize o Inventário
              </h3>
              <p className="text-gray-600">
                Veja informações completas dos itens registrados, tanto os que
                permanecem na empresa quanto os que foram enviados.
              </p>
            </div>
          </Link>


        </div>
      </section>
    </>
  );
}
