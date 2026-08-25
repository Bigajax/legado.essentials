import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import Hero from "@/components/site/Hero";
import Reveal from "@/components/site/Reveal";
import Catalogo from "@/components/site/Catalogo";
import { repo } from "@/lib/repo";
import { site, ficha } from "@/data/site.config";
import { brl } from "@/lib/formato";
import { coresAtivas, precoEfetivo } from "@/lib/types";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const pecas = await repo().listarPublicas();
  return pecas.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const peca = await repo().buscarPorSlug(slug);
  if (!peca) return {};

  const capa = coresAtivas(peca)[0];
  const valor = precoEfetivo(peca);

  return {
    // o layout já acrescenta "| LEGADO" pelo template
    title: peca.nome,
    description: peca.descricao.slice(0, 160),
    alternates: { canonical: `/p/${peca.slug}` },
    openGraph: {
      title: `${peca.nome} - ${brl(valor)}`,
      description: peca.descricao.slice(0, 200),
      url: `/p/${peca.slug}`,
      images: capa ? [{ url: capa.foto, alt: capa.alt }] : undefined,
    },
  };
}

export default async function PaginaPeca({ params }: Props) {
  const { slug } = await params;
  const dados = repo();
  const [peca, pecas, config] = await Promise.all([
    dados.buscarPorSlug(slug),
    dados.listarPublicas(),
    dados.config(),
  ]);

  // peça oculta pelo painel some da vitrine como se não existisse
  if (!peca || !peca.ativo) notFound();

  const numero = config.whatsapp || site.whatsapp;
  const outras = pecas.filter((p) => p.id !== peca.id);

  return (
    <>
      {/* o mesmo hero da home: a peça é sempre o assunto principal */}
      <Hero peca={peca} numero={numero} />

      {/* a peça por escrito ---------------------------------------------- */}
      <section className="border-t border-carvao/10 bg-creme-2">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-28">
          <Reveal>
            <p className="eyebrow eyebrow-inicio">A peça</p>
            <h2 className="display mt-5 text-4xl md:text-5xl">{peca.nome}</h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-carvao/70">
              {peca.descricao}
            </p>
          </Reveal>

          <Reveal atraso={120}>
            <dl>
              {[
                { rotulo: "Tecido", valor: peca.composicao },
                { rotulo: "Gramatura", valor: peca.gramatura },
                { rotulo: "Cores", valor: coresAtivas(peca).map((c) => c.nome).join(", ") },
                { rotulo: "Tamanhos", valor: peca.tamanhos.join(" · ") },
                // `ficha` já não repete tecido nem gramatura: eles vêm da peça
                ...ficha,
              ]
                .filter((l) => l.valor)
                .map((linha) => (
                  <div key={linha.rotulo} className="ficha-linha">
                    <dt className="rotulo shrink-0">{linha.rotulo}</dt>
                    <dd className="text-right text-sm text-carvao md:text-base">
                      {linha.valor}
                    </dd>
                  </div>
                ))}
            </dl>

            <p className="mt-8 text-xs leading-relaxed text-carvao/55">
              {config.prazo} {config.troca}
            </p>
          </Reveal>
        </div>
      </section>

      {/* as outras peças -------------------------------------------------- */}
      {outras.length > 0 && (
        <section className="border-t border-carvao/10">
          <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
            <Reveal className="text-center">
              <p className="eyebrow">Também da LEGADO</p>
              <h2 className="display mt-5 text-4xl md:text-5xl">
                Continue <em className="text-ouro italic">olhando</em>
              </h2>
            </Reveal>

            <Catalogo pecas={outras} />

            <div className="mt-16 text-center">
              <Link href="/catalogo" className="btn btn-linha">
                Ver o catálogo
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
