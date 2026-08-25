/**
 * Preparo da foto no navegador, antes de subir.
 *
 * O lojista cadastra pelo celular, onde a foto sai com 4000px e 6 MB. Converter
 * para WebP com 1400px de largura aqui economiza o upload inteiro e dispensa
 * qualquer dependência — é canvas puro.
 */
const LARGURA_MAX = 1400;
const QUALIDADE = 0.82;

export async function prepararFoto(arquivo: File): Promise<File> {
  // AVIF e formatos exóticos: manda como veio, o servidor valida.
  if (!/^image\/(jpeg|png|webp)$/.test(arquivo.type)) return arquivo;

  const bitmap = await createImageBitmap(arquivo);
  const escala = Math.min(1, LARGURA_MAX / bitmap.width);

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);

  const ctx = canvas.getContext("2d");
  if (!ctx) return arquivo;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolver) =>
    canvas.toBlob(resolver, "image/webp", QUALIDADE),
  );
  if (!blob || blob.size >= arquivo.size) return arquivo;

  return new File([blob], arquivo.name.replace(/\.\w+$/, "") + ".webp", {
    type: "image/webp",
  });
}

/**
 * A cor média dos pixels centrais da foto, para sugerir o campo de fundo do
 * hero. Chuta claro de propósito: o campo é o fundo atrás da peça, não a cor
 * do tecido. O lojista ajusta na mão se não gostar.
 */
export async function sugerirCampo(arquivo: File): Promise<string> {
  const bitmap = await createImageBitmap(arquivo);
  const canvas = document.createElement("canvas");
  canvas.width = 40;
  canvas.height = 40;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return "#e8e3d8";
  ctx.drawImage(bitmap, 0, 0, 40, 40);
  bitmap.close();

  const { data } = ctx.getImageData(10, 10, 20, 20);
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 8) continue; // ignora o que é transparente
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n++;
  }
  if (!n) return "#e8e3d8";

  // clareia bastante: vira campo de fundo, não amostra de cor
  const claro = (c: number) => Math.round(c / n + (255 - c / n) * 0.72);
  return (
    "#" +
    [claro(r), claro(g), claro(b)]
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")
  );
}
