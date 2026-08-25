import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const TIPOS: Record<string, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/avif": "avif",
};

const TETO = 12 * 1024 * 1024;

/**
 * Grava a foto em `public/uploads/` e devolve o caminho público.
 *
 * ATENÇÃO: escreve em disco. Funciona em `next dev` e num servidor próprio,
 * mas NÃO na Vercel — lá o sistema de arquivos é efêmero e o arquivo some no
 * próximo deploy. Quando a loja subir para a Vercel, este é o ponto que troca
 * pelo Storage do Supabase; nada mais precisa mudar.
 */
export async function salvarFoto(arquivo: File): Promise<string> {
  const ext = TIPOS[arquivo.type];
  if (!ext) {
    throw new Error("Formato não aceito. Use JPG, PNG, WebP ou AVIF.");
  }
  if (arquivo.size > TETO) {
    throw new Error("Foto acima de 12 MB.");
  }

  const nome = `${randomUUID()}.${ext}`;
  const pasta = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(pasta, { recursive: true });
  await fs.writeFile(
    path.join(pasta, nome),
    Buffer.from(await arquivo.arrayBuffer()),
  );

  return `/uploads/${nome}`;
}
