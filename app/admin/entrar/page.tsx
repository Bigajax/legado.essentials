"use client";

import { useActionState } from "react";
import Logo from "@/components/marca/Logo";
import { acaoEntrar, type Resposta } from "@/app/admin/acoes";

export default function Entrar() {
  const [estado, acao, enviando] = useActionState<Resposta | null, FormData>(
    acaoEntrar,
    null,
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm text-center">
        <Logo altura={150} className="mx-auto" />

        <h1 className="display mt-10 text-3xl">Painel da marca</h1>
        <p className="mt-2 text-sm text-areia">
          Entre para editar as peças e os dados da loja.
        </p>

        <form action={acao} className="mt-10 space-y-4 text-left">
          <div>
            <label htmlFor="senha" className="rotulo mb-2 block">
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              className="campo"
            />
          </div>

          {estado?.mensagem && (
            <p role="alert" className="text-sm text-ouro">
              {estado.mensagem}
            </p>
          )}

          <button type="submit" disabled={enviando} className="btn btn-ouro w-full">
            {enviando ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
