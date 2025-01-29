import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken");
  const { pathname } = req.nextUrl;

  // Lista de rotas válidas
  const validRoutes = ["/", "/login", "/add-product", "/inventory", "/not-found"];

  // Verifica se a rota atual é válida
  if (!validRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/not-found", req.url)); // Redireciona para a página 404
  }

  // Permitir o acesso à página de login sem autenticação
  if (pathname === "/login") {
    if (token) {
      // Redireciona para a página inicial se o usuário já estiver logado
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Bloquear outras rotas caso não esteja logado
  if (!token && pathname !== "/not-found") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"], // Ignora rotas públicas
};