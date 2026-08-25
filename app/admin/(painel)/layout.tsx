import Link from "next/link";

import Logo from "@/components/marca/Logo";
import Abas from "@/components/admin/Abas";
import { acaoSair } from "@/app/admin/acoes";
import { protegerPagina } from "@/lib/auth";

export default async function LayoutPainel({
  children,
}: {
  children: React.ReactNode;
}) {
  // proteção real — o proxy.ts só faz a checagem barata de cookie
  await protegerPagina();

  return (
    <>
      <header className="border-b border-carvao/10">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-4">
            <Logo parte="arvore" altura={34} />
            <span className="rotulo text-ouro">Painel</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              target="_blank"
              className="rotulo transition-colors hover:text-ouro"
            >
              Ver vitrine ↗
            </Link>
            <form action={acaoSair}>
              <button
                type="submit"
                className="rotulo transition-colors hover:text-ouro"
              >
                Sair
              </button>
            </form>
          </nav>
        </div>

        <div className="mx-auto max-w-4xl px-5">
          <Abas />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12">{children}</main>
    </>
  );
}
