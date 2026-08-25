/**
 * A faixa rotativa.
 *
 * Uma pista só, lenta, com o losango dourado separando as frases. Roda em CSS
 * puro: a trilha tem duas cópias idênticas da lista e anda até -50%, então o
 * ponto de emenda nunca aparece. Para no hover e não se mexe quando o sistema
 * pede menos movimento.
 *
 * A cópia visível é `aria-hidden` e o texto real vai uma vez só para o leitor
 * de tela, senão ele lê tudo em dobro.
 */
export default function Faixa({ itens }: { itens: readonly string[] }) {
  const fila = (
    <ul className="faixa-fila">
      {itens.map((item) => (
        <li key={item} className="faixa-item">
          {item}
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
      <span className="sr-only">{itens.join(". ")}</span>
    </div>
  );
}
