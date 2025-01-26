import './globals.css';
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: 'PPSCANNER',
  description: 'Sistema de inventário com QR Code',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <Header />
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
