import { Prisma } from "@/generated/prisma/client";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(value: Prisma.Decimal | number | string) {
  const amount = typeof value === "number" ? value : Number(value);
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function asImages(images: Prisma.JsonValue): string[] {
  if (!Array.isArray(images)) return [];
  return images.filter((item): item is string => typeof item === "string");
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 48);
}

export function isUnlimited(n: number) {
  return !Number.isFinite(n);
}
