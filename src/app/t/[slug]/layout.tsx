import { notFound } from "next/navigation";
import Link from "next/link";
import { BrandMark } from "@/components/brand/logo";
import { resolveTenant } from "@/lib/tenant";

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tenant = await resolveTenant(slug);
  if (!tenant) notFound();

  return (
    <div
      className="flex min-h-full flex-col bg-paper"
      style={{ ["--field" as string]: tenant.brandColor }}
    >
      <div className="tape-bar" />
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href={`/t/${tenant.slug}`} className="flex items-center gap-3">
            {tenant.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tenant.logoUrl} alt="" className="h-9 w-auto" />
            ) : (
              <BrandMark />
            )}
            <span className="grid leading-none">
              <span className="font-display text-lg font-extrabold tracking-tight">
                {tenant.name}
              </span>
              <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-slate">
                vitrine
              </span>
            </span>
          </Link>
          {tenant.phone ? (
            <a href={`tel:${tenant.phone}`} className="text-sm font-semibold text-field">
              {tenant.phone}
            </a>
          ) : null}
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-ink/10 bg-ink px-4 py-6 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50">
        Vitrine {tenant.name} · caderneta ImobiFlow
      </footer>
    </div>
  );
}
