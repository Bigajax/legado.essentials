export type Cor = {
  slug: string;
  nome: string;
  /** amostra na vitrine — o tom aproximado do tecido */
  hex: string;
  /** campo de fundo do hero para esta cor */
  campo: string;
  foto: string;
  alt: string;
  ativa: boolean;
  ordem: number;
};

export type Peca = {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  composicao: string;
  gramatura: string;
  /** null = "Consulte" */
  preco: number | null;
  precoPromocional: number | null;
  tamanhos: string[];
  cores: Cor[];
  /** a peça que sobe para o hero; só uma fica marcada */
  destaque: boolean;
  ativo: boolean;
  ordem: number;
  criadoEm: string;
};

export type NovaPeca = Omit<Peca, "id" | "criadoEm">;

export type Config = {
  whatsapp: string;
  instagram: string;
  prazo: string;
  troca: string;
};

export function precoEfetivo(p: Peca): number | null {
  return p.precoPromocional ?? p.preco;
}

export function temDesconto(p: Peca): boolean {
  return (
    p.precoPromocional != null &&
    p.preco != null &&
    p.precoPromocional < p.preco
  );
}

export function coresAtivas(p: Peca): Cor[] {
  return [...p.cores].filter((c) => c.ativa).sort((a, b) => a.ordem - b.ordem);
}

/** A peça do hero: a marcada como destaque, ou a primeira da ordem. */
export function pecaDestaque(pecas: Peca[]): Peca | undefined {
  return pecas.find((p) => p.destaque) ?? pecas[0];
}

export function porOrdem(a: Peca, b: Peca): number {
  return a.ordem - b.ordem || a.nome.localeCompare(b.nome, "pt-BR");
}
