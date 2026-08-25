import { site } from "@/data/site.config";
import { brl } from "@/lib/formato";
import { precoEfetivo, type Peca } from "@/lib/types";

/** O WhatsApp engasga com travessão e espaço não-quebrável. */
function limpar(texto: string): string {
  return texto.replace(/[—–]/g, "-").replace(/ /g, " ").replace(/ /g, " ");
}

/** A URL canônica da peça — é o que o WhatsApp usa para montar a prévia. */
export function urlPeca(peca: Peca): string {
  return `${site.url}/p/${peca.slug}`;
}

export function waLink(mensagem: string, numero: string = site.whatsapp): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(limpar(mensagem))}`;
}

export function waGeral(numero?: string): string {
  return waLink(
    [
      `Olá! Vim pelo site da *${site.nome}*.`,
      "Gostaria de saber mais sobre as camisetas.",
    ].join("\n"),
    numero,
  );
}

export function waPeca(
  peca: Peca,
  opcoes?: { cor?: string; tamanho?: string; numero?: string },
): string {
  const linhas = [`Olá! Quero a *${peca.nome}*.`];
  if (opcoes?.cor) linhas.push(`*COR* ${opcoes.cor}`);
  if (opcoes?.tamanho) linhas.push(`*TAMANHO* ${opcoes.tamanho}`);

  const valor = precoEfetivo(peca);
  if (valor != null) linhas.push(`*PREÇO* ${brl(valor)}`);
  linhas.push(`*TECIDO* ${peca.composicao} ${peca.gramatura}`);
  linhas.push("", urlPeca(peca));

  return waLink(linhas.join("\n"), opcoes?.numero);
}
