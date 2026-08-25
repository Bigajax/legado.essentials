import PainelConfig from "@/components/admin/PainelConfig";
import { repo } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function PainelLoja() {
  const config = await repo().config();

  return (
    <>
      <h1 className="display text-4xl">Dados da loja</h1>
      <p className="mt-2 mb-10 max-w-md text-sm text-areia">
        Aparecem no rodapé da vitrine e mandam em todos os botões de WhatsApp
        do site.
      </p>

      <div className="max-w-lg">
        <PainelConfig config={config} />
      </div>
    </>
  );
}
