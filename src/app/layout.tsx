
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "@/app/context/AuthContext";

export const metadata = {
  title: "PPSCANNER",
  description: "Sistema de inventário com QR Code",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <AuthProvider>
        <body>
          <Header />
          <link rel="icon" type="image/png" href="/ppicon.svg" sizes="32x32" />
          <main className="min-h-screen flex flex-col">{children}</main>
          <Footer />
        </body>
      </AuthProvider>
    </html>
  );
}
