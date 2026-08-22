"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { slugify } from "@/lib/utils";
import {
  domainTxtIncludesToken,
  isValidCustomDomain,
  newDomainVerifyToken,
} from "@/lib/tenant";

const settingsSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(48),
  phone: z.string().max(30).optional().default(""),
  customDomain: z.string().max(120).optional().default(""),
  brandColor: z.string().regex(/^#?[0-9A-Fa-f]{6}$/),
  logoUrl: z.string().max(500).optional().default(""),
});

export async function updateTenantSettings(_: unknown, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = settingsSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    phone: formData.get("phone") || "",
    customDomain: formData.get("customDomain") || "",
    brandColor: formData.get("brandColor"),
    logoUrl: formData.get("logoUrl") || "",
  });
  if (!parsed.success) return { error: "Verifique os dados da imobiliária." };

  const slug = slugify(parsed.data.slug);
  const color = parsed.data.brandColor.startsWith("#")
    ? parsed.data.brandColor
    : `#${parsed.data.brandColor}`;
  const domainRaw = parsed.data.customDomain.trim().toLowerCase();
  const domain = domainRaw || null;
  const logoUrl = parsed.data.logoUrl.trim() || null;

  if (domain && !isValidCustomDomain(domain)) {
    return {
      error:
        "O domínio próprio tem de ser um FQDN (ex.: imobiliaria.pt), não um slug.",
    };
  }

  const slugOwner = await prisma.tenant.findUnique({ where: { slug } });
  if (slugOwner && slugOwner.id !== admin.tenantId) {
    return { error: "Este subdomínio já está atribuído a outra imobiliária." };
  }

  if (domain) {
    const slugClash = await prisma.tenant.findFirst({
      where: { slug: domain },
    });
    if (slugClash) {
      return { error: "Este valor já é o subdomínio de outra imobiliária." };
    }
    const domainOwner = await prisma.tenant.findUnique({
      where: { customDomain: domain },
    });
    if (domainOwner && domainOwner.id !== admin.tenantId) {
      return { error: "Este domínio já está em uso." };
    }
  }

  const current = await prisma.tenant.findUniqueOrThrow({
    where: { id: admin.tenantId },
  });

  const domainChanged = current.customDomain !== domain;
  const verifyToken =
    domain && domainChanged
      ? newDomainVerifyToken()
      : domain
        ? current.domainVerifyToken
        : null;

  await prisma.tenant.update({
    where: { id: admin.tenantId },
    data: {
      name: parsed.data.name,
      slug,
      phone: parsed.data.phone || null,
      customDomain: domain,
      customDomainVerified: domainChanged ? false : current.customDomainVerified,
      domainVerifyToken: verifyToken,
      brandColor: color,
      logoUrl,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath(`/t/${slug}`);
  return { ok: true };
}

export async function verifyCustomDomain(
  previousState: unknown,
  formData: FormData,
) {
  void previousState;
  void formData;
  const admin = await requireAdmin();
  const tenant = await prisma.tenant.findUniqueOrThrow({
    where: { id: admin.tenantId },
  });

  if (!tenant.customDomain || !tenant.domainVerifyToken) {
    return { error: "Grave primeiro um domínio próprio." };
  }

  const ok = await domainTxtIncludesToken(
    tenant.customDomain,
    tenant.domainVerifyToken,
  );
  if (!ok) {
    return {
      error: `Registo TXT não encontrado. Crie _imobiflow-verify.${tenant.customDomain} com imobiflow-verify=${tenant.domainVerifyToken}`,
    };
  }

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { customDomainVerified: true },
  });
  revalidatePath("/dashboard/settings");
  return { ok: true };
}
