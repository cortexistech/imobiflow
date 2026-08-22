import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/shell";
import { PLAN_LIMITS } from "@/lib/constants";

export const metadata = { title: "Planos" };

export default function PricingPage() {
  return (
    <div className="flex min-h-full flex-col">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-field">
          Preçário
        </p>
        <h1 className="mt-3 font-display text-5xl font-extrabold">Três ritmos de crescimento.</h1>
        <p className="mt-4 max-w-xl text-slate">
          Comece com três corretores no subdomínio. Passe a domínio próprio quando a
          marca precisar de existir fora do ImobiFlow.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(Object.keys(PLAN_LIMITS) as Array<keyof typeof PLAN_LIMITS>).map((key) => {
            const plan = PLAN_LIMITS[key];
            const featured = key === "PRO";
            return (
              <article
                key={key}
                className={featured ? "bg-ink p-6 text-paper" : "surface p-6"}
              >
                {featured ? <div className="tape-bar-thin -mx-6 -mt-6 mb-6" /> : null}
                <h2 className="font-display text-2xl font-bold">{plan.label}</h2>
                <p className="mt-2 font-display text-4xl font-extrabold">
                  {plan.price}
                  <span className="text-base font-medium opacity-60">/mês</span>
                </p>
                <p className="mt-4 text-sm opacity-80">
                  {Number.isFinite(plan.agents) ? `${plan.agents} corretores` : "Ilimitado"} ·{" "}
                  {Number.isFinite(plan.properties) ? `${plan.properties} imóveis` : "imóveis ilimitados"}
                </p>
                <Link
                  href="/register"
                  className={
                    featured
                      ? "mt-6 inline-block text-sm font-semibold text-survey"
                      : "mt-6 inline-block text-sm font-semibold text-field"
                  }
                >
                  Criar conta {plan.label}
                </Link>
              </article>
            );
          })}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
