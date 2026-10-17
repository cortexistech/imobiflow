# ImobiFlow

Plataforma SaaS multi-tenant para pequenas imobiliárias e corretores independentes: cadastro de imóveis no terreno, vitrine white-label e leads instantâneos no WhatsApp.

> *A plataforma que conecta corretores no terreno, imóveis no ar e leads diretos no WhatsApp.*

## Stack (MVP)

- **Next.js 16** (App Router, Server Components)
- **Tailwind CSS 4**
- **Prisma ORM** + SQLite local (troque para PostgreSQL/Neon em produção)
- **Auth.js** com cargos `ADMIN` e `AGENT`
- **Leaflet / OpenStreetMap** (Mapbox opcional mais tarde)
- Upload local ou **Cloudinary**
- Notificações **WhatsApp** (Z-API / Evolution API / Twilio)

## Arranque local

```bash
cd ImobiFlow
cp .env.example .env   # já existe um .env de desenvolvimento
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Contas de demonstração

| Papel    | Email                 | Palavra-passe |
|----------|-----------------------|---------------|
| Gestão   | maria@atlantica.pt    | demo1234      |
| Corretor | joao@atlantica.pt     | demo1234      |

Vitrine pública da imobiliária demo: [/t/atlantica](http://localhost:3000/t/atlantica)

White-label por subdomínio (opcional): `http://atlantica.localhost:3000`

## Variáveis de ambiente

| Variável | Função |
|----------|--------|
| `DATABASE_URL` | `file:./prisma/dev.db` local (relativo à raiz do projeto), ou URL Neon/PostgreSQL em produção |
| `AUTH_SECRET` | Segredo JWT (`openssl rand -base64 32`) |
| `AUTH_URL` | URL pública da app |
| `NEXT_PUBLIC_ROOT_DOMAIN` | Domínio raiz (`imobiflow.app`) |
| `WHATSAPP_API_URL` / `WHATSAPP_API_KEY` | Disparo de leads (se vazio, o lead é gravado e o envio fica em dry-run) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_UPLOAD_PRESET` | Fotografias na CDN; senão grava em `/public/uploads` |

## Produção (PostgreSQL)

1. Altere `provider = "postgresql"` em `prisma/schema.prisma` e use `images String[]` em vez de `Json` se preferir arrays nativos.
2. Troque o adapter do Prisma: instale `@prisma/adapter-pg` e, em `src/lib/prisma.ts` e `prisma/seed.ts`, use `new PrismaPg({ connectionString: process.env.DATABASE_URL })` no lugar de `PrismaBetterSqlite3`.
3. Aponte `DATABASE_URL` para o Neon.
4. Faça deploy na Vercel e configure o domínio raiz + wildcards para `{slug}.imobiflow.app`.
5. Domínios próprios: grave o FQDN em Marca, crie o TXT `_imobiflow-verify.{dominio}` com `imobiflow-verify={token}` e clique em Verificar. O middleware só serve hosts verificados.
# imobiflow
