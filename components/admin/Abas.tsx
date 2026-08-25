"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ABAS = [
  // `prefixo` mantém a aba acesa dentro das páginas filhas de cada seção
  { href: "/admin", prefixo: "/admin/pecas", rotulo: "Peças" },
  { href: "/admin/loja", prefixo: "/admin/loja", rotulo: "Dados da loja" },
] as const;

/**
 * As abas do painel.
 *
 * São rotas de verdade, não estado de componente: cada aba carrega no
 * servidor só o que ela mostra, e o lojista pode deixar a loja aberta num
 * favorito. A aba ativa é marcada pelo caminho, não por prop.
 */
export default function Abas() {
  const caminho = usePathname();

  return (
    <nav className="flex gap-8" aria-label="Seções do painel">
      {ABAS.map((aba) => {
        const ativa =
          caminho === aba.href || caminho.startsWith(aba.prefixo + "/") ||
          caminho === aba.prefixo;
        return (
          <Link
            key={aba.href}
            href={aba.href}
            aria-current={ativa ? "page" : undefined}
            data-on={ativa}
            className="aba"
          >
            {aba.rotulo}
          </Link>
        );
      })}
    </nav>
  );
}
