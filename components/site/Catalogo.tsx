import Image from "next/image";
import Link from "next/link";

import Reveal from "@/components/site/Reveal";
import { brl } from "@/lib/formato";
import { coresAtivas, precoEfetivo, type Peca } from "@/lib/types";

/**
 * O catálogo.
 *
 * Só entra na home quando existe mais de uma peça. Com uma peça só, ele seria
 * um eco do hero — por isso a home mostra as cores no lugar dele.
 *
 * A capa de cada peça é a primeira cor ativa, sobre o campo daquela cor. É a
 * mesma linguagem do hero, então a página inteira continua parecendo uma coisa.
 */
export default function Catalogo({ pecas }: { pecas: Peca[] }) {
  return (
    <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 md:mt-20 md:grid-cols-3 md:gap-x-8 md:gap-y-16">
      {pecas.map((peca, i) => {
        const cores = coresAtivas(peca);
        const capa = cores[0];
        const valor = precoEfetivo(peca);

        return (
          <Reveal key={peca.id} atraso={i * 90}>
            <Link href={`/p/${peca.slug}`} className="group block">
              <div
                className="relative aspect-4/5 overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ background: capa?.campo }}
              >
                {capa && (
                  <Image
                    src={capa.foto}
                    alt={capa.alt}
                    fill
                    sizes="(max-width: 768px) 45vw, 30vw"
                    className="peca-sombra object-contain p-6"
                  />
                )}
              </div>

              <h3 className="marca mt-7 text-sm transition-colors group-hover:text-ouro">
                {peca.nome}
              </h3>

              <p className="mt-2 flex items-baseline gap-3">
                <span className="preco text-sm text-carvao">{brl(valor)}</span>
                {cores.length > 1 && (
                  <span className="rotulo !text-[0.5625rem]">
                    {cores.length} cores
                  </span>
                )}
              </p>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
