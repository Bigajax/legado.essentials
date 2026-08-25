import Link from "next/link";

import Logo from "@/components/marca/Logo";
import ListaPecas from "@/components/admin/ListaPecas";
import PainelConfig from "@/components/admin/PainelConfig";
import { acaoSair } from "@/app/admin/acoes";
import { repo } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function Painel() {
  const dados = repo();
  const [pecas, config] = await Promise.all([
    dados.listarTodas(),
    dados.config(),
  ]);

  return (
    <>
      <header className="border-b border-ouro/15">
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
              <button type="submit" className="rotulo transition-colors hover:text-ouro">
                Sair
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12">
        <h1 className="display text-4xl">As peças</h1>
        <p className="mt-2 mb-10 text-sm text-areia">
          Tudo que a vitrine mostra está aqui. Cada peça tem sua página e seu
          botão de WhatsApp.
        </p>

        <ListaPecas pecas={pecas} />

        <section className="mt-20 border-t border-ouro/15 pt-12">
          <h2 className="display text-3xl">Dados da loja</h2>
          <p className="mt-2 mb-10 text-sm text-areia">
            Aparecem no rodapé e nos botões de WhatsApp.
          </p>
          <PainelConfig config={config} />
        </section>
      </main>
    </>
  );
}
