import type { Config, NovaPeca, Peca } from "@/lib/types";

/**
 * Contrato do catálogo.
 *
 * Nasceu com uma peça só, mas em lista desde já: quando a LEGADO lançar a
 * segunda, nada aqui muda. A vitrine esconde sozinha o que não faz sentido
 * com uma peça única.
 */
export interface Repositorio {
  /** só as ativas, na ordem — é o que a vitrine enxerga */
  listarPublicas(): Promise<Peca[]>;
  /** tudo, inclusive as ocultas — só o painel usa */
  listarTodas(): Promise<Peca[]>;
  buscarPorSlug(slug: string): Promise<Peca | null>;
  buscarPorId(id: string): Promise<Peca | null>;

  criarPeca(dados: NovaPeca): Promise<Peca>;
  atualizarPeca(id: string, dados: Partial<NovaPeca>): Promise<Peca>;
  removerPeca(id: string): Promise<void>;
  /** marca uma como destaque e desmarca as demais */
  definirDestaque(id: string): Promise<void>;

  config(): Promise<Config>;
  salvarConfig(dados: Config): Promise<void>;
}
