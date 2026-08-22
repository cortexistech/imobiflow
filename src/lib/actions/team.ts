"use server";

import { hash } from "bcryptjs";
import { z } from "zod";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { PLAN_LIMITS } from "@/lib/constants";

const memberSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(6).max(30),
  password: z.string().min(8).max(72),
  role: z.nativeEnum(Role).default(Role.AGENT),
});

export async function addTeamMember(_: unknown, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = memberSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    role: formData.get("role") || Role.AGENT,
  });
  if (!parsed.success) return { error: "Preencha os dados do corretor." };

  const tenant = await prisma.tenant.findUniqueOrThrow({
    where: { id: admin.tenantId },
    include: { _count: { select: { users: true } } },
  });
  const limit = PLAN_LIMITS[tenant.plan].agents;
  if (tenant._count.users >= limit) {
    return { error: "O plano actual não permite mais corretores." };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "Este email já está registado." };

  await prisma.user.create({
    data: {
      tenantId: admin.tenantId,
      name: parsed.data.name,
      email,
      phone: parsed.data.phone,
      passwordHash: await hash(parsed.data.password, 10),
      role: parsed.data.role,
    },
  });

  revalidatePath("/dashboard/team");
  return { ok: true };
}

export async function removeTeamMember(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  if (!userId || userId === admin.id) return;
  await prisma.user.deleteMany({
    where: { id: userId, tenantId: admin.tenantId },
  });
  revalidatePath("/dashboard/team");
}
