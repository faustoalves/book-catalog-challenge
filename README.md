# Book Catalog Challenge

Monorepo com dois aplicativos: `web` (Next.js) e `api` (Fastify), ambos deployados na Vercel.

## Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Frontend | Next.js + TypeScript | ^16.2 |
| Estilização | Tailwind CSS | ^4.2 |
| Backend | Fastify | ^5.8 |
| ORM | Drizzle ORM | ^0.45 |
| Banco de Dados | Neon PostgreSQL (serverless) | ^1.0 |
| Monorepo | Turborepo + pnpm workspaces | latest |
| Deploy | Vercel (web + api) | — |

## Estrutura do Monorepo

```
book-catalog-challenge/
├── apps/
│   ├── web/                  # Next.js 16 — interface do usuário
│   └── api/                  # Fastify 5 — API REST
├── packages/
│   └── shared/               # Tipos TypeScript compartilhados entre web e api
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── README.md
└── SPEC.md
```

## Pré-requisitos

- Node.js >= 22
- pnpm >= 9
- Conta na [Neon](https://neon.tech) para o banco de dados
- Conta na [Vercel](https://vercel.com) para o deploy

## Setup local

```bash
# Instalar dependências
pnpm install

# Copiar variáveis de ambiente
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Rodar migrations
pnpm --filter api db:migrate

# Iniciar todos os apps em modo desenvolvimento
pnpm dev
```

## Scripts disponíveis

```bash
pnpm dev          # Inicia web e api em paralelo (Turborepo)
pnpm build        # Build de produção de todos os apps
pnpm lint         # Lint em todos os apps e packages
pnpm typecheck    # Checagem de tipos em todos os apps e packages
```

## Deploy

Ambos os apps são deployados na Vercel. A `api` utiliza **Vercel Fluid Compute** (zero-config para Fastify desde Out/2025), sendo executada como uma única Vercel Function com auto-scaling.

Ver [SPEC.md](./SPEC.md) para detalhes técnicos de arquitetura e decisões de design.
