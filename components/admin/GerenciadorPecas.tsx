"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";

import FormPeca from "@/components/admin/FormPeca";
import Modal from "@/components/admin/Modal";
import BotaoRemover from "@/components/admin/BotaoRemover";
import {
  acaoDestacarPeca,
  acaoSalvarPeca,
  type Resposta,
} from "@/app/admin/acoes";
import { brl } from "@/lib/formato";
import { coresAtivas, precoEfetivo, type Peca } from "@/lib/types";

const FORM = "form-peca";

/**
 * A tela de peças do painel: a lista e o modal que cria e edita.
 *
 * Um modal só para os dois casos, porque o formulário é o mesmo — o que muda
 * é o `id` oculto. Criar e editar acontecem sem sair da lista, então a
 * lojista nunca perde de vista o que já tem no ar.
 *
 * A lista separa estado de ação: o que a peça É (no topo, oculta) aparece
 * como etiqueta; o que se FAZ com ela aparece como texto. Assim ninguém
 * clica em "Oculta" achando que vai ocultar.
 */
export default function GerenciadorPecas({ pecas }: { pecas: Peca[] }) {
  const [aberto, setAberto] = useState<Peca | "nova" | null>(null);
  const emEdicao = aberto === "nova" ? null : aberto;

  const [estado, acao, enviando] = useActionState<Resposta | null, FormData>(
    async (anterior, dados) => {
      const r = await acaoSalvarPeca(anterior, dados);
      if (r.ok) setAberto(null);
      return r;
    },
    null,
  );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="display text-4xl">As peças</h1>
          <p className="mt-2 max-w-md text-sm text-areia">
            Cada peça tem sua página na vitrine e seu botão de WhatsApp. A
            marcada como destaque abre a home.
          </p>
        </div>

        {pecas.length > 0 && (
          <button
            type="button"
            onClick={() => setAberto("nova")}
            className="btn btn-ouro"
          >
            Nova peça
          </button>
        )}
      </div>

      <div className="mt-10">
        {pecas.length === 0 ? (
          <div className="border border-carvao/12 px-6 py-16 text-center">
            <p className="text-sm text-areia">
              Nenhuma peça cadastrada ainda. Enquanto não houver nenhuma, a
              vitrine mostra um aviso de &quot;em breve&quot;.
            </p>
            <button
              type="button"
              onClick={() => setAberto("nova")}
              className="btn btn-ouro mt-8"
            >
              Cadastrar a primeira
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-carvao/10 border-y border-carvao/10">
            {pecas.map((peca) => {
              const cores = coresAtivas(peca);
              const capa = cores[0] ?? peca.cores[0];

              return (
                <li
                  key={peca.id}
                  className="flex flex-wrap items-center gap-5 py-5 md:flex-nowrap"
                >
                  <div
                    className="relative aspect-square w-20 shrink-0"
                    style={{ background: capa?.campo ?? "#e8e3d8" }}
                  >
                    {capa?.foto && (
                      <Image
                        src={capa.foto}
                        alt=""
                        aria-hidden
                        fill
                        sizes="80px"
                        className="object-contain p-1.5"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="marca text-sm text-carvao">{peca.nome}</h2>
                      {peca.destaque && (
                        <span className="selo-painel">No topo</span>
                      )}
                      {!peca.ativo && (
                        <span className="selo-painel">Oculta</span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-areia">
                      {brl(precoEfetivo(peca))} ·{" "}
                      {cores.length === 1 ? "1 cor" : `${cores.length} cores`} ·{" "}
                      {peca.tamanhos.join(" ")}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-5">
                    <button
                      type="button"
                      onClick={() => setAberto(peca)}
                      className="acao"
                    >
                      Editar
                    </button>

                    {!peca.destaque && (
                      <form action={acaoDestacarPeca}>
                        <input type="hidden" name="id" value={peca.id} />
                        <button type="submit" className="acao">
                          Pôr no topo
                        </button>
                      </form>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Modal
        aberto={aberto !== null}
        titulo={emEdicao ? emEdicao.nome : "Nova peça"}
        descricao={
          emEdicao
            ? "As mudanças aparecem na vitrine ao salvar."
            : "Precisa de nome e de pelo menos uma cor com foto. O resto dá para preencher depois."
        }
        aoFechar={() => setAberto(null)}
        rodape={
          <>
            <button
              type="submit"
              form={FORM}
              disabled={enviando}
              className="btn btn-ouro"
            >
              {enviando
                ? emEdicao
                  ? "Salvando…"
                  : "Criando…"
                : emEdicao
                  ? "Salvar peça"
                  : "Criar peça"}
            </button>

            <button
              type="button"
              onClick={() => setAberto(null)}
              className="acao"
            >
              Cancelar
            </button>

            {estado?.mensagem && !estado.ok && (
              <span role="status" className="text-xs text-aviso">
                {estado.mensagem}
              </span>
            )}

            {/* o que é da peça inteira, e não do formulário, fica na direita */}
            {emEdicao && (
              <span className="ml-auto flex items-center gap-5">
                <Link
                  href={`/p/${emEdicao.slug}`}
                  target="_blank"
                  className="acao"
                >
                  Ver na vitrine ↗
                </Link>
                {/* remover a última peça é permitido: a vitrine tem tela para
                    isso, e o painel também */}
                <BotaoRemover id={emEdicao.id} nome={emEdicao.nome} />
              </span>
            )}
          </>
        }
      >
        {/* a key remonta o formulário ao trocar de peça, zerando os campos */}
        {aberto !== null && (
          <FormPeca
            key={emEdicao?.id ?? "nova"}
            peca={emEdicao}
            idFormulario={FORM}
            acao={acao}
            estado={estado}
          />
        )}
      </Modal>
    </>
  );
}
