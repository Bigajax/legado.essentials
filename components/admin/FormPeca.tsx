"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";

import { acaoEnviarFoto, type Resposta } from "@/app/admin/acoes";
import { prepararFoto, sugerirCampo } from "@/lib/imagem";
import { gerarSlug } from "@/lib/slug";
import type { Cor, Peca } from "@/lib/types";

const TAMANHOS = ["PP", "P", "M", "G", "GG", "XG"];

const CAMPO_PADRAO = "#e8e3d8";

function corVazia(ordem: number): Cor {
  return {
    slug: `cor-${ordem}-${Math.random().toString(36).slice(2, 7)}`,
    nome: "",
    hex: "#1f1f1f",
    campo: CAMPO_PADRAO,
    foto: "",
    alt: "",
    ativa: true,
    ordem,
  };
}

/**
 * O formulário da peça, igual para criar e para editar.
 *
 * Quem decide é o `id` oculto: vazio, a action cria; preenchido, atualiza.
 * O `useActionState` mora na lista, não aqui — assim o botão de salvar, que
 * fica no rodapé do modal e fora do `<form>`, consegue mostrar "Salvando…".
 */
export default function FormPeca({
  peca,
  idFormulario,
  acao,
  estado,
}: {
  peca: Peca | null;
  idFormulario: string;
  acao: (dados: FormData) => void;
  estado: Resposta | null;
}) {

  const [tamanhos, setTamanhos] = useState<string[]>(
    peca?.tamanhos ?? ["P", "M", "G", "GG"],
  );
  const [cores, setCores] = useState<Cor[]>(peca?.cores ?? [corVazia(1)]);

  const mexerCor = (slug: string, mudanca: Partial<Cor>) =>
    setCores((atual) =>
      atual.map((c) => (c.slug === slug ? { ...c, ...mudanca } : c)),
    );

  return (
    <form id={idFormulario} action={acao} className="space-y-10">
      <input type="hidden" name="id" value={peca?.id ?? ""} />
      <input type="hidden" name="slug" value={peca?.slug ?? ""} />
      <input type="hidden" name="ordem" value={peca?.ordem ?? 99} />
      <input type="hidden" name="tamanhos" value={tamanhos.join(",")} />
      <input
        type="hidden"
        name="cores"
        // nome, ordem e alt são normalizados na action, que já sabe o nome
        // definitivo da peça — aqui a peça nova ainda não tem nome nenhum
        value={JSON.stringify(
          cores.map((c, i) => ({
            ...c,
            slug: gerarSlug(c.nome) || c.slug || `cor-${i + 1}`,
          })),
        )}
      />

      {/* a peça ---------------------------------------------------------- */}
      <section className="space-y-5">
        <div>
          <label htmlFor={`${idFormulario}-nome`} className="rotulo mb-2 block">
            Nome da peça *
          </label>
          <input
            id={`${idFormulario}-nome`}
            name="nome"
            required
            defaultValue={peca?.nome ?? ""}
            placeholder="Camiseta Essential"
            className="campo"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="rotulo mb-2 block" htmlFor={`${idFormulario}-tecido`}>
              Tecido
            </label>
            <input
              id={`${idFormulario}-tecido`}
              name="composicao"
              defaultValue={peca?.composicao ?? ""}
              placeholder="Interlock Pima"
              className="campo"
            />
          </div>
          <div>
            <label className="rotulo mb-2 block" htmlFor={`${idFormulario}-gram`}>
              Gramatura
            </label>
            <input
              id={`${idFormulario}-gram`}
              name="gramatura"
              defaultValue={peca?.gramatura ?? ""}
              placeholder="215 g/m²"
              className="campo"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="rotulo mb-2 block" htmlFor={`${idFormulario}-preco`}>
              Preço
            </label>
            <input
              id={`${idFormulario}-preco`}
              name="preco"
              inputMode="decimal"
              defaultValue={peca?.preco ?? ""}
              placeholder="149,90"
              className="campo"
            />
            <p className="mt-2 text-xs text-areia">
              Em branco = &quot;Consulte&quot; na vitrine.
            </p>
          </div>
          <div>
            <label className="rotulo mb-2 block" htmlFor={`${idFormulario}-promo`}>
              Preço promocional
            </label>
            <input
              id={`${idFormulario}-promo`}
              name="precoPromocional"
              inputMode="decimal"
              defaultValue={peca?.precoPromocional ?? ""}
              placeholder="119,90"
              className="campo"
            />
          </div>
        </div>

        <div>
          <label className="rotulo mb-2 block" htmlFor={`${idFormulario}-desc`}>
            Descrição
          </label>
          <textarea
            id={`${idFormulario}-desc`}
            name="descricao"
            rows={4}
            defaultValue={peca?.descricao ?? ""}
            className="campo resize-y"
          />
        </div>
      </section>

      {/* tamanhos -------------------------------------------------------- */}
      <section className="border-t border-carvao/10 pt-8">
        <span className="rotulo mb-4 block">Tamanhos</span>
        <div className="flex flex-wrap gap-2">
          {TAMANHOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() =>
                setTamanhos((a) =>
                  a.includes(t) ? a.filter((x) => x !== t) : [...a, t],
                )
              }
              data-on={tamanhos.includes(t)}
              aria-pressed={tamanhos.includes(t)}
              className="pill"
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* cores ----------------------------------------------------------- */}
      <section className="border-t border-carvao/10 pt-8">
        <span className="rotulo mb-1 block">Cores</span>
        <p className="mb-6 text-xs leading-relaxed text-areia">
          Desligar uma cor tira ela da vitrine sem apagar a foto. O fundo é o
          campo de cor que aparece atrás da peça no site.
        </p>

        <ul className="grid gap-5 sm:grid-cols-2">
          {cores.map((c, i) => (
            <li
              key={c.slug}
              className={`border p-3 transition-opacity ${
                c.ativa ? "border-ouro/45" : "border-carvao/12 opacity-50"
              }`}
            >
              <CampoFoto
                cor={c}
                aoTrocar={(mudanca) => mexerCor(c.slug, mudanca)}
              />

              <input
                type="text"
                value={c.nome}
                onChange={(e) => mexerCor(c.slug, { nome: e.target.value })}
                placeholder={`Cor ${i + 1}`}
                aria-label={`Nome da cor ${i + 1}`}
                className="campo mt-3 !py-1.5 text-xs"
              />

              <div className="mt-3 flex items-center gap-4">
                <label className="flex items-center gap-2 text-[0.6875rem] text-areia">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => mexerCor(c.slug, { hex: e.target.value })}
                    aria-label={`Amostra da cor ${i + 1}`}
                    className="h-6 w-8 cursor-pointer bg-transparent"
                  />
                  Tecido
                </label>
                <label className="flex items-center gap-2 text-[0.6875rem] text-areia">
                  <input
                    type="color"
                    value={c.campo}
                    onChange={(e) => mexerCor(c.slug, { campo: e.target.value })}
                    aria-label={`Fundo da cor ${i + 1}`}
                    className="h-6 w-8 cursor-pointer bg-transparent"
                  />
                  Fundo
                </label>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => mexerCor(c.slug, { ativa: !c.ativa })}
                  data-on={c.ativa}
                  aria-pressed={c.ativa}
                  className="pill flex-1"
                >
                  {c.ativa ? "Na vitrine" : "Oculta"}
                </button>
                {cores.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setCores((a) => a.filter((x) => x.slug !== c.slug))
                    }
                    className="acao acao-risco"
                  >
                    Remover
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setCores((a) => [...a, corVazia(a.length + 1)])}
          className="btn btn-linha mt-6"
        >
          Adicionar cor
        </button>
      </section>

      {/* publicação ------------------------------------------------------ */}
      <section className="flex flex-col gap-4 border-t border-carvao/10 pt-8">
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="ativo"
            defaultChecked={peca?.ativo ?? true}
            className="h-4 w-4 accent-[var(--ouro)]"
          />
          Peça visível na vitrine
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="destaque"
            defaultChecked={peca?.destaque ?? false}
            className="h-4 w-4 accent-[var(--ouro)]"
          />
          Peça do topo da home
          <span className="text-xs text-areia">(só uma por vez)</span>
        </label>
      </section>

      {estado?.mensagem && (
        <p
          role="status"
          className={`text-sm ${estado.ok ? "text-certo" : "text-aviso"}`}
        >
          {estado.mensagem}
        </p>
      )}
    </form>
  );
}

/**
 * A foto de uma cor. Reduz no navegador, sobe, e chuta o campo de fundo a
 * partir da própria imagem — é o passo que o lojista mais erraria sozinho.
 */
function CampoFoto({
  cor,
  aoTrocar,
}: {
  cor: Cor;
  aoTrocar: (mudanca: Partial<Cor>) => void;
}) {
  const entrada = useRef<HTMLInputElement>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [subindo, iniciar] = useTransition();

  const escolher = (arquivo: File | undefined) => {
    if (!arquivo) return;
    setErro(null);
    iniciar(async () => {
      try {
        const pronta = await prepararFoto(arquivo);
        const dados = new FormData();
        dados.set("foto", pronta);

        const [r, campo] = await Promise.all([
          acaoEnviarFoto(dados),
          cor.campo === CAMPO_PADRAO
            ? sugerirCampo(pronta)
            : Promise.resolve(cor.campo),
        ]);

        if (!r.ok || !r.url) {
          setErro(r.mensagem ?? "Não foi possível subir a foto.");
          return;
        }
        aoTrocar({ foto: r.url, campo });
      } catch {
        setErro("Não foi possível ler a foto.");
      }
    });
  };

  return (
    <div>
      <div
        className="relative aspect-5/4"
        style={{ background: cor.campo || "#e8e3d8" }}
      >
        {cor.foto ? (
          <Image
            src={cor.foto}
            alt=""
            aria-hidden
            fill
            sizes="240px"
            className="object-contain p-2"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-[0.6875rem] tracking-[0.18em] text-carvao/45 uppercase">
            Sem foto
          </span>
        )}

        <button
          type="button"
          onClick={() => entrada.current?.click()}
          disabled={subindo}
          className="absolute inset-0 grid place-items-center bg-carvao/0 text-[0.6875rem] tracking-[0.18em] text-transparent uppercase transition-colors hover:bg-carvao/70 hover:text-creme disabled:cursor-progress"
        >
          {subindo ? "" : cor.foto ? "Trocar foto" : "Escolher foto"}
        </button>

        {subindo && (
          <span className="absolute inset-0 grid place-items-center bg-carvao/70 text-[0.6875rem] tracking-[0.18em] text-creme uppercase">
            Subindo…
          </span>
        )}
      </div>

      <input
        ref={entrada}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={(e) => escolher(e.target.files?.[0])}
        className="hidden"
      />

      {erro && <p className="mt-2 text-[0.6875rem] text-aviso">{erro}</p>}
    </div>
  );
}
