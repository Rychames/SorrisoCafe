// app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  // Rotas válidas do sistema
  const validRoutes = [
    "/",
    "/login",
    "/add-product",
    "/inventory",
    "/not-found"
  ];

  // Rotas públicas (não requerem autenticação)
  const publicRoutes = ["/login", "/not-found"];

  // Verifica se a rota é válida
  const isRouteValid = validRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Redireciona para not-found se rota não existe
  if (!isRouteValid) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // Redireciona usuários logados que tentam acessar login
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Bloqueia acesso a rotas privadas sem token
  if (!publicRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};