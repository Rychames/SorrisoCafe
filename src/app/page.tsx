import Link from "next/link";
import {
  PlusCircleIcon,
  QrCodeIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-700 to-accent-500 bg-clip-text text-transparent">
            Revolucione seu Controle Patrimonial
          </h1>
          <p className="text-xl text-gray-700 mb-12 leading-relaxed">
            O Sorriso Café é a plataforma definitiva para gestão inteligente de patrimônio.
            Combine tecnologia de ponta, relatórios detalhados e controle total em tempo real
            para transformar a maneira como você gerencia seus ativos.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/add-companies"
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <BuildingOfficeIcon className="h-5 w-5" />
              Cadastrar Empresa
            </Link>
          </div>
        </div>
      </section>

      {/* Funcionalidades Destaque */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-primary-900">
            Tudo o que você precisa em uma plataforma
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<BuildingOfficeIcon className="h-12 w-12 text-primary-700" />}
              title="Gestão Multiempresas"
              description="Controle várias empresas de forma unificada com acesso hierárquico e permissões customizadas"
              link="/companies"
              linkText="Gerenciar Empresas"
            />

            <FeatureCard
              icon={<QrCodeIcon className="h-12 w-12 text-primary-700" />}
              title="Rastreamento Inteligente"
              description="Sistema de etiquetagem com QR Code e código de barras para identificação instantânea"
              link="/add-companies"
              linkText="Iniciar Cadastro"
            />

            <FeatureCard
              icon={<ChartBarIcon className="h-12 w-12 text-primary-700" />}
              title="Analíticos Avançados"
              description="Relatórios customizáveis, gráficos interativos e dashboards em tempo real"
              link="/companies"
              linkText="Ver Estatísticas"
            />
          </div>
        </div>
      </section>

      {/* Fluxo de Trabalho */}
      <section className="py-16 px-6 bg-primary-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-primary-900">
            Como transformar sua gestão em 4 passos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard
              step="1"
              title="Cadastre sua Empresa"
              description="Crie o perfil completo da sua organização"
              icon={<BuildingOfficeIcon className="h-8 w-8 text-primary-700" />}
            />
            <StepCard
              step="2"
              title="Adicione Ativos"
              description="Registre todos os itens do patrimônio"
              icon={<PlusCircleIcon className="h-8 w-8 text-primary-700" />}
            />
            <StepCard
              step="3"
              title="Monitore Movimentações"
              description="Acompanhe entradas, saídas e transferências"
              icon={<ClipboardDocumentListIcon className="h-8 w-8 text-primary-700" />}
            />
            <StepCard
              step="4"
              title="Analise e Otimize"
              description="Acesse insights para melhor gestão"
              icon={<ChartBarIcon className="h-8 w-8 text-primary-700" />}
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-primary-900">
            Pronto para revolucionar sua gestão?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Comece agora mesmo e experimente grátis por 14 dias
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/signup"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-all hover:scale-105"
            >
              Criar Conta Gratuita
            </Link>
            <Link
              href="/login"
              className="border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-lg font-semibold transition-all"
            >
              Acessar Plataforma
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Componente de Card de Funcionalidade
const FeatureCard = ({ icon, title, description, link, linkText }: any) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
    <div className="text-primary-700 mb-6 flex justify-center">{icon}</div>
    <h3 className="text-2xl font-bold mb-4 text-primary-900">{title}</h3>
    <p className="text-gray-600 mb-6">{description}</p>
    <Link
      href={link}
      className="text-accent-500 hover:text-accent-600 font-semibold flex items-center gap-2 justify-center"
    >
      {linkText} <ArrowRightIcon className="h-4 w-4" />
    </Link>
  </div>
);

// Componente de Passo do Fluxo
const StepCard = ({ step, title, description, icon }: any) => (
  <div className="text-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-2">
    <div className="flex items-center justify-center w-12 h-12 bg-accent-500 text-white rounded-full mx-auto mb-4">
      {step}
    </div>
    <div className="text-primary-700 mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-primary-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);