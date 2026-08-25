"use client";

import { acaoRemoverPeca } from "@/app/admin/acoes";

/** Remoção é definitiva, então pergunta antes — e diz o nome do que vai sumir. */
export default function BotaoRemover({
  id,
  nome,
}: {
  id: string;
  nome: string;
}) {
  return (
    <form
      action={acaoRemoverPeca}
      onSubmit={(e) => {
        if (!confirm(`Remover "${nome}" de vez? Isso não tem volta.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="acao acao-risco">
        Remover
      </button>
    </form>
  );
}
