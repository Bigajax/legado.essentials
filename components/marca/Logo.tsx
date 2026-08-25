import Image from "next/image";
import { site } from "@/data/site.config";

/**
 * Logotipo oficial da LEGADO, em três recortes da mesma arte:
 *
 * - `arvore`    a copa sozinha, para o cabeçalho e o favicon
 * - `lettering` só o "LEGADO · EST. 2026", para acompanhar a árvore no topo
 * - `marca`     o conjunto, para rodapé, login e 404
 *
 * É a arte da marca, nunca recriada em tipografia.
 */
const PARTES = {
  arvore: { src: "/marca/legado-arvore.png", w: 990, h: 912 },
  lettering: { src: "/marca/legado-lettering.png", w: 1140, h: 242 },
  marca: { src: "/marca/legado-marca.png", w: 1140, h: 1193 },
} as const;

export default function Logo({
  parte = "marca",
  altura = 48,
  prioridade = false,
  className = "",
}: {
  parte?: keyof typeof PARTES;
  /** altura em px; a largura acompanha a proporção */
  altura?: number;
  prioridade?: boolean;
  className?: string;
}) {
  const { src, w, h } = PARTES[parte];
  const decorativa = parte === "lettering";

  return (
    <Image
      src={src}
      alt={decorativa ? "" : `${site.nome} ${site.sufixo}, ${site.fundacao}`}
      aria-hidden={decorativa || undefined}
      width={w}
      height={h}
      priority={prioridade}
      sizes={`${Math.round((altura * w) / h)}px`}
      style={{ height: altura, width: "auto" }}
      className={className}
    />
  );
}
