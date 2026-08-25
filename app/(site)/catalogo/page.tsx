import type { Metadata } from "next";

import Catalogo from "@/components/site/Catalogo";
import Reveal from "@/components/site/Reveal";
import { repo } from "@/lib/repo";
import { site, textos } from "@/data/site.config";
import { waGeral } from "@/lib/whatsapp";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Catálogo",
  description: `Todas as peças da ${site.nome} ${site.sufixo}.`,
  alternates: { canonical: "/catalogo" },
};

/**
 * O catálogo.
 *
 * Existe mesmo com uma peça só. É o endereço fixo da coleção: quando a marca
 * lançar a segunda, a terceira, a peça nova aparece aqui sem que ninguém
 * precise mexer em página nenhuma.
 */
export default async function PaginaCatalogo() {
  const dados = repo();
  const [pecas, config] = await Promise.all([
    dados.listarPublicas(),
    dados.config(),
  ]);
  const numero = config.whatsapp || site.whatsapp;

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow eyebrow-inicio">A coleção</p>
            <h1 className="display mt-5 text-4xl md:text-6xl">
              Tudo que <em className="text-ouro italic">fizemos</em>
            </h1>
          </div>

          <p className="rotulo pb-2">
            {pecas.length === 1 ? "1 peça" : `${pecas.length} peças`}
          </p>
        </div>
      </Reveal>

      {pecas.length > 0 ? (
        <Catalogo pecas={pecas} />
      ) : (
        <p className="mt-16 max-w-md text-sm leading-relaxed text-carvao/65">
          {textos.rodapeLinha}
        </p>
      )}

      <Reveal atraso={160}>
        <div className="mt-20 border-t border-carvao/10 pt-12 md:mt-28">
          <p className="display max-w-lg text-2xl md:text-3xl">
            Ficou em dúvida entre duas? A gente ajuda a escolher.
          </p>
          <a
            href={waGeral(numero)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-tinta mt-8"
          >
            Falar no WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}
