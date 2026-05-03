# Book Catalog Challenge

Monorepo com dois aplicativos: `web` (Next.js) e `api` (Fastify), ambos deployados na Vercel.

🎨 **[Design no Figma](https://www.figma.com/design/hEey4bahbzpvDKrLKtLoru/Untitled?node-id=14-9741&t=OA9v7Vb51XKSxTG1-1)**

## Stack

| Camada         | Tecnologia                   | Versão |
| -------------- | ---------------------------- | ------ |
| Frontend       | Next.js + TypeScript         | ^16.2  |
| Estilização    | Tailwind CSS                 | ^4.2   |
| Componentes UI | shadcn/ui (Radix/Base UI)    | latest |
| Formulários    | React Hook Form + Zod        | latest |
| Backend        | Fastify                      | ^5.8   |
| ORM            | Drizzle ORM                  | ^0.45  |
| Banco de Dados | Neon PostgreSQL (serverless) | ^1.0   |
| Monorepo       | Turborepo + pnpm workspaces  | latest |
| Deploy         | Vercel (web + api)           | —      |

## Estrutura do Monorepo

```
book-catalog-challenge/
├── apps/
│   ├── web/                  # Next.js 16 — interface do usuário
│   │   ├── app/              # App Router (rotas abaixo)
│   │   ├── components/ui/    # Componentes de UI
│   │   ├── context/          # React Context (fluxo de adicionar livro)
│   │   └── lib/              # Utilitários (fetcher, cn, etc.)
│   └── api/                  # Fastify 5 — API REST
│       └── src/
│           ├── routes/       # Rotas da API
│           ├── plugins/      # CORS
│           └── db/           # Schema Drizzle + migrations
├── packages/
│   ├── shared/               # Tipos TypeScript compartilhados
│   └── tsconfig/             # Configurações TypeScript base
├── turbo.json
├── pnpm-workspace.yaml
└── SPEC.md
```

## Rotas do Frontend

| Rota                   | Descrição                                    |
| ---------------------- | -------------------------------------------- |
| `/`                    | Home — lista de assuntos com livros recentes |
| `/categoria/[slug]`    | Livros de uma categoria específica           |
| `/livro/[slug]`        | Detalhe de um livro                          |
| `/adicionar-livro`     | Fluxo de 3 passos para adicionar livro       |
| `/editar-livro/[slug]` | Edição e exclusão de livro                   |

## API Endpoints

| Método   | Rota                       | Descrição                                                      |
| -------- | -------------------------- | -------------------------------------------------------------- |
| `GET`    | `/api/health`              | Health check                                                   |
| `GET`    | `/api/home`                | Todos os assuntos com 10 livros recentes cada + count total    |
| `GET`    | `/api/livros`              | Lista paginada de livros (`page`, `limit`, `q`)                |
| `GET`    | `/api/livros/:slug`        | Detalhe do livro com autores, categorias e livros relacionados |
| `POST`   | `/api/livros`              | Criar livro                                                    |
| `PUT`    | `/api/livros/:slug`        | Atualizar livro                                                |
| `DELETE` | `/api/livros/:slug`        | Deletar livro (com vínculos em transação)                      |
| `GET`    | `/api/assuntos`            | Lista de assuntos ordenada alfabeticamente (com `codAs`)       |
| `GET`    | `/api/assuntos/:slug`      | Assunto + todos os livros com autores                          |
| `GET`    | `/api/google-books/search` | Busca no Google Books (`q`, `autor`, `maxResults`)             |

## Componentes de UI

### Tipografia

Classes utilitárias `@utility` com suporte a variantes responsivas (`md:`, `lg:`, etc.):

- **Títulos** (Playfair Display): `title-56`, `title-48`, `title-40`, `title-32`, `title-28`, `title-24`, `title-20`
- **Corpo** (Jost): `body-20`, `body-18`, `body-16`, `body-14`
- **Botão**: `btn-label` (uppercase, bold 700, 14px)

### Paleta de cores

| Grupo | Tokens                                |
| ----- | ------------------------------------- |
| Cream | `cream-100` → `cream-900`             |
| Green | `green-300`, `green-500`, `green-700` |
| Gray  | `gray-300`, `gray-500`, `gray-700`    |
| Brown | `brown-300`, `brown-500`, `brown-700` |
| Base  | `white` (#F7F6F3), `black` (#0D0D0D)  |

### Componentes disponíveis

- **Button** — variantes `solid`/`outline` × cores `cream`/`green`/`gray`/`brown`, com hover, sempre requer ícone
- **Input** / **Textarea** — estilo unificado com borda `cream-700`, placeholder em Playfair Display
- **InputGroup** / **InputGroupInput** / **InputGroupPrefix** / **InputGroupSuffix** — input com ícone integrado via CSS `group-has`
- **Select** — estilo formulário (mesmo visual do Input)
- **NavSelect** / **NavSelectTrigger** / **NavSelectContent** / **NavSelectItem** — select estilo botão sólido green, para navegação
- **Label** — label de formulário
- **Dialog** — modal de confirmação (usado na exclusão de livro)
- **Sheet** — drawer lateral (usado no menu mobile, 310px, da direita)
- **CategorySelector** — server component que busca assuntos da API e delega navegação ao client
- **NavBar** — navbar responsiva com drawer mobile
- **BookForm** — formulário de livro compartilhado entre adicionar e editar, com modal de exclusão por confirmação de texto
- **BookCover** — capa com overlay e sombras via imagens absolutas

## Fluxo de adicionar livro

```
Step 1 → busca por título/autor no Google Books
Step 2 → seleção do livro (ou "Refazer pesquisa")
Step 3 → formulário pré-preenchido → POST /api/livros
```

Estado gerenciado via `AddBookContext` (React Context). Rota client-side com `layout.tsx` como provider.

## Variáveis de ambiente

### `apps/web` (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### `apps/api` (`.env`)

```env
DATABASE_URL=postgres://...
GOOGLE_BOOKS_API_KEY=...
CORS_ORIGIN=http://localhost:3000   # não utilizado (CORS configurado via array hardcoded)
```

## CORS

A API aceita requisições de:

- `http://localhost:3000`
- `https://book-catalog.faustoalves.com.br`
- `https://www.book-catalog.faustoalves.com.br`

Configurado em `apps/api/src/plugins/cors.ts` com `fastify-plugin` para escopo global.

## Pré-requisitos

- Node.js >= 22
- pnpm >= 9
- Conta na [Neon](https://neon.tech) para o banco de dados
- Conta na [Vercel](https://vercel.com) para o deploy

## Setup local

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > apps/web/.env.local
# Criar apps/api/.env com DATABASE_URL e GOOGLE_BOOKS_API_KEY

# Rodar migrations
pnpm --filter api db:migrate

# Iniciar todos os apps em modo desenvolvimento
pnpm dev
```

## Testes

### Stack de testes

| Ferramenta                                                               | Uso                                                               |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [Vitest](https://vitest.dev)                                             | Test runner (jsdom environment)                                   |
| [@testing-library/react](https://testing-library.com/react)              | Renderização e queries de componentes                             |
| [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) | Matchers customizados (`toBeInTheDocument`, `toBeDisabled`, etc.) |

### Cobertura — `apps/web`

**90 testes** distribuídos em 14 arquivos, cobrindo todos os componentes em `components/ui/`:

| Arquivo de teste                                                | Testes | Componentes cobertos                                                              |
| --------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------- |
| `__tests__/button.test.tsx`                                     | 7      | `Button` — variants, icon, onClick, disabled                                      |
| `__tests__/input.test.tsx`                                      | 6      | `Input` — placeholder, onChange, disabled, type                                   |
| `__tests__/textarea.test.tsx`                                   | 6      | `Textarea` — placeholder, onChange, rows, disabled                                |
| `__tests__/label.test.tsx`                                      | 4      | `Label` — renderização, htmlFor, associação com input                             |
| `__tests__/input-group.test.tsx`                                | 7      | `InputGroup`, `InputGroupPrefix`, `InputGroupSuffix`, `InputGroupInput`           |
| `containers/__tests__/containers.test.tsx`                      | 9      | `BasicContainer`, `HeaderContainer`, `SliderContainer`                            |
| `elements/__tests__/logo.test.tsx`                              | 3      | `Logo` — SVG, className, props                                                    |
| `footer/__tests__/footer.test.tsx`                              | 3      | `Footer` — copyright, logo, link home                                             |
| `titles/__tests__/title-description.test.tsx`                   | 8      | `TitleDescription` — h1/h2 por type, title, description opcional                  |
| `books/__tests__/book-cover.test.tsx`                           | 7      | `BookCover` — 4 imagens, alt, className, overlay, shadows                         |
| `books/__tests__/book-item.test.tsx`                            | 5      | `BookItem` — título, autor, fallback de imagem                                    |
| `books/__tests__/book-form.test.tsx`                            | 15     | `BookForm` — campos, modos add/edit, dialog de exclusão, validação de confirmação |
| `category-selector/__tests__/category-selector-client.test.tsx` | 3      | `CategorySelectorClient` — placeholder, combobox, lista vazia                     |
| `navbar/__tests__/navbar.test.tsx`                              | 7      | `NavBar` — logo, busca, link, abrir/fechar drawer mobile, categorias              |

### Executar testes

```bash
# Rodar todos os testes
pnpm test

# Rodar apenas os testes do web
pnpm --filter web test

# Modo watch (desenvolvimento)
pnpm --filter web test:watch
```

### Convenções

- Testes co-localizados em pastas `__tests__/` próximas aos componentes
- Mocks para `next/link`, `next/navigation` e `@/lib/api` onde necessário
- Componentes que usam base-ui Select são consultados por `role="combobox"`
- Imagens `aria-hidden` são consultadas via `document.querySelectorAll`

## Scripts disponíveis

```bash
pnpm dev          # Inicia web e api em paralelo (Turborepo)
pnpm build        # Build de produção de todos os apps
pnpm lint         # Lint em todos os apps e packages
pnpm test         # Testes em todos os apps
pnpm typecheck    # Checagem de tipos em todos os apps e packages
```

## Deploy

Ambos os apps são deployados na Vercel. A `api` utiliza **Vercel Fluid Compute** (zero-config para Fastify desde Out/2025), sendo executada como uma única Vercel Function com auto-scaling.

Ver [SPEC.md](./SPEC.md) para detalhes técnicos de arquitetura e decisões de design.
