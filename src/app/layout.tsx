import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { AuthProvider } from "@/app/context/AuthContext";
import SidebarWithNavbar from "./components/SidebarWithNavbar";
import { FilterProvider } from "./context/FilterContext";

export const metadata = {
  title: "Sorriso Café",
  description: "Sistema de gestão de estoque do Sorriso Café",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          <FilterProvider>
            <SidebarWithNavbar>
              <link
                rel="icon"
                type="image/png"
                href="/scicon.svg"
                sizes="32x32"
              />
              <main className="flex min-h-screen">
                <div className="flex-1">{children}</div>
              </main>
            </SidebarWithNavbar>
          </FilterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
