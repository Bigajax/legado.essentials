import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import type { Config, Peca } from "@/lib/types";
import { porOrdem } from "@/lib/types";
import { configSeed, pecasSeed } from "@/data/seed";
import { gerarSlug, slugUnico } from "@/lib/slug";
import type { Repositorio } from "@/lib/repo/contrato";

type Banco = { pecas: Peca[]; config: Config };

const PASTA = path.join(process.cwd(), ".dados");
const ARQUIVO = path.join(PASTA, "banco.json");

let cache: Banco | null = null;
/** Escritas serializadas para não intercalar dois writeFile no mesmo arquivo. */
let escrevendo: Promise<void> = Promise.resolve();

async function ler(): Promise<Banco> {
  if (cache) return cache;
  try {
    cache = JSON.parse(await fs.readFile(ARQUIVO, "utf8")) as Banco;
  } catch {
    cache = {
      pecas: structuredClone(pecasSeed),
      config: structuredClone(configSeed),
    };
    await gravar(cache);
  }
  return cache;
}

async function gravar(banco: Banco): Promise<void> {
  cache = banco;
  escrevendo = escrevendo.then(async () => {
    await fs.mkdir(PASTA, { recursive: true });
    await fs.writeFile(ARQUIVO, JSON.stringify(banco, null, 2), "utf8");
  });
  await escrevendo;
}

export function criarRepositorioLocal(): Repositorio {
  return {
    async listarPublicas() {
      const { pecas } = await ler();
      return pecas.filter((p) => p.ativo).sort(porOrdem);
    },

    async listarTodas() {
      const { pecas } = await ler();
      return [...pecas].sort(porOrdem);
    },

    async buscarPorSlug(slug) {
      const { pecas } = await ler();
      return pecas.find((p) => p.slug === slug) ?? null;
    },

    async buscarPorId(id) {
      const { pecas } = await ler();
      return pecas.find((p) => p.id === id) ?? null;
    },

    async criarPeca(dados) {
      const banco = await ler();
      const peca: Peca = {
        ...dados,
        id: randomUUID(),
        slug: slugUnico(dados.slug || gerarSlug(dados.nome), banco.pecas),
        criadoEm: new Date().toISOString(),
      };
      // a primeira peça já entra como destaque
      if (!banco.pecas.some((p) => p.destaque)) peca.destaque = true;
      else if (peca.destaque) banco.pecas.forEach((p) => (p.destaque = false));

      banco.pecas.push(peca);
      await gravar(banco);
      return peca;
    },

    async atualizarPeca(id, dados) {
      const banco = await ler();
      const i = banco.pecas.findIndex((p) => p.id === id);
      if (i < 0) throw new Error("Peça não encontrada.");

      const atual = banco.pecas[i];
      const slug = dados.nome || dados.slug
        ? slugUnico(dados.slug || gerarSlug(dados.nome ?? atual.nome), banco.pecas, id)
        : atual.slug;

      if (dados.destaque) banco.pecas.forEach((p) => (p.destaque = false));
      banco.pecas[i] = { ...atual, ...dados, slug, id };
      await gravar(banco);
      return banco.pecas[i];
    },

    async removerPeca(id) {
      const banco = await ler();
      banco.pecas = banco.pecas.filter((p) => p.id !== id);
      // nunca deixa a vitrine sem peça de destaque
      if (banco.pecas.length && !banco.pecas.some((p) => p.destaque)) {
        banco.pecas.sort(porOrdem)[0].destaque = true;
      }
      await gravar(banco);
    },

    async definirDestaque(id) {
      const banco = await ler();
      banco.pecas.forEach((p) => (p.destaque = p.id === id));
      await gravar(banco);
    },

    async config() {
      return (await ler()).config;
    },

    async salvarConfig(dados) {
      const banco = await ler();
      banco.config = dados;
      await gravar(banco);
    },
  };
}
