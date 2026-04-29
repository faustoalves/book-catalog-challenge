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

| Item         | Decisão                                                                |
| ------------ | ---------------------------------------------------------------------- |
| Framework    | Next.js 16.2 com App Router                                            |
| Linguagem    | TypeScript strict                                                      |
| Estilização  | Tailwind CSS 4.2 (CSS-first config, sem `tailwind.config.js`)          |
| Renderização | Server Components por padrão; Client Components apenas onde necessário |
| Fetch        | Native `fetch` com `cache` e `revalidate` do Next.js                   |
| Roteamento   | File-based via App Router (`app/`)                                     |

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

| Item      | Decisão                                                 |
| --------- | ------------------------------------------------------- |
| Framework | Fastify 5.8                                             |
| Linguagem | TypeScript strict                                       |
| ORM       | Drizzle ORM 0.45                                        |
| Banco     | Neon PostgreSQL via `@neondatabase/serverless`          |
| Validação | Zod + `@fastify/type-provider-zod`                      |
| CORS      | `@fastify/cors` (configurado para o domínio do `web`)   |
| Deploy    | Vercel Fluid Compute (zero-config, app exposta na raiz) |

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

Cinco tabelas: `livros`, `autores`, `assuntos` e as duas tabelas de junção `livro_autor` e `livro_assunto`.

```sql
-- livros
codl           serial PRIMARY KEY
titulo         text NOT NULL
editora        text
edicao         integer
ano_publicacao integer
valor          numeric(10, 2) NOT NULL
imagem_url     text
paginas        integer

-- autores
cod_au  serial PRIMARY KEY
nome    text NOT NULL

-- assuntos
cod_as    serial PRIMARY KEY
descricao text NOT NULL

-- livro_autor  (N:N livros ↔ autores)
livro_codl   integer NOT NULL REFERENCES livros(codl)
autor_cod_au integer NOT NULL REFERENCES autores(cod_au)
PRIMARY KEY (livro_codl, autor_cod_au)

-- livro_assunto  (N:N livros ↔ assuntos)
livro_codl    integer NOT NULL REFERENCES livros(codl)
assunto_cod_as integer NOT NULL REFERENCES assuntos(cod_as)
PRIMARY KEY (livro_codl, assunto_cod_as)
```

> Schema em evolução — campos adicionais serão definidos nas próximas iterações.

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

### Livros

| Método | Rota                | Descrição                                      |
| ------ | ------------------- | ---------------------------------------------- |
| GET    | `/api/livros`       | Lista livros com autores e assuntos (paginado) |
| GET    | `/api/livros/:codl` | Retorna um livro pelo ID                       |
| POST   | `/api/livros`       | Cria livro (com autores e assuntos)            |
| PUT    | `/api/livros/:codl` | Atualiza livro                                 |
| DELETE | `/api/livros/:codl` | Remove livro                                   |

### Autores

| Método | Rota                  | Descrição        |
| ------ | --------------------- | ---------------- |
| GET    | `/api/autores`        | Lista autores    |
| GET    | `/api/autores/:codAu` | Retorna um autor |
| POST   | `/api/autores`        | Cria autor       |
| PUT    | `/api/autores/:codAu` | Atualiza autor   |
| DELETE | `/api/autores/:codAu` | Remove autor     |

### Assuntos

| Método | Rota                   | Descrição          |
| ------ | ---------------------- | ------------------ |
| GET    | `/api/assuntos`        | Lista assuntos     |
| GET    | `/api/assuntos/:codAs` | Retorna um assunto |
| POST   | `/api/assuntos`        | Cria assunto       |
| PUT    | `/api/assuntos/:codAs` | Atualiza assunto   |
| DELETE | `/api/assuntos/:codAs` | Remove assunto     |

### Google Books (busca externa)

| Método | Rota                       | Descrição                                                  |
| ------ | -------------------------- | ---------------------------------------------------------- |
| GET    | `/api/google-books/search` | Busca livros na API do Google Books para apoio ao cadastro |

**Query params:**

| Param        | Tipo   | Descrição                                       |
| ------------ | ------ | ----------------------------------------------- |
| `q`          | string | Título do livro (obrigatório)                   |
| `autor`      | string | Nome do autor (opcional)                        |
| `maxResults` | number | Quantidade de resultados (default: 10, max: 40) |

**Resposta:**

```json
{
  "total": 42,
  "items": [
    {
      "googleId": "abc123",
      "titulo": "Clean Code",
      "autores": ["Robert C. Martin"],
      "editora": "Prentice Hall",
      "anoPublicacao": 2008,
      "paginas": 431,
      "imagemUrl": "https://books.google.com/...",
      "assuntos": ["Computers / Programming"]
    }
  ]
}
```

> A chave `GOOGLE_BOOKS_API_KEY` é opcional — sem ela a API funciona com limite de ~1000 req/dia.
> O frontend usa esses dados para pré-preencher o formulário de cadastro de livro.

### Health

| Método | Rota          | Descrição    |
| ------ | ------------- | ------------ |
| GET    | `/api/health` | Health check |

### Query params para `GET /api/livros`

| Param          | Tipo   | Descrição                                |
| -------------- | ------ | ---------------------------------------- |
| `page`         | number | Página (default: 1)                      |
| `limit`        | number | Itens por página (default: 20, max: 100) |
| `q`            | string | Busca por título                         |
| `autorCodAu`   | number | Filtra por autor                         |
| `assuntoCodAs` | number | Filtra por assunto                       |

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
  - 'apps/*'
  - 'packages/*'
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

URLs de produção:

- **web** → `https://book-catalog.faustoalves.com.br`
- **api** → `https://api-book-catalog.faustoalves.com.br`

Configurar no dashboard da Vercel para cada projeto:

**api:**
| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | connection string pooled do Neon |
| `DATABASE_URL_UNPOOLED` | connection string direct do Neon (usado pelo drizzle-kit em CI) |
| `CORS_ORIGIN` | `https://book-catalog.faustoalves.com.br` |
| `GOOGLE_BOOKS_API_KEY` | chave da Google Books API |

**web:**
| Variável | Valor |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api-book-catalog.faustoalves.com.br` |

---

## 10. Decisões e Justificativas

| Decisão                        | Justificativa                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------- |
| Turborepo                      | Criado pela Vercel, integração nativa, cache de build distribuído               |
| pnpm workspaces                | Performance superior ao npm/yarn em monorepos                                   |
| Fastify + Vercel Fluid Compute | Zero-config desde Out/2025; concorrência nativa sem cold-start problemático     |
| Neon serverless driver         | Driver WebSocket necessário em ambientes serverless (sem TCP persistente)       |
| Drizzle ORM                    | Type-safe, sem runtime overhead, migrations versionadas com drizzle-kit         |
| Tailwind 4.2                   | Config CSS-first, sem arquivo de config JS, builds muito mais rápidos           |
| `packages/shared`              | Único source of truth para tipos da API, elimina drift entre cliente e servidor |
