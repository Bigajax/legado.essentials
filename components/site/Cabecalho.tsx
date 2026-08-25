"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/marca/Logo";
import { site } from "@/data/site.config";
import { waGeral } from "@/lib/whatsapp";

export default function Cabecalho({ numero }: { numero: string }) {
  const [preso, setPreso] = useState(false);

  useEffect(() => {
    const aoRolar = () => setPreso(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        preso ? "bg-creme/92 backdrop-blur-sm" : ""
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-4 md:px-10">
        <Link
          href="/"
          aria-label={`${site.nome} ${site.sufixo}, início`}
          className="flex items-center gap-4"
        >
          <Logo parte="arvore" altura={38} prioridade />
          <span className="hidden sm:block">
            <Logo parte="lettering" altura={16} />
            <span className="rotulo mt-1 block text-[0.5625rem] tracking-[0.42em]">
              {site.sufixo}
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-7">
          <Link href="/#topo" className="rotulo transition-colors hover:text-carvao">
            A peça
          </Link>
          <a
            href={waGeral(numero)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-linha hidden md:inline-flex"
          >
            Falar com a gente
          </a>
        </nav>
      </div>

      <span
        aria-hidden
        className={`filete block transition-opacity duration-500 ${
          preso ? "opacity-100" : "opacity-0"
        }`}
      />
    </header>
  );
}
