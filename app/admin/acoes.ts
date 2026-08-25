"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { repo } from "@/lib/repo";
import { entrar, exigirAdmin, sair } from "@/lib/auth";
import { ligado, paraLista, paraNumero } from "@/lib/formato";
import { salvarFoto } from "@/lib/upload";
import type { Cor } from "@/lib/types";

export type Resposta = { ok: boolean; mensagem?: string };

function comoResposta(e: unknown): Resposta {
  return {
    ok: false,
    mensagem:
      e instanceof Error ? e.message : "Não foi possível salvar. Tente de novo.",
  };
}

// ---------------------------------------------------------------- sessão

export async function acaoEntrar(
  _anterior: Resposta | null,
  dados: FormData,
): Promise<Resposta> {
  const senha = String(dados.get("senha") ?? "");
  if (!senha) return { ok: false, mensagem: "Informe a senha." };
  if (!(await entrar(senha))) return { ok: false, mensagem: "Senha incorreta." };
  redirect("/admin");
}

export async function acaoSair(): Promise<void> {
  await sair();
  redirect("/admin/entrar");
}

// ------------------------------------------------------------------ peça

/**
 * Cria ou atualiza. O que decide é o campo oculto `id`: vazio = peça nova.
 * Uma action só para os dois casos porque o formulário é o mesmo.
 *
 * Não redireciona: quem chama é um modal, que fecha sozinho quando a resposta
 * vem `ok`. A lista atrás dele se atualiza pelo `revalidatePath`.
 */
export async function acaoSalvarPeca(
  _anterior: Resposta | null,
  dados: FormData,
): Promise<Resposta> {
  let criou = false;

  try {
    await exigirAdmin();

    const id = String(dados.get("id") ?? "").trim();

    const nome = String(dados.get("nome") ?? "").trim();
    if (!nome) return { ok: false, mensagem: "Dê um nome para a peça." };

    const preco = paraNumero(dados.get("preco"));
    const promo = paraNumero(dados.get("precoPromocional"));
    if (promo != null && preco != null && promo >= preco) {
      return {
        ok: false,
        mensagem: "O preço promocional precisa ser menor que o preço cheio.",
      };
    }

    let cores: Cor[] = [];
    try {
      const cru = JSON.parse(String(dados.get("cores") ?? "[]"));
      if (Array.isArray(cru)) cores = cru as Cor[];
    } catch {
      cores = [];
    }
    if (!cores.length) {
      return { ok: false, mensagem: "A peça precisa de pelo menos uma cor." };
    }

    // O alt e a ordem são derivados aqui, e não no formulário: numa peça nova
    // o nome ainda não existia quando os campos de cor foram montados.
    cores = cores.map((c, i) => {
      const nomeCor = String(c.nome ?? "").trim() || `Cor ${i + 1}`;
      return {
        ...c,
        nome: nomeCor,
        ordem: i + 1,
        alt: `${nome} na cor ${nomeCor.toLowerCase()}, vista de frente`,
      };
    });

    const ativas = cores.filter((c) => c.ativa);
    if (!ativas.length) {
      return { ok: false, mensagem: "Deixe pelo menos uma cor ativa." };
    }
    // sem foto o next/image quebra a vitrine inteira — barra aqui
    const semFoto = ativas.find((c) => !c.foto);
    if (semFoto) {
      return {
        ok: false,
        mensagem: `A cor "${semFoto.nome}" está sem foto. Escolha uma ou deixe a cor oculta.`,
      };
    }

    const campos = {
      nome,
      slug: String(dados.get("slug") ?? "").trim(),
      descricao: String(dados.get("descricao") ?? "").trim(),
      composicao: String(dados.get("composicao") ?? "").trim(),
      gramatura: String(dados.get("gramatura") ?? "").trim(),
      preco,
      precoPromocional: promo,
      tamanhos: paraLista(dados.get("tamanhos")),
      cores,
      destaque: ligado(dados.get("destaque")),
      ativo: ligado(dados.get("ativo")),
      ordem: paraNumero(dados.get("ordem")) ?? 99,
    };

    if (id) {
      await repo().atualizarPeca(id, campos);
    } else {
      await repo().criarPeca(campos);
      criou = true;
    }

    revalidatePath("/", "layout");
  } catch (e) {
    return comoResposta(e);
  }

  return { ok: true, mensagem: criou ? "Peça criada." : "Peça salva." };
}

/** Remove de vez. O botão confirma antes de chamar. */
export async function acaoRemoverPeca(dados: FormData): Promise<void> {
  await exigirAdmin();
  const id = String(dados.get("id") ?? "").trim();
  if (id) await repo().removerPeca(id);
  revalidatePath("/", "layout");
}

/** Sobe a peça para o hero da home. */
export async function acaoDestacarPeca(dados: FormData): Promise<void> {
  await exigirAdmin();
  const id = String(dados.get("id") ?? "").trim();
  if (id) await repo().definirDestaque(id);
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------- config

export async function acaoSalvarConfig(
  _anterior: Resposta | null,
  dados: FormData,
): Promise<Resposta> {
  try {
    await exigirAdmin();

    const whatsapp = String(dados.get("whatsapp") ?? "").replace(/\D/g, "");
    if (whatsapp && whatsapp.length < 12) {
      return {
        ok: false,
        mensagem:
          "WhatsApp incompleto. Use DDI + DDD + número (ex.: 5551989431465).",
      };
    }

    await repo().salvarConfig({
      whatsapp,
      instagram: String(dados.get("instagram") ?? "").trim(),
      prazo: String(dados.get("prazo") ?? "").trim(),
      troca: String(dados.get("troca") ?? "").trim(),
    });

    revalidatePath("/", "layout");
    return { ok: true, mensagem: "Dados da loja salvos." };
  } catch (e) {
    return comoResposta(e);
  }
}

// ----------------------------------------------------------------- fotos

export type RespostaFoto = { ok: boolean; url?: string; mensagem?: string };

/** Recebe a foto já reduzida pelo navegador e devolve o caminho público. */
export async function acaoEnviarFoto(dados: FormData): Promise<RespostaFoto> {
  try {
    await exigirAdmin();
    const arquivo = dados.get("foto");
    if (!(arquivo instanceof File) || !arquivo.size) {
      return { ok: false, mensagem: "Escolha uma foto." };
    }
    return { ok: true, url: await salvarFoto(arquivo) };
  } catch (e) {
    return comoResposta(e);
  }
}
