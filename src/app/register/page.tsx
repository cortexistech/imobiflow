"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { FolioFrame, Logo, TapeBar } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);

  return (
    <main className="flow-grid grid min-h-full place-items-center px-4 py-16">
      <FolioFrame className="surface w-full max-w-lg">
        <TapeBar />
        <form action={action} className="p-8">
          <Link href="/">
            <Logo caption="nova imobiliária" />
          </Link>
          <h1 className="mt-8 font-display text-3xl font-extrabold">Abrir imobiliária</h1>
          <p className="mt-2 text-sm text-slate">
            Cria a caderneta, o primeiro gestor e a vitrine em /t/a-sua-marca.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Nome da imobiliária" className="sm:col-span-2">
              <Input name="agency" required placeholder="Atlântica Residências" />
            </Field>
            <Field label="Subdomínio da vitrine" hint="letras e hífens">
              <Input name="slug" placeholder="atlantica" />
            </Field>
            <Field label="O seu nome">
              <Input name="name" required />
            </Field>
            <Field label="Email">
              <Input name="email" type="email" required />
            </Field>
            <Field label="Telefone">
              <Input name="phone" required placeholder="3519..." />
            </Field>
            <Field label="Palavra-passe" className="sm:col-span-2">
              <Input name="password" type="password" required minLength={8} />
            </Field>
          </div>
          {state?.error ? <p className="mt-4 text-sm text-lead">{state.error}</p> : null}
          <Button type="submit" className="mt-6 w-full" disabled={pending}>
            {pending ? "A criar caderneta…" : "Criar imobiliária"}
          </Button>
          <p className="mt-4 text-sm text-slate">
            Já tem acesso?{" "}
            <Link href="/login" className="font-semibold text-field">
              Entrar
            </Link>
          </p>
        </form>
      </FolioFrame>
    </main>
  );
}
