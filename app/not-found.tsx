import Link from "next/link";
import Logo from "@/components/marca/Logo";

export default function NaoEncontrado() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Logo altura={140} />
      <p className="display mt-10 text-7xl text-ouro">404</p>
      <h1 className="display mt-4 text-3xl">Esta página não existe.</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-areia">
        O endereço mudou ou nunca esteve aqui.
      </p>
      <Link href="/" className="btn btn-ouro mt-10">
        Voltar ao início
      </Link>
    </div>
  );
}
