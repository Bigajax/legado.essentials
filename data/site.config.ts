/**
 * Identidade e canais da LEGADO essentials.
 * Tudo que muda de marca para marca mora aqui.
 */

/** Variável de ambiente vazia conta como ausente (`??` deixaria passar ""). */
function comPadrao(valor: string | undefined, padrao: string): string {
  const limpo = valor?.trim();
  return limpo ? limpo : padrao;
}

export const site = {
  nome: "LEGADO",
  sufixo: "essentials",
  fundacao: "EST. 2026",
  origem: "Brasil",
  slogan: "Feito para durar.",
  descricao:
    "Camisetas essenciais em Interlock Pima 215 g/m², com bordado exclusivo e acabamento premium. Qualidade, propósito e atemporalidade. Feito no Brasil.",
  url: comPadrao(
    process.env.NEXT_PUBLIC_SITE_URL,
    "https://legadoessentials.com.br",
  ).replace(/\/+$/, ""),
  // PENDENTE: o perfil não publica telefone. Confirmar com o cliente.
  whatsapp: comPadrao(process.env.NEXT_PUBLIC_WHATSAPP_NUMERO, "5500000000000")
    .replace(/\D/g, ""),
  instagram: "https://www.instagram.com/legado.essentials/",
  instagramHandle: "@legado.essentials",
  criador: "@guiigamaa",
  criadorUrl: "https://www.instagram.com/guiigamaa/",
} as const;

/** Os três pilares da bio, que viram a seção-assinatura da home. */
export const pilares = [
  {
    numeral: "I",
    nome: "Qualidade",
    resumo: "215 g/m²",
    linha:
      "Interlock Pima 215 g/m². Mais macio, mais resistente, feito com uma das melhores fibras do mundo. Qualidade começa na origem.",
  },
  {
    numeral: "II",
    nome: "Propósito",
    resumo: "Bordado exclusivo",
    linha:
      "Bordado exclusivo em cada peça: a árvore que representa nossas raízes e o que queremos construir. Excelência em cada ponto.",
  },
  {
    numeral: "III",
    nome: "Atemporal",
    resumo: "Sem estação",
    linha:
      "Menos, mas melhor. Uma camiseta que não sai de moda porque nunca dependeu dela. Feita para ficar anos no seu guarda-roupa.",
  },
] as const;

/** Textos institucionais — centralizados, nunca hardcoded em página. */
export const textos = {
  heroTitulo: { linha1: "Feito", linha2: "para ", destaque: "durar." },
  heroLinha:
    "Uma camiseta só, resolvida até o último ponto. Interlock Pima, bordado exclusivo e acabamento premium por dentro e por fora.",
  heroFicha: ["Interlock Pima 215 g/m²", "Bordado exclusivo", "Feito no Brasil"],

  produtoEyebrow: "A peça",
  produtoTitulo: "A camiseta",
  produtoLinha:
    "Escolha a cor. A modelagem, o fio e o acabamento são os mesmos em todas.",

  manifesto: { linha1: "Menos,", linha2: "mas ", destaque: "melhor." },
  manifestoEyebrow: "O que nos move",
  manifestoApoio: "Conforto que você sente. Qualidade que você vê.",

  pilaresEyebrow: "No que acreditamos",
  pilaresTitulo: "Nossos pilares",
  pilaresApoio:
    "Três decisões que não mudam de coleção para coleção. São elas que fazem a peça durar, e são elas que a gente cobra de nós mesmos a cada ponto.",

  fichaEyebrow: "Ficha técnica",
  fichaTitulo: "Cada detalhe conta",

  rodapeLinha:
    "Mais do que uma camiseta: o início de uma história feita para durar.",
} as const;

/**
 * O número que a peça tem de mais concreto. Sai da lista e vira manchete:
 * enterrado entre outras seis linhas iguais, ninguém lia.
 */
export const fichaDestaque = {
  numero: "215",
  unidade: "g/m²",
  legenda: "Interlock Pima",
} as const;

/** O resto da ficha, já sem o que virou manchete. */
export const ficha = [
  { rotulo: "Modelagem", valor: "Regular, ombro estruturado" },
  { rotulo: "Gola", valor: "Careca com ribana reforçada" },
  { rotulo: "Assinatura", valor: "Bordado da árvore no peito" },
  { rotulo: "Etiqueta", valor: "Tecida na gola e na barra" },
  { rotulo: "Origem", valor: "Brasil" },
] as const;

/** As frases da faixa rotativa. Curtas: elas passam andando. */
export const faixa = [
  "Interlock Pima",
  "215 g/m²",
  "Bordado exclusivo",
  "Acabamento premium",
  "Feito no Brasil",
  "Feito para durar",
] as const;
