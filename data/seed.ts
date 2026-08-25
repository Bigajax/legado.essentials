/**
 * Semente do catálogo.
 *
 * Quem consome: `lib/repo/local.ts` na primeira leitura, quando
 * `.dados/banco.json` ainda não existe.
 *
 * A LEGADO vende uma peça só, em quatro cores. Por isso o modelo é
 * `Peca` com `cores[]` — não uma lista de produtos quase iguais.
 *
 * Fotos e dados de marca vieram do @legado.essentials (ago/2026).
 * PREÇO: o perfil não publica valor. Está como null ("Consulte") até o
 * cliente confirmar — o lojista preenche pelo painel.
 */
import type { Config, Peca } from "@/lib/types";
import { site } from "@/data/site.config";

export const pecasSeed: Peca[] = [
  {
  id: "peca-essential",
  nome: "Camiseta Essential",
  slug: "camiseta-essential",
  descricao:
    "A primeira peça da LEGADO. Interlock Pima de 215 g/m², modelagem regular com ombro estruturado e gola careca com ribana reforçada. O bordado da árvore no peito é a nossa assinatura: as raízes e o que queremos construir. Acabamento premium por dentro e por fora, porque conforto e qualidade também ficam onde ninguém vê.",
  composicao: "Interlock Pima",
  gramatura: "215 g/m²",
  preco: null,
  precoPromocional: null,
  tamanhos: ["P", "M", "G", "GG"],
  destaque: true,
  ativo: true,
  ordem: 1,
  criadoEm: "2026-08-25T12:00:00.000Z",
  cores: [
    {
      slug: "verde-militar",
      nome: "Verde militar",
      hex: "#414736",
      campo: "#dde2d4",
      foto: "/fotos/camiseta-verde-militar.png",
      alt: "Camiseta Essential na cor verde militar, vista de frente",
      ativa: true,
      ordem: 1,
    },
    {
      slug: "preta",
      nome: "Preta",
      hex: "#131313",
      campo: "#dededc",
      foto: "/fotos/camiseta-preta.png",
      alt: "Camiseta Essential na cor preta, vista de frente",
      ativa: true,
      ordem: 2,
    },
    {
      slug: "cinza-mescla",
      nome: "Cinza mescla",
      hex: "#b6b6b8",
      campo: "#d9e0e5",
      foto: "/fotos/camiseta-cinza-mescla.png",
      alt: "Camiseta Essential na cor cinza mescla, vista de frente",
      ativa: true,
      ordem: 3,
    },
    {
      slug: "crua",
      nome: "Crua",
      hex: "#efe8dc",
      campo: "#e9dfce",
      foto: "/fotos/camiseta-crua.png",
      alt: "Camiseta Essential na cor crua, vista de frente",
      ativa: true,
      ordem: 4,
    },
  ],
  },
];

export const configSeed: Config = {
  whatsapp: site.whatsapp,
  instagram: site.instagram,
  prazo: "Envio em até 3 dias úteis para todo o Brasil.",
  troca: "Troca em até 7 dias, com a peça sem uso e a etiqueta intacta.",
};
