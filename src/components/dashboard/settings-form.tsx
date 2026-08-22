"use client";

import { useActionState } from "react";
import { updateTenantSettings, verifyCustomDomain } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export function SettingsForm({
  tenant,
}: {
  tenant: {
    name: string;
    slug: string;
    phone: string | null;
    customDomain: string | null;
    customDomainVerified: boolean;
    domainVerifyToken: string | null;
    brandColor: string;
    logoUrl: string | null;
    plan: string;
  };
}) {
  const [state, action, pending] = useActionState(updateTenantSettings, undefined);
  const [verifyState, verifyAction, verifying] = useActionState(
    verifyCustomDomain,
    undefined,
  );

  return (
    <div className="grid max-w-xl gap-8">
      <form action={action} className="grid gap-4">
        <Field label="Nome da imobiliária">
          <Input name="name" defaultValue={tenant.name} required />
        </Field>
        <Field label="Subdomínio" hint="fica em {slug}.imobiflow.app">
          <Input name="slug" defaultValue={tenant.slug} required />
        </Field>
        <Field label="Telefone">
          <Input name="phone" defaultValue={tenant.phone ?? ""} />
        </Field>
        <Field
          label="Domínio próprio"
          hint="FQDN, ex.: imobiliaria.pt — só activa depois da verificação TXT"
        >
          <Input name="customDomain" defaultValue={tenant.customDomain ?? ""} />
        </Field>
        <Field label="Cor da marca">
          <Input name="brandColor" type="color" defaultValue={tenant.brandColor} />
        </Field>
        <Field label="URL do logótipo">
          <Input name="logoUrl" defaultValue={tenant.logoUrl ?? ""} />
        </Field>
        <p className="font-mono text-xs text-slate">Plano actual: {tenant.plan}</p>
        {state?.error ? <p className="text-sm text-lead">{state.error}</p> : null}
        {state && "ok" in state ? (
          <p className="text-sm text-field">Marca actualizada.</p>
        ) : null}
        <Button type="submit" disabled={pending}>
          Guardar
        </Button>
      </form>

      {tenant.customDomain ? (
        <div className="border border-ink/10 bg-white p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate">
            Verificação DNS
          </p>
          <p className="mt-2 text-sm">
            {tenant.customDomainVerified
              ? `${tenant.customDomain} está verificado e a vitrine pode servir neste host.`
              : "O domínio ainda não está activo. Crie um registo TXT e confirme."}
          </p>
          {!tenant.customDomainVerified && tenant.domainVerifyToken ? (
            <>
              <p className="mt-3 font-mono text-[11px] leading-5 text-slate">
                Nome: _imobiflow-verify.{tenant.customDomain}
                <br />
                Valor: imobiflow-verify={tenant.domainVerifyToken}
              </p>
              <form action={verifyAction} className="mt-4">
                {verifyState?.error ? (
                  <p className="mb-3 text-sm text-lead">{verifyState.error}</p>
                ) : null}
                {verifyState && "ok" in verifyState ? (
                  <p className="mb-3 text-sm text-field">Domínio verificado.</p>
                ) : null}
                <Button type="submit" variant="survey" disabled={verifying}>
                  {verifying ? "A consultar DNS…" : "Verificar TXT"}
                </Button>
              </form>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
