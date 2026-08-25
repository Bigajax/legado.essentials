import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next 16 chama o antigo middleware de `proxy`.
 *
 * Isto é CONVENIÊNCIA, não a proteção: só evita renderizar o painel para quem
 * claramente não tem sessão. A proteção real está em
 * `app/admin/(painel)/layout.tsx` e em cada Server Action.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin/entrar")) return NextResponse.next();

  if (!request.cookies.get("lgd_sessao")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/entrar";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: "/admin/:path*" };
