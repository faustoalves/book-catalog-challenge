# Especificação Técnica — Book Catalog

## 1. Visão Geral

Catálogo de livros com interface web moderna e API REST. Monorepo gerenciado com Turborepo e pnpm workspaces, com deploy unificado na Vercel.

---

## 2. Arquitetura

```
Browser  ──►  apps/web  (Next.js 16, Vercel Edge/SSR)
                │
                └──► apps/api  (Fastify 5, Vercel Fluid Compute)
                          │
                          └──► Neon PostgreSQL  (serverless driver via WebSockets)
```

### Comunicação

- `web` → `api`: fetch HTTP/REST com base URL configurável por ambiente (`NEXT_PUBLIC_API_URL`)
- `api` → `db`: Drizzle ORM usando `@neondatabase/serverless` (driver WebSocket para ambientes serverless)

---

## 3. Apps

### 3.1 `apps/web` — Next.js

| Item | Decisão |
|------|---------|
| Framework | Next.js 16.2 com App Router |
| Linguagem | TypeScript strict |
| Estilização | Tailwind CSS 4.2 (CSS-first config, sem `tailwind.config.js`) |
| Renderização | Server Components por padrão; Client Components apenas onde necessário |
| Fetch | Native `fetch` com `cache` e `revalidate` do Next.js |
| Roteamento | File-based via App Router (`app/`) |

**Estrutura de pastas:**

```
apps/web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── books/
│       ├── page.tsx
│       └── [id]/
│           └── page.tsx
├── components/
├── lib/
│   └── api.ts          # Cliente HTTP para a API
├── public/
├── .env.example
├── next.config.ts
└── package.json
```

**Variáveis de ambiente:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### 3.2 `apps/api` — Fastify

| Item | Decisão |
|------|---------|
| Framework | Fastify 5.8 |
| Linguagem | TypeScript strict |
| ORM | Drizzle ORM 0.45 |
| Banco | Neon PostgreSQL via `@neondatabase/serverless` |
| Validação | Zod + `@fastify/type-provider-zod` |
| CORS | `@fastify/cors` (configurado para o domínio do `web`) |
| Deploy | Vercel Fluid Compute (zero-config, app exposta na raiz) |

**Estrutura de pastas:**

```
apps/api/
├── src/
│   ├── index.ts            # Entry point (dev local)
│   ├── app.ts              # Instância Fastify exportada
│   ├── db/
│   │   ├── index.ts        # Conexão Drizzle + Neon
│   │   ├── schema.ts       # Schema das tabelas
│   │   └── migrations/     # Arquivos de migration gerados pelo drizzle-kit
│   ├── routes/
│   │   └── books.ts
│   └── plugins/
│       └── cors.ts
├── drizzle.config.ts
├── .env.example
└── package.json
```

**Variáveis de ambiente:**

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
CORS_ORIGIN=http://localhost:3000
```

**Deploy na Vercel:**

A Vercel detecta automaticamente apps Fastify (sem necessidade de `vercel.json`). O ponto de entrada é `src/app.ts` exportando a instância Fastify. Utiliza Fluid Compute para concorrência server-like com auto-scaling serverless.

---

## 4. Package `packages/shared`

Tipos TypeScript compartilhados entre `web` e `api`, evitando duplicação e drift de contratos.

```
packages/shared/
├── src/
│   ├── index.ts
│   └── types/
│       └── book.ts     # BookDto, CreateBookDto, etc.
├── tsconfig.json
└── package.json
```

---

## 5. Banco de Dados

### Schema inicial

```sql
-- books
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
title       text NOT NULL
author      text NOT NULL
isbn        text UNIQUE
description text
cover_url   text
genre       text
published_at date
created_at  timestamptz NOT NULL DEFAULT now()
updated_at  timestamptz NOT NULL DEFAULT now()
```

### Migrations

Gerenciadas pelo **drizzle-kit**. Comandos:

```bash
pnpm --filter api db:generate   # Gera arquivos de migration
pnpm --filter api db:migrate    # Aplica migrations no banco
pnpm --filter api db:studio     # Abre Drizzle Studio
```

---

## 6. API REST

Base URL: `/api` (Vercel roteia automaticamente)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/books` | Lista livros (com paginação e filtros) |
| GET | `/api/books/:id` | Retorna um livro pelo ID |
| POST | `/api/books` | Cria um novo livro |
| PUT | `/api/books/:id` | Atualiza um livro |
| DELETE | `/api/books/:id` | Remove um livro |
| GET | `/api/health` | Health check |

### Query params para `GET /api/books`

| Param | Tipo | Descrição |
|-------|------|-----------|
| `page` | number | Página (default: 1) |
| `limit` | number | Itens por página (default: 20, max: 100) |
| `q` | string | Busca por título ou autor |
| `genre` | string | Filtro por gênero |

---

## 7. Monorepo (Turborepo)

**`turbo.json`** define o pipeline de tarefas com cache:

```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "typecheck": {}
  }
}
```

**`pnpm-workspace.yaml`:**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## 8. Configuração TypeScript

Cada app/package tem seu próprio `tsconfig.json` extendendo uma config base em `packages/tsconfig/`.

```
packages/tsconfig/
├── base.json       # strict, ES2022, module: NodeNext
├── nextjs.json     # extende base + plugin Next.js
└── package.json
```

---

## 9. Variáveis de Ambiente na Vercel

Configurar no dashboard da Vercel para cada projeto (`web` e `api`):

**api:**
- `DATABASE_URL` — connection string do Neon
- `CORS_ORIGIN` — URL de produção do `web`

**web:**
- `NEXT_PUBLIC_API_URL` — URL de produção da `api`

---

## 10. Decisões e Justificativas

| Decisão | Justificativa |
|---------|---------------|
| Turborepo | Criado pela Vercel, integração nativa, cache de build distribuído |
| pnpm workspaces | Performance superior ao npm/yarn em monorepos |
| Fastify + Vercel Fluid Compute | Zero-config desde Out/2025; concorrência nativa sem cold-start problemático |
| Neon serverless driver | Driver WebSocket necessário em ambientes serverless (sem TCP persistente) |
| Drizzle ORM | Type-safe, sem runtime overhead, migrations versionadas com drizzle-kit |
| Tailwind 4.2 | Config CSS-first, sem arquivo de config JS, builds muito mais rápidos |
| `packages/shared` | Único source of truth para tipos da API, elimina drift entre cliente e servidor |
