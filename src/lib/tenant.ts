import { prisma } from "@/lib/prisma";

const FQDN =
  /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

const RESERVED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "imobiflow.app",
  "www.imobiflow.app",
]);

export function looksLikeDomain(value: string) {
  return value.includes(".");
}

export function isValidCustomDomain(value: string) {
  const host = value.trim().toLowerCase();
  if (!FQDN.test(host)) return false;
  if (RESERVED_HOSTS.has(host)) return false;
  if (host.endsWith(".localhost") || host.endsWith(".imobiflow.app")) return false;
  return true;
}

/** Path /t/{slug} resolves by slug only. Hostnames resolve by verified custom domain. */
export async function resolveTenant(slugOrHost: string) {
  const key = slugOrHost.toLowerCase();

  if (looksLikeDomain(key)) {
    return prisma.tenant.findFirst({
      where: { customDomain: key, customDomainVerified: true },
    });
  }

  return prisma.tenant.findFirst({
    where: { slug: key },
  });
}

export async function getRequestHost() {
  const { headers } = await import("next/headers");
  const headerList = await headers();
  return (
    headerList.get("x-forwarded-host") ||
    headerList.get("host") ||
    "localhost:3000"
  );
}

export function getRootDomain() {
  return process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
}

export function tenantPortalPath(slug: string, path = "") {
  return `/t/${slug}${path}`;
}

export function newDomainVerifyToken() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 24);
}

export async function domainTxtIncludesToken(domain: string, token: string) {
  const { resolveTxt } = await import("node:dns/promises");
  const needle = `imobiflow-verify=${token}`;
  const names = [`_imobiflow-verify.${domain}`, domain];

  for (const name of names) {
    try {
      const records = await resolveTxt(name);
      if (records.some((parts) => parts.join("").includes(needle))) {
        return true;
      }
    } catch {
      /* NXDOMAIN / timeout */
    }
  }
  return false;
}
