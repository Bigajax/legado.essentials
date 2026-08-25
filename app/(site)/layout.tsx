import Cabecalho from "@/components/site/Cabecalho";
import Rodape from "@/components/site/Rodape";
import { repo } from "@/lib/repo";
import { site } from "@/data/site.config";

export const revalidate = 60;

export default async function LayoutSite({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await repo().config();

  return (
    <>
      <Cabecalho numero={config.whatsapp || site.whatsapp} />
      <main>{children}</main>
      <Rodape config={config} />
    </>
  );
}
