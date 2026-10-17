"use server";

import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma/enums";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  agency: z.string().min(2).max(80),
  slug: z.string().min(2).max(48).optional(),
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(6).max(30),
  password: z.string().min(8).max(72),
});

export async function loginAction(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Email ou palavra-passe inválidos." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Credenciais incorrectas." };
    }
    throw error;
  }
}

export async function registerAction(_: unknown, formData: FormData) {
  const parsed = registerSchema.safeParse({
    agency: formData.get("agency"),
    slug: formData.get("slug") || undefined,
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Preencha todos os campos com dados válidos." };
  }

  const slug = slugify(parsed.data.slug || parsed.data.agency);
  if (!slug) return { error: "Indique um identificador válido para a vitrine." };

  const email = parsed.data.email.trim().toLowerCase();
  const [slugTaken, emailTaken] = await Promise.all([
    prisma.tenant.findUnique({ where: { slug } }),
    prisma.user.findUnique({ where: { email } }),
  ]);

  if (slugTaken) return { error: "Este endereço de vitrine já está em uso." };
  if (emailTaken) return { error: "Já existe uma conta com este email." };

  const passwordHash = await hash(parsed.data.password, 10);

  await prisma.tenant.create({
    data: {
      name: parsed.data.agency,
      slug,
      phone: parsed.data.phone,
      users: {
        create: {
          name: parsed.data.name,
          email,
          phone: parsed.data.phone,
          passwordHash,
          role: Role.ADMIN,
        },
      },
    },
  });

  await signIn("credentials", {
    email,
    password: parsed.data.password,
    redirectTo: "/dashboard",
  });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
  redirect("/");
}
