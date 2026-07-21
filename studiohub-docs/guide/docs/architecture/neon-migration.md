# Migração: Mock In-Memory → Neon (PostgreSQL Serverless)

## Objetivo

Substituir o banco PostgreSQL local (Docker) pelo **Neon** (PostgreSQL serverless gratuito) e eliminar a dependência do mock em homologação/produção, mantendo o mock apenas para desenvolvimento local.

## Stack Final

| Camada   | Tecnologia                       | Custo                |
| -------- | -------------------------------- | -------------------- |
| Frontend | Vite + React + Tailwind          | ✅ Gratuito          |
| Backend  | Hono + Prisma                    | ✅ Gratuito          |
| Banco    | **Neon** (PostgreSQL serverless) | ✅ Free tier (0.5GB) |
| Mock     | In-memory (só em `development`)  | ✅ Gratuito          |

## Arquivos Afetados

### Fase 1 — Conectar Neon

| Arquivo                | O que muda                                         |
| ---------------------- | -------------------------------------------------- |
| `.env`                 | `DATABASE_URL` aponta para Neon (remove localhost) |
| `.env.homologation`    | `DATABASE_URL` = Neon                              |
| `.env.production`      | `DATABASE_URL` = Neon                              |
| `prisma/schema.prisma` | **Nada** (já usa `postgresql` provider)            |
| `docker-compose.yml`   | Remove (ou mantém só para dev local)               |

Não precisa alterar schema Prisma — o provider já é `postgresql` e as migrations existem.

### Fase 2 — Ajustar Frontend (mock vs real)

| Arquivo                      | O que muda                                        |
| ---------------------------- | ------------------------------------------------- |
| `.env.development`           | `VITE_API_URL=http://localhost:3001/v1`           |
| `.env.homologation`          | `VITE_API_URL=https://api-homolog.exemplo.com/v1` |
| `.env.production`            | `VITE_API_URL=https://api.studiohub.app/v1`       |
| `src/lib/api/environment.ts` | Revisar `realApiHandler` para prefixo `/v1`       |
| `src/lib/api/real-client.ts` | Verificar montagem de URL                         |

### Fase 3 — Manter Mocks Apenas em Dev

O mecanismo já existe em `environment.ts`:

```ts
if (config.mockEnabled) {
  registerAuthHandlers()
  registerOnboardingHandlers()
  registerAgendaHandlers()
  registerDashboardHandlers()
  mockServer.start()
} else {
  apiClient.setHandler(realApiHandler)
}
```

Ambientes:

- `development` → `mockEnabled: true` (usa mocks)
- `homologation` → `mockEnabled: false` (usa backend real)
- `production` → `mockEnabled: false` (usa backend real)

## Passo a Passo

```bash
# 1. Criar conta em neon.tech, obter DATABASE_URL

# 2. Atualizar .env
DATABASE_URL="postgresql://user:pass@ep-xxxx.neon.tech/studiohub?sslmode=require"

# 3. Rodar migrations no Neon
pnpm db:push

# 4. Seed dados iniciais
pnpm db:seed

# 5. Testar servidor local
pnpm server:dev

# 6. Testar frontend apontando pro server real
pnpm dev
```

## Deploy Gratuito

### Opção A — Render + Neon (recomendado)

- Backend Hono deploya no **Render** (Web Service, free tier 750h/mês)
- Neon como banco externo
- Custo: **$0**
- ⚠️ Render free "dorme" após 15 min inatividade (acorda em ~30s)

### Opção B — Cloudflare Workers + Neon

- Worker não dorme, edge global
- Adaptar Hono para Workers (trocar `serve` por `app.fetch`)
- Custo: **$0** (100k req/dia)

## Mocks Removidos

Em homologação/produção, estes arquivos não são carregados:

- `src/lib/api/handlers/auth.ts`
- `src/lib/api/handlers/onboarding.ts`
- `src/lib/api/handlers/agenda.ts`
- `src/lib/api/handlers/dashboard.ts`

Permanecem apenas em desenvolvimento:

- `src/lib/api/server.ts` (MockServer)
- `src/lib/api/simulator.ts`
- `src/lib/api/db.ts` (banco in-memory)

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
