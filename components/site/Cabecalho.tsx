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
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3 md:px-10 md:py-4">
        {/*
          O lockup inteiro aparece no celular também. Escondê-lo deixava só a
          árvore solta na barra, e uma marca nova não pode contar com o
          símbolo sozinho para ser reconhecida.
        */}
        <Link
          href="/"
          aria-label={`${site.nome} ${site.sufixo}, início`}
          className="flex items-center gap-3 md:gap-4"
        >
          <Logo parte="arvore" altura={34} prioridade />
          <span className="block">
            <Logo parte="lettering" altura={14} />
            <span className="rotulo mt-1 block text-[0.5rem] tracking-[0.34em] md:text-[0.5625rem] md:tracking-[0.42em]">
              {site.sufixo}
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-7">
          <Link
            href="/catalogo"
            className="rotulo hidden transition-colors hover:text-carvao sm:inline"
          >
            Catálogo
          </Link>

          {/*
            O botão existe no celular também. Antes era `hidden md:inline-flex`,
            então a barra ficava sem nenhuma ação justo onde a compra acontece.
          */}
          <a
            href={waGeral(numero)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-linha btn-barra"
          >
            <span className="sm:hidden">WhatsApp</span>
            <span className="hidden sm:inline">Falar com a gente</span>
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
