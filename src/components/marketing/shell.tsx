import Link from "next/link";
import { Logo, TapeBar } from "@/components/brand/logo";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-20 bg-paper/95 backdrop-blur">
      <TapeBar />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/">
          <Logo caption="caderneta de campo" />
        </Link>
        <nav className="flex items-center gap-5 text-sm font-semibold">
          <Link href="/pricing" className="hidden hover:text-field sm:inline">
            Planos
          </Link>
          <Link href="/t/atlantica" className="hidden hover:text-field sm:inline">
            Vitrine demo
          </Link>
          <Link href="/login" className="hover:text-field">
            Entrar
          </Link>
          <Link
            href="/register"
            className="bg-field px-3.5 py-2 text-on-field hover:bg-field-deep"
          >
            Abrir imobiliária
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="mt-auto">
      <TapeBar thin />
      <div className="bg-ink px-4 py-10 text-sm text-paper/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Logo inverted caption="imobiliário · no terreno" />
          <p className="max-w-sm text-right">
            Corretores no terreno. Imóveis no ar. Leads no WhatsApp.
          </p>
        </div>
      </div>
    </footer>
  );
}
