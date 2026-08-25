type Item = { texto: string; voz: "caps" | "serifa" };

/**
 * A faixa rotativa.
 *
 * Uma pista só, lenta, com a árvore da marca separando as frases. Roda em CSS
 * puro: a trilha tem duas cópias idênticas da lista e anda até -50%, então o
 * ponto de emenda nunca aparece. Para no hover e não se mexe quando o sistema
 * pede menos movimento.
 *
 * A cópia visível é `aria-hidden` e o texto real vai uma vez só para o leitor
 * de tela, senão ele lê tudo em dobro.
 */
export default function Faixa({ itens }: { itens: readonly Item[] }) {
  const fila = (
    <ul className="faixa-fila">
      {itens.map((item) => (
        <li
          key={item.texto}
          className={item.voz === "serifa" ? "faixa-item faixa-serifa" : "faixa-item"}
        >
          {item.texto}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="faixa">
      <div className="faixa-trilho" aria-hidden>
        {fila}
        {fila}
      </div>
      <span className="sr-only">{itens.map((i) => i.texto).join(". ")}</span>
    </div>
  );
}
