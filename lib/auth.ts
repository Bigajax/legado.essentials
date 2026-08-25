import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE = "lgd_sessao";
const DIAS = 7;

/** Variável declarada sem valor chega como "" e passaria pelo `??`. */
function preenchida(valor: string | undefined): string | null {
  const limpo = valor?.trim();
  return limpo ? limpo : null;
}

function segredo(): string {
  return (
    preenchida(process.env.ADMIN_SEGREDO) ??
    preenchida(process.env.ADMIN_SENHA) ??
    "legado-dev-nao-use-em-producao"
  );
}

function senhaLocal(): string {
  return preenchida(process.env.ADMIN_SENHA) ?? "legado";
}

function assinar(payload: string): string {
  return createHmac("sha256", segredo()).update(payload).digest("base64url");
}

function tokenValido(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, assinatura] = token.split(".");
  if (!payload || !assinatura) return false;

  const esperada = Buffer.from(assinar(payload));
  const recebida = Buffer.from(assinatura);
  if (esperada.length !== recebida.length) return false;
  if (!timingSafeEqual(esperada, recebida)) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export async function estaAutenticado(): Promise<boolean> {
  const jar = await cookies();
  return tokenValido(jar.get(COOKIE)?.value);
}

/** Para Server Actions: lança se não estiver autenticado. */
export async function exigirAdmin(): Promise<void> {
  if (!(await estaAutenticado())) {
    throw new Error("Sessão expirada. Entre novamente.");
  }
}

/** Para layouts: redireciona em vez de lançar. */
export async function protegerPagina(): Promise<void> {
  if (!(await estaAutenticado())) redirect("/admin/entrar");
}

export async function entrar(senha: string): Promise<boolean> {
  const esperada = Buffer.from(senhaLocal());
  const recebida = Buffer.from(senha);
  if (esperada.length !== recebida.length) return false;
  if (!timingSafeEqual(esperada, recebida)) return false;

  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + DIAS * 86_400_000 }),
  ).toString("base64url");

  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${assinar(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DIAS * 86_400,
  });
  return true;
}

export async function sair(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
