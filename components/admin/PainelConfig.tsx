"use client";

import { useActionState } from "react";
import { acaoSalvarConfig, type Resposta } from "@/app/admin/acoes";
import type { Config } from "@/lib/types";

export default function PainelConfig({ config }: { config: Config }) {
  const [estado, acao, enviando] = useActionState<Resposta | null, FormData>(
    acaoSalvarConfig,
    null,
  );

  return (
    <form action={acao} className="space-y-6">
      <div>
        <label htmlFor="whatsapp" className="rotulo mb-2 block">
          WhatsApp
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          defaultValue={config.whatsapp}
          placeholder="5551900000000"
          className="campo"
        />
        <p className="mt-2 text-xs text-areia">
          Só números, com DDI e DDD. É para onde vão todos os botões da vitrine.
        </p>
      </div>

      <div>
        <label htmlFor="instagram" className="rotulo mb-2 block">
          Instagram
        </label>
        <input
          id="instagram"
          name="instagram"
          defaultValue={config.instagram}
          className="campo"
        />
      </div>

      <div>
        <label htmlFor="prazo" className="rotulo mb-2 block">
          Prazo de envio
        </label>
        <input
          id="prazo"
          name="prazo"
          defaultValue={config.prazo}
          className="campo"
        />
      </div>

      <div>
        <label htmlFor="troca" className="rotulo mb-2 block">
          Política de troca
        </label>
        <input
          id="troca"
          name="troca"
          defaultValue={config.troca}
          className="campo"
        />
      </div>

      {estado?.mensagem && (
        <p
          role="status"
          className={`text-sm ${estado.ok ? "text-ouro-claro" : "text-ouro"}`}
        >
          {estado.mensagem}
        </p>
      )}

      <button type="submit" disabled={enviando} className="btn btn-ouro">
        {enviando ? "Salvando…" : "Salvar dados da loja"}
      </button>
    </form>
  );
}
