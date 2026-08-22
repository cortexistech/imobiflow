import { Plan } from "@prisma/client";

export const APP_NAME = "ImobiFlow";
export const APP_TAGLINE = "O fluxo inteligente do mercado imobiliário.";
export const APP_PROMISE =
  "A plataforma SaaS que conecta corretores no terreno, imóveis no ar e leads diretos no WhatsApp.";

export const PROPERTY_TYPES = [
  "Apartamento",
  "Moradia",
  "Terreno",
  "Comercial",
  "Quinta",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PLAN_LIMITS: Record<
  Plan,
  { agents: number; properties: number; label: string; price: string }
> = {
  STARTER: {
    agents: 3,
    properties: 50,
    label: "Starter",
    price: "€ 29",
  },
  PRO: {
    agents: 10,
    properties: 300,
    label: "Pro",
    price: "€ 79",
  },
  ENTERPRISE: {
    agents: Number.POSITIVE_INFINITY,
    properties: Number.POSITIVE_INFINITY,
    label: "Enterprise",
    price: "€ 149",
  },
};

export const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Rascunho",
  PENDING: "Pendente",
  PUBLISHED: "Publicado",
};

export const DEFAULT_MAP_CENTER = { lat: 38.7223, lng: -9.1393 } as const;
