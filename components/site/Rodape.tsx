import Logo from "@/components/marca/Logo";
import { site, textos } from "@/data/site.config";
import { waGeral } from "@/lib/whatsapp";
import type { Config } from "@/lib/types";

export default function Rodape({ config }: { config: Config }) {
  const numero = config.whatsapp || site.whatsapp;

  return (
    <footer className="bg-carvao text-creme">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
          <div>
            <Logo altura={132} />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-creme/65">
              {textos.rodapeLinha}
            </p>
            <a
              href={waGeral(numero)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-claro mt-8"
            >
              Falar no WhatsApp
            </a>
          </div>

          <div>
            <p className="rotulo !text-ouro-claro">Entrega e troca</p>
            <p className="mt-5 text-sm leading-relaxed text-areia">
              {config.prazo}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-areia">
              {config.troca}
            </p>
          </div>

          <div>
            <p className="rotulo !text-ouro-claro">A marca</p>
            <ul className="mt-5 space-y-2 text-sm">
              <li>
                <a
                  href={config.instagram || site.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-creme/70 transition-colors hover:text-ouro-claro"
                >
                  Instagram {site.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={site.criadorUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-creme/70 transition-colors hover:text-ouro-claro"
                >
                  Criada por {site.criador}
                </a>
              </li>
              <li className="pt-2 text-areia">
                {site.fundacao} · {site.origem}
              </li>
            </ul>
          </div>
        </div>

        <hr className="filete mt-16" />

        <div className="mt-8 flex flex-col gap-3 text-xs text-creme/40 md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} {site.nome} {site.sufixo}. {site.slogan}
          </span>
          <span>O pedido é fechado no WhatsApp.</span>
        </div>
      </div>
    </footer>
  );
}
