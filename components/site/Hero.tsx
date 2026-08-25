"use client";

import Image from "next/image";
import { useState } from "react";

import { brl } from "@/lib/formato";
import { coresAtivas, temDesconto, type Peca } from "@/lib/types";
import { waPeca } from "@/lib/whatsapp";
import { textos } from "@/data/site.config";

/**
 * Hero comercial, no espírito da referência: a peça grande sobre um campo de
 * cor, título pesado em caixa alta à esquerda e um botão sólido.
 *
 * O campo de cor troca junto com a peça — cada tom foi escolhido para o
 * tecido daquela cor. Isso só é possível porque as fotos foram recortadas.
 */
export default function Hero({ peca, numero }: { peca: Peca; numero: string }) {
  const cores = coresAtivas(peca);
  const [i, setI] = useState(0);
  const [tamanho, setTamanho] = useState<string | null>(null);

  const cor = cores[i];
  const desconto = temDesconto(peca);
  const link = waPeca(peca, {
    cor: cor?.nome,
    tamanho: tamanho ?? undefined,
    numero,
  });

  return (
    <section
      id="topo"
      className="relative overflow-hidden transition-colors duration-700"
      style={{ background: cor?.campo }}
    >
      <div className="mx-auto grid min-h-[80vh] max-w-[1500px] items-center gap-8 px-5 py-12 md:grid-cols-2 md:gap-4 md:px-10 md:py-16">
        {/* --------------------------------------------------------- texto */}
        <div className="order-2 md:order-1">
          <p className="rotulo !text-carvao/55">{textos.heroFicha[0]}</p>

          <h1 className="titulo mt-4 text-[clamp(2.5rem,7vw,5.25rem)]">
            Feito para durar
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-carvao/70 md:text-base">
            {textos.heroLinha}
          </p>

          {/* cores, como as bolinhas da referência */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            {cores.map((c, idx) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setI(idx)}
                data-on={idx === i}
                aria-pressed={idx === i}
                aria-label={c.nome}
                title={c.nome}
                className="amostra"
                style={{ background: c.hex }}
              />
            ))}
            <span className="rotulo ml-2 !text-carvao">{cor?.nome}</span>
          </div>

          {/* tamanhos */}
          {peca.tamanhos.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rotulo mr-2 !text-carvao/55">Tamanho</span>
              {peca.tamanhos.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTamanho(tamanho === t ? null : t)}
                  data-on={tamanho === t}
                  aria-pressed={tamanho === t}
                  className="pill"
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <p className="preco mt-9 text-3xl">
            {desconto && (
              <span className="mr-3 text-lg text-carvao/45 line-through">
                {brl(peca.preco)}
              </span>
            )}
            {brl(peca.precoPromocional ?? peca.preco)}
          </p>

          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="btn btn-tinta mt-6 w-full sm:w-auto"
          >
            Comprar no WhatsApp
          </a>

        </div>

        {/* ---------------------------------------------------------- peça */}
        <div className="relative order-1 aspect-square w-full md:order-2 md:aspect-auto md:h-[68vh]">
          {cores.map((c, idx) => (
            <Image
              key={c.slug}
              src={c.foto}
              alt={c.alt}
              fill
              priority={idx === 0}
              sizes="(max-width: 768px) 92vw, 46vw"
              className={`peca-sombra object-contain transition-opacity duration-700 ${
                idx === i ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
