import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";
import { resolveTenant } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { SearchFilters } from "@/components/portal/search-filters";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyMap } from "@/components/map/property-map";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tenant = await resolveTenant(slug);
  return {
    title: tenant ? `${tenant.name} · imóveis` : "Vitrine",
  };
}

export default async function PortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    type?: string;
    city?: string;
    min?: string;
    max?: string;
    rooms?: string;
  }>;
}) {
  const { slug } = await params;
  const filters = await searchParams;
  const tenant = await resolveTenant(slug);
  if (!tenant) notFound();

  const where: Prisma.PropertyWhereInput = {
    tenantId: tenant.id,
    status: "PUBLISHED",
  };
  if (filters.type) where.type = filters.type;
  if (filters.city) where.city = { contains: filters.city };
  if (filters.rooms) where.bedrooms = { gte: Number(filters.rooms) || 0 };
  if (filters.min || filters.max) {
    where.price = {
      gte: filters.min ? Number(filters.min) : undefined,
      lte: filters.max ? Number(filters.max) : undefined,
    };
  }

  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-field">
        Cartografia da carteira
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">{tenant.name}</h1>
      <p className="mt-2 max-w-xl text-slate">
        Imóveis publicados pela equipa no terreno. Escolha no mapa ou filtre a lista.
      </p>
      <div className="mt-6">
        <SearchFilters slug={tenant.slug} current={filters} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="h-[420px] overflow-hidden  border border-ink/10">
          <PropertyMap
            properties={properties.map((property) => ({
              id: property.id,
              title: property.title,
              price: Number(property.price),
              latitude: property.latitude,
              longitude: property.longitude,
              href: `/t/${tenant.slug}/${property.id}`,
            }))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {properties.length === 0 ? (
            <p className="text-sm text-slate">Nenhum imóvel corresponde aos filtros.</p>
          ) : (
            properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                href={`/t/${tenant.slug}/${property.id}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
