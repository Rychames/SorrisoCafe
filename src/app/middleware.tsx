import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("authToken");

    const { pathname } = req.nextUrl;

    // Permitir o acesso à página de login e signup sem autenticação
    if (pathname === "/login" || pathname === "/signup") {
        if (token) {
            // Redireciona para o dashboard se o usuário já estiver logado
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next();
    }

    // Bloquear outras rotas caso não esteja logado
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|static|favicon.ico).*)"], // Ignora rotas públicas
};
