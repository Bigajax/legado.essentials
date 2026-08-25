import GerenciadorPecas from "@/components/admin/GerenciadorPecas";
import { repo } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function PainelPecas() {
  const pecas = await repo().listarTodas();

  return <GerenciadorPecas pecas={pecas} />;
}
