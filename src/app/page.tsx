import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FlowPath } from "@/components/brand/flow-path";
import { FolioFrame } from "@/components/brand/logo";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/shell";
import { PLAN_LIMITS } from "@/lib/constants";
import { APP_PROMISE } from "@/lib/constants";

const pillars = [
  {
    ref: "01 · terreno",
    title: "Mobilidade no terreno",
    text: "O corretor fotografa, marca o pino no mapa e publica a carteira a partir do telemóvel.",
  },
  {
    ref: "02 · alerta",
    title: "Leads em tempo real",
    text: "Cada pedido de visita dispara no WhatsApp do responsável pelo imóvel — sem central de call-center.",
  },
  {
    ref: "03 · marca",
    title: "Gestão white-label",
    text: "A imobiliária aprova anúncios, gere a equipa e recebe os clientes no próprio domínio.",
  },
];

const mosaic = [
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
    label: "Lisboa · T3",
    price: "685 000 €",
  },
  {
    src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80",
    label: "Cascais · V4",
    price: "1 280 000 €",
  },
  {
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    label: "Porto · T2",
    price: "375 000 €",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    label: "Príncipe Real · Loft",
    price: "495 000 €",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <MarketingHeader />
      <main>
        <section className="bg-ink text-paper">
          <FolioFrame onInk className="mx-auto max-w-6xl px-4 pb-4 pt-16 sm:pt-20">
            <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="pb-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-survey">
                  Caderneta de campo · imobiliárias & corretores
                </p>
                <h1 className="mt-5 max-w-xl font-display text-[3.25rem] font-extrabold leading-[0.9] sm:text-7xl">
                  O fluxo do mercado, no terreno.
                </h1>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/70">
                  {APP_PROMISE}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/register"
                    className="bg-survey px-5 py-3 text-sm font-semibold text-on-survey"
                  >
                    Abrir a minha imobiliária
                  </Link>
                  <Link
                    href="/t/atlantica"
                    className="inline-flex items-center gap-1 border border-white/20 px-5 py-3 text-sm font-semibold text-paper hover:border-survey"
                  >
                    Percorrer a vitrine demo
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pb-6">
                {mosaic.map((item) => (
                  <figure key={item.label} className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt=""
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/80 to-transparent p-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-paper/80">
                        {item.label}
                      </span>
                      <span className="bg-survey px-1.5 py-0.5 font-mono text-[9px] font-semibold text-on-survey">
                        {item.price}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </FolioFrame>
          <FlowPath className="w-full opacity-90" />
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="surface p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">
                {pillar.ref}
              </p>
              <h2 className="mt-4 font-display text-2xl font-bold">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate">{pillar.text}</p>
            </article>
          ))}
        </section>

        <section className="border-y border-ink/10 bg-field-deep text-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-survey">
                Cada carteira, um mapa
              </p>
              <h2 className="mt-3 font-display text-4xl font-extrabold">
                A sua imobiliária no próprio domínio.
              </h2>
              <p className="mt-4 max-w-md text-paper/70">
                Subdomínio imobiliaria.imobiflow.app ou domínio próprio. O pedido
                chega à vitrine certa — as carteiras nunca se misturam.
              </p>
            </div>
            <div className="border border-survey/30 bg-ink p-6 font-mono text-xs leading-7 text-survey">
              matrícula · tenant isolado
              <br />
              cargos · gestão / corretor
              <br />
              anúncio · rascunho → pendente → publicado
              <br />
              lead · WhatsApp → telemóvel do responsável
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-field">
            Preçário
          </p>
          <h2 className="mt-2 font-display text-4xl font-extrabold">
            Três ritmos de crescimento.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {(Object.keys(PLAN_LIMITS) as Array<keyof typeof PLAN_LIMITS>).map((key) => {
              const plan = PLAN_LIMITS[key];
              const featured = key === "PRO";
              return (
                <article
                  key={key}
                  className={
                    featured
                      ? "flex flex-col bg-ink p-6 text-paper"
                      : "surface flex flex-col p-6"
                  }
                >
                  {featured ? <div className="tape-bar-thin -mx-6 -mt-6 mb-6" /> : null}
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">
                    {plan.label}
                  </p>
                  <p className="mt-2 font-display text-5xl font-extrabold">
                    {plan.price}
                    <span className="text-base font-medium opacity-60"> /mês</span>
                  </p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm opacity-80">
                    <li>
                      {Number.isFinite(plan.agents)
                        ? `Até ${plan.agents} corretores`
                        : "Corretores ilimitados"}
                    </li>
                    <li>
                      {Number.isFinite(plan.properties)
                        ? `${plan.properties} imóveis activos`
                        : "Imóveis ilimitados"}
                    </li>
                    <li>
                      {key === "STARTER"
                        ? "Subdomínio ImobiFlow e leads WhatsApp"
                        : key === "PRO"
                          ? "Domínio próprio, marca d'água e painel gestor"
                          : "XML para portais e suporte prioritário"}
                    </li>
                  </ul>
                  <Link
                    href="/register"
                    className={
                      featured
                        ? "mt-6 bg-survey px-4 py-2.5 text-center text-sm font-semibold text-on-survey"
                        : "mt-6 bg-field px-4 py-2.5 text-center text-sm font-semibold text-on-field"
                    }
                  >
                    Começar no {plan.label}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
