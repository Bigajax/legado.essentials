"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Modal em `<dialog>` nativo: foco preso, Esc e backdrop vêm de graça, sem
 * uma linha de JavaScript de acessibilidade escrita à mão.
 */
export default function ModalPeca({
  aberto,
  titulo,
  descricao,
  aoFechar,
  rodape,
  children,
}: {
  aberto: boolean;
  titulo: string;
  descricao?: string;
  aoFechar: () => void;
  rodape?: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const corpo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;

    if (aberto && !dialogo.open) {
      dialogo.showModal();
      // reabrir para outra peça precisa começar do topo
      corpo.current?.scrollTo({ top: 0 });
      dialogo
        .querySelector<HTMLElement>("input, textarea, button")
        ?.focus({ preventScroll: true });
    } else if (!aberto && dialogo.open) {
      dialogo.close();
    }
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      onClose={aoFechar}
      onCancel={aoFechar}
      aria-label={titulo}
      className="dialogo m-auto"
    >
      <div className="flex max-h-[inherit] flex-col">
        <header className="flex items-start justify-between gap-6 border-b border-ouro/15 px-6 py-5">
          <div>
            <h2 className="display text-2xl text-creme">{titulo}</h2>
            {descricao && (
              <p className="mt-1 text-xs text-areia">{descricao}</p>
            )}
          </div>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="rotulo shrink-0 transition-colors hover:text-ouro"
          >
            Fechar
          </button>
        </header>

        <div ref={corpo} className="min-h-0 flex-1 overflow-y-auto px-6 py-7">
          {children}
        </div>

        {rodape && (
          <footer className="flex flex-wrap items-center gap-4 border-t border-ouro/15 px-6 py-4">
            {rodape}
          </footer>
        )}
      </div>
    </dialog>
  );
}
