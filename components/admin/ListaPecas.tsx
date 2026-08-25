"use client";

import Image from "next/image";
import { useActionState, useState } from "react";

import FormPeca from "@/components/admin/FormPeca";
import ModalPeca from "@/components/admin/ModalPeca";
import {
  acaoDestacarPeca,
  acaoRemoverPeca,
  acaoSalvarPeca,
  type Resposta,
} from "@/app/admin/acoes";
import { brl } from "@/lib/formato";
import { coresAtivas, precoEfetivo, type Peca } from "@/lib/types";

const FORM = "form-peca";

/**
 * A lista de peças do painel.
 *
 * Separa estado de ação: o que a peça É (no topo da home, oculta) aparece como
 * etiqueta; o que se FAZ com ela (editar, destacar, remover) aparece como
 * texto. Assim o lojista não clica em "Oculta" achando que vai ocultar.
 */
export default function ListaPecas({ pecas }: { pecas: Peca[] }) {
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-areia">
          {pecas.length === 1
            ? "1 peça cadastrada."
            : `${pecas.length} peças cadastradas.`}{" "}
          A marcada como destaque abre a home.
        </p>
        <button
          type="button"
          onClick={() => setAberto("nova")}
          className="btn btn-ouro"
        >
          Nova peça
        </button>
      </div>

      <ul className="mt-8 divide-y divide-ouro/12 border-y border-ouro/12">
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
                  <h3 className="marca text-sm text-creme">{peca.nome}</h3>
                  {peca.destaque && (
                    <span className="selo-painel">No topo</span>
                  )}
                  {!peca.ativo && <span className="selo-painel">Oculta</span>}
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

                {pecas.length > 1 && (
                  <form
                    action={acaoRemoverPeca}
                    onSubmit={(e) => {
                      if (
                        !confirm(
                          `Remover "${peca.nome}" de vez? Isso não tem volta.`,
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={peca.id} />
                    <button type="submit" className="acao acao-risco">
                      Remover
                    </button>
                  </form>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <ModalPeca
        aberto={aberto !== null}
        titulo={emEdicao ? emEdicao.nome : "Nova peça"}
        descricao={
          emEdicao
            ? "As mudanças aparecem na vitrine ao salvar."
            : "Uma peça precisa de nome e de pelo menos uma cor com foto."
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
              {enviando ? "Salvando…" : emEdicao ? "Salvar peça" : "Criar peça"}
            </button>
            <button
              type="button"
              onClick={() => setAberto(null)}
              className="acao"
            >
              Cancelar
            </button>
            {estado?.mensagem && !estado.ok && (
              <span className="text-xs text-[#d98a6a]">{estado.mensagem}</span>
            )}
          </>
        }
      >
        {aberto !== null && (
          // a key remonta o formulário ao trocar de peça, zerando os campos
          <FormPeca
            key={emEdicao?.id ?? "nova"}
            peca={emEdicao}
            idFormulario={FORM}
            acao={acao}
            estado={estado}
          />
        )}
      </ModalPeca>
    </>
  );
}
