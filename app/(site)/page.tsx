import Image from "next/image";

import { repo } from "@/lib/repo";
import {
  site,
  textos,
  pilares,
  ficha,
  fichaDestaque,
} from "@/data/site.config";
import { coresAtivas, pecaDestaque } from "@/lib/types";

import Reveal from "@/components/site/Reveal";
import Hero from "@/components/site/Hero";
import Catalogo from "@/components/site/Catalogo";

export const revalidate = 60;

export default async function Home() {
  const dados = repo();
  const [pecas, config] = await Promise.all([
    dados.listarPublicas(),
    dados.config(),
  ]);
  const numero = config.whatsapp || site.whatsapp;

  const peca = pecaDestaque(pecas);
  if (!peca) return <VitrineVazia />;

  // Com uma peça só, o catálogo seria um eco do hero: mostramos as cores.
  // A partir da segunda, as cores viram assunto da página da peça.
  const catalogo = pecas.length > 1;
  const cores = coresAtivas(peca);

  return (
    <>
      {/* 1 — O hero É a peça ---------------------------------------------- */}
      <Hero peca={peca} numero={numero} />

      {/* 2 — Manifesto: a faixa escura ------------------------------------ */}
      <section className="bg-carvao text-creme">
        <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
          <Reveal>
            <p className="eyebrow eyebrow-inicio">
              {textos.manifestoEyebrow}
            </p>

            <p className="display mt-8 text-5xl md:text-7xl lg:text-8xl">
              {textos.manifesto.linha1}
              <br />
              {textos.manifesto.linha2}
              <em className="text-ouro-claro italic">
                {textos.manifesto.destaque}
              </em>
            </p>

            {/* a linha de apoio foge para a direita: é o que tira o eixo do
                centro e faz a faixa parecer composta, não centralizada */}
            <div className="mt-14 flex justify-end md:mt-20">
              <div className="max-w-xs text-right">
                <span aria-hidden className="filete ml-auto block max-w-16" />
                <p className="rotulo mt-6 leading-loose !text-creme/70">
                  {textos.manifestoApoio}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 — O catálogo, ou a cartela de cores quando só existe uma peça -- */}
      <section className="border-b border-carvao/10 bg-creme-2">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div>
                <p className="eyebrow eyebrow-inicio">
                  {catalogo ? "O catálogo" : "A cartela"}
                </p>
                <h2 className="display mt-5 text-4xl md:text-5xl lg:text-6xl">
                  {catalogo ? (
                    <>
                      Tudo que <em className="text-ouro italic">fizemos</em>
                    </>
                  ) : (
                    <>
                      Uma peça, quatro{" "}
                      <em className="text-ouro italic">jeitos</em>
                    </>
                  )}
                </h2>
              </div>

              <p className="rotulo pb-2">
                {catalogo
                  ? `${pecas.length} peças`
                  : `${cores.length} cores · mesma modelagem`}
              </p>
            </div>
          </Reveal>

          {catalogo ? (
            <Catalogo pecas={pecas} />
          ) : (
            <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 md:mt-20 md:grid-cols-4 md:gap-x-8">
              {cores.map((c, i) => (
                <Reveal key={c.slug} atraso={i * 110}>
                  <a href="#topo" className="group block">
                    <div
                      className="relative aspect-4/5 overflow-hidden"
                      style={{ background: c.campo }}
                    >
                      <Image
                        src={c.foto}
                        alt={c.alt}
                        fill
                        sizes="(max-width: 768px) 45vw, 22vw"
                        className="peca-sombra object-contain p-6 transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                    </div>

                    <div className="cor-cartela">
                      <span aria-hidden className="cor-numero">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="rotulo transition-colors group-hover:text-ouro">
                          {c.nome}
                        </span>
                        <span
                          aria-hidden
                          className="block h-3 w-3 border border-carvao/25"
                          style={{ background: c.hex }}
                        />
                      </span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4 — Pilares: a descida ------------------------------------------- */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-32">
        <Reveal>
          <p className="eyebrow eyebrow-inicio">{textos.pilaresEyebrow}</p>
          <h2 className="display mt-5 text-4xl md:text-6xl lg:text-7xl">
            Nossos <em className="text-ouro italic">pilares</em>
          </h2>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-carvao/60 md:text-base">
            {textos.pilaresApoio}
          </p>
        </Reveal>

        <div className="mt-16 md:mt-24">
          {pilares.map((p, i) => (
            <Reveal
              key={p.nome}
              atraso={i * 140}
              className={`pilar degrau-${i + 1}`}
            >
              <span aria-hidden className="pilar-numeral">
                {p.numeral}
              </span>

              <span className="pilar-resumo rotulo">{p.resumo}</span>

              <div className="pilar-corpo">
                <h3 className="marca text-sm text-carvao md:text-base">
                  {p.nome}
                </h3>
                <span aria-hidden className="pilar-fio" />
                <p className="text-sm leading-relaxed text-carvao/65 md:text-base">
                  {p.linha}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5 — Ficha técnica: a etiqueta ------------------------------------ */}
      <section className="border-t border-carvao/10 bg-creme-2">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-28 lg:gap-28">
          <Reveal>
            <p className="eyebrow eyebrow-inicio">{textos.fichaEyebrow}</p>
            <h2 className="display mt-5 text-4xl md:text-5xl lg:text-6xl">
              Cada detalhe <em className="text-ouro italic">conta</em>
            </h2>
            <p className="mt-7 max-w-sm text-sm leading-relaxed text-carvao/60 md:text-base">
              {textos.produtoLinha}
            </p>

            {/* a manchete da ficha, no lado que antes ficava vazio */}
            <div className="mt-14 md:mt-24">
              <p className="ficha-numero text-[clamp(3.5rem,8vw,6rem)]">
                {fichaDestaque.numero}
                <span className="ficha-unidade">{fichaDestaque.unidade}</span>
              </p>
              <span aria-hidden className="filete mt-7 block max-w-24" />
              <p className="rotulo mt-7">{fichaDestaque.legenda}</p>
            </div>
          </Reveal>

          <Reveal atraso={140}>
            <dl className="md:pt-3">
              {ficha.map((linha) => (
                <div key={linha.rotulo} className="ficha-linha">
                  <dt className="rotulo shrink-0">{linha.rotulo}</dt>
                  <dd className="text-right text-sm text-carvao md:text-base">
                    {linha.valor}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/**
 * A vitrine sem nenhuma peça publicada. Não deve acontecer em produção, mas
 * é o estado real logo depois que o lojista oculta a última peça — melhor uma
 * página honesta do que um erro de servidor.
 */
function VitrineVazia() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <p className="eyebrow">Em breve</p>
      <h1 className="display mt-6 text-4xl md:text-5xl">
        Estamos preparando as <em className="text-ouro italic">peças</em>
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-carvao/65">
        {textos.rodapeLinha}
      </p>
      <a
        href={`https://instagram.com/${site.instagram.replace(/^@/, "")}`}
        target="_blank"
        rel="noreferrer"
        className="btn btn-linha mt-10"
      >
        Acompanhar no Instagram
      </a>
    </section>
  );
}
