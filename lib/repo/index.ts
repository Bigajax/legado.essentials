import "server-only";
import type { Repositorio } from "@/lib/repo/contrato";
import { criarRepositorioLocal } from "@/lib/repo/local";

let local: Repositorio | null = null;

/**
 * Hoje só existe o adaptador local (`.dados/banco.json`). O contrato está
 * isolado para que trocar por Supabase seja escrever um segundo adaptador e
 * decidir aqui, sem tocar em nenhuma página.
 */
export function repo(): Repositorio {
  return (local ??= criarRepositorioLocal());
}

export type { Repositorio } from "@/lib/repo/contrato";
