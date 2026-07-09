# StudioHub — Onde a beleza encontra a gestão

SaaS de gestão para salões de beleza, barbearias e clínicas estéticas.

## Stack

| Camada    | Tecnologia                                               |
| --------- | -------------------------------------------------------- |
| Frontend  | React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Radix UI |
| Backend   | Hono.js, TypeScript                                      |
| ORM       | Prisma 7                                                 |
| Database  | PostgreSQL 16                                            |
| Validação | Zod 4                                                    |
| Testes    | Vitest                                                   |

## Pré-requisitos

- Node.js >= 20
- pnpm
- Docker (para PostgreSQL)

## Setup rápido

```bash
# 1. Instalar dependências
pnpm install

# 2. Subir PostgreSQL
pnpm db:up

# 3. Rodar migrations
pnpm db:migrate

# 4. Popular banco com dados de teste
pnpm db:seed

# 5. Iniciar backend
pnpm server:dev

# 6. (outro terminal) Iniciar frontend
pnpm dev
```

Backend em `http://localhost:3001/v1` · Frontend em `http://localhost:5173`

## Scripts

| Comando            | Descrição                |
| ------------------ | ------------------------ |
| `pnpm dev`         | Frontend (Vite)          |
| `pnpm server:dev`  | Backend (Hono com watch) |
| `pnpm build`       | Build de produção        |
| `pnpm test`        | Testes frontend          |
| `pnpm test:server` | Testes backend           |
| `pnpm db:migrate`  | Prisma migrate dev       |
| `pnpm db:seed`     | Popular banco            |
| `pnpm db:studio`   | Prisma Studio            |
| `pnpm lint`        | ESLint                   |

## Variáveis de Ambiente

| Variável       | Descrição                 | Padrão                  |
| -------------- | ------------------------- | ----------------------- |
| `DATABASE_URL` | Conexão PostgreSQL        | `postgresql://...`      |
| `JWT_SECRET`   | Chave para assinar tokens | obrigatório             |
| `PORT`         | Porta do servidor         | `3001`                  |
| `CORS_ORIGIN`  | Origins permitidas        | `http://localhost:5173` |

## Arquitetura

```
server/
├── index.ts           → Bootstrap + middlewares globais
├── lib/               → Infraestrutura (response, errors, validate, crypto, cache, rate-limit, logger, auth)
├── schemas/           → Validação Zod por domínio
├── dto/               → Data Transfer Objects (formatação de resposta)
├── services/          → Regras de negócio + queries Prisma
└── routes/            → Handlers HTTP (thin controllers)

prisma/
├── schema.prisma      → 18 modelos com índices
├── seed.ts            → Dados de teste
└── migrations/        → Migrations versionadas
```

### Princípios

- **Separação por domínio**: cada feature tem seus schemas, DTOs, services e routes
- **Controllers finos**: routes só roteiam e respondem, sem lógica de negócio
- **Services**: concentram regras e queries, sem depender de HTTP
- **DTOs**: transformam modelos do banco no formato que o frontend espera
- **Validação em camadas**: Zod nos endpoints + Tipagem TypeScript

## API

Todas as rotas sob `/v1/`.

### Autenticação

```
POST /v1/auth/signup   → { user, accessToken, refreshToken }
POST /v1/auth/login    → { user, accessToken, refreshToken }
POST /v1/auth/refresh  → { refreshToken } → { user, accessToken, refreshToken }
GET  /v1/auth/me       → User (requer Bearer token)
POST /v1/auth/logout   → { message }
```

### Domínios (requerem autenticação)

| Grupo           | Rotas                                                                             |
| --------------- | --------------------------------------------------------------------------------- |
| Agenda          | CRUD agendamentos, confirmação, cancelamento, reagendamento, conflitos, sugestões |
| Clientes        | CRUD + filtros por status/busca                                                   |
| Equipe          | CRUD membros da equipe                                                            |
| Serviços        | CRUD + listagem agrupada por categoria                                            |
| Atendimentos    | CRUD com serviços prestados e insumos                                             |
| Pagamentos      | CRUD + métodos (PIX, crédito, débito, dinheiro)                                   |
| Fidelização     | Programa de pontos, promoções, transações                                         |
| Pós-Atendimento | Feedback e campanhas                                                              |
| Onboarding      | Configuração inicial (dados, horários, serviços, equipe)                          |
| Dashboard       | Métricas, hoje, analytics, status                                                 |
| Relatórios      | KPIs por período                                                                  |
| Configurações   | Preferências da empresa                                                           |

### Formato de Resposta

```json
// Sucesso
{
  "success": true,
  "data": { ... },
  "meta": { "timestamp": "...", "requestId": "..." }
}

// Sucesso com paginação
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "timestamp": "...",
    "requestId": "...",
    "page": 1,
    "perPage": 50,
    "total": 100,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}

// Erro
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": { "email": ["E-mail inválido"] }
  },
  "meta": { "timestamp": "...", "requestId": "..." }
}
```

## Segurança

- Senhas hashadas com **scrypt** + salt + timingSafeEqual
- **JWT** (HS256) com access token (15min) + refresh token (7 dias)
- **Rate limiting** por IP (120 req/min geral, 20 req/min em auth)
- **Security headers** (HSTS, XSS, contentType, etc.)
- **CORS** configurável por ambiente
- **Validação Zod** em todo input
- SQL Injection eliminado pelo Prisma (queries parametrizadas)

## Testes

```bash
pnpm test:server       # 20 testes (crypto, cache, errors, rate-limit)
pnpm test:server:watch # Modo watch
pnpm test              # Testes frontend
```
