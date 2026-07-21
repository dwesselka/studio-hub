# Command Pocket

Referência rápida de todos os comandos, portas e URLs do StudioHub.

## Quick Start (6 comandos)

```bash
pnpm install        # Instalar dependências
pnpm db:up          # Subir PostgreSQL (Docker)
pnpm db:migrate     # Rodar migrations
pnpm db:seed        # Popular banco de teste
pnpm server:dev     # Backend (terminal 1)
pnpm dev            # Frontend (terminal 2)
```

## Portas & URLs

| Serviço               | Porta  | URL                                     | Comando                             |
| --------------------- | ------ | --------------------------------------- | ----------------------------------- |
| **Frontend (Vite)**   | `5173` | `http://localhost:5173`                 | `pnpm dev`                          |
| **Backend (Hono)**    | `3001` | `http://localhost:3001`                 | `pnpm server:dev`                   |
| **Swagger UI**        | `3001` | `http://localhost:3001/docs`            | (embutido no server)                |
| **OpenAPI JSON**      | `3001` | `http://localhost:3001/openapi.json`    | (embutido no server)                |
| **Health Check**      | `3001` | `http://localhost:3001/health`          | (embutido no server)                |
| **Prisma Studio**     | `5555` | `http://localhost:5555`                 | `pnpm db:studio`                    |
| **PostgreSQL**        | `5432` | `postgresql://localhost:5432/studiohub` | `pnpm db:up`                        |
| **Guide (VitePress)** | `5173` | `http://localhost:5173`                 | `pnpm docs:dev` (na pasta `guide/`) |

## Todos os Comandos

### Banco de Dados

| Comando            | Descrição                             |
| ------------------ | ------------------------------------- |
| `pnpm db:up`       | Sobe PostgreSQL via Docker            |
| `pnpm db:down`     | Derruba PostgreSQL                    |
| `pnpm db:migrate`  | Cria/roda migrations no banco local   |
| `pnpm db:push`     | Push do schema direto (sem migration) |
| `pnpm db:seed`     | Popula banco com dados de teste       |
| `pnpm db:studio`   | Abre Prisma Studio (localhost:5555)   |
| `pnpm db:reset`    | Reseta migrations + seed              |
| `pnpm db:generate` | Gera Prisma Client                    |

### Desenvolvimento

| Comando            | Descrição                              |
| ------------------ | -------------------------------------- |
| `pnpm dev`         | Frontend (Vite dev server, porta 5173) |
| `pnpm dev:homolog` | Frontend modo homologação              |
| `pnpm dev:prod`    | Frontend modo produção                 |
| `pnpm server:dev`  | Backend com hot-reload (porta 3001)    |
| `pnpm server`      | Backend sem watch                      |

### Build

| Comando              | Descrição                  |
| -------------------- | -------------------------- |
| `pnpm build`         | Build frontend produção    |
| `pnpm build:homolog` | Build frontend homologação |
| `pnpm build:prod`    | Build frontend produção    |
| `pnpm preview`       | Preview do build           |

### Testes

| Comando                     | Descrição                     |
| --------------------------- | ----------------------------- |
| `pnpm test`                 | Testes do frontend (Vitest)   |
| `pnpm test:watch`           | Testes frontend em modo watch |
| `pnpm test:server`          | Testes do backend             |
| `pnpm test:server:watch`    | Testes backend em modo watch  |
| `pnpm test:server:coverage` | Testes backend com cobertura  |

### Qualidade

| Comando       | Descrição                     |
| ------------- | ----------------------------- |
| `pnpm lint`   | ESLint (src/, zero warnings)  |
| `pnpm format` | Prettier (src/ .ts/.tsx/.css) |

### Guide (VitePress)

```bash
cd studiohub-docus/guide
pnpm docs:dev      # Desenvolvimento (localhost:5173)
pnpm docs:build    # Build estático
pnpm docs:preview  # Preview do build
```

## Variáveis de Ambiente

| Chave          | Obrigatório | Padrão (dev)                                                               | Descrição                  |
| -------------- | ----------- | -------------------------------------------------------------------------- | -------------------------- |
| `DATABASE_URL` | ✅          | `postgresql://studio_hub:studio123@localhost:5432/studiohub?schema=public` | Conexão PostgreSQL         |
| `JWT_SECRET`   | ✅          | `dev-secret-change-in-production-studio-hub-2026`                          | Chave para assinar JWT     |
| `PORT`         | ❌          | `3001`                                                                     | Porta do servidor Hono     |
| `CORS_ORIGIN`  | ❌          | `http://localhost:5173`                                                    | Origins permitidas no CORS |

## Ambientes

| Ambiente        | Arquivo `.env`      | Uso                 |
| --------------- | ------------------- | ------------------- |
| Desenvolvimento | `.env.development`  | `pnpm dev` (padrão) |
| Homologação     | `.env.homologation` | `pnpm dev:homolog`  |
| Produção        | `.env.production`   | `pnpm build:prod`   |
| Local (server)  | `.env`              | `pnpm server:dev`   |

## Docker

```bash
# Subir PostgreSQL
docker compose up -d

# Derrubar
docker compose down

# Ver logs
docker compose logs -f

# Acessar banco via CLI
docker exec -it infinity-postgres psql -U infinity -d studiohub
```

**Container:** `infinity-postgres` | **Imagem:** `postgres:16-alpine` | **Porta:** `5432`

## Atalhos Úteis

```bash
# Logs do servidor com timestamp
pnpm server:dev 2>&1 | cat

# Verificar se o banco está pronto
docker exec infinity-postgres pg_isready -U infinity

# Reset completo do ambiente
pnpm db:down && pnpm db:up && pnpm db:reset && pnpm db:seed

# Rodar tudo (2 terminais):
# Terminal 1: pnpm server:dev
# Terminal 2: pnpm dev
```

## Estrutura de Diretórios (resumo)

```
infinity-style/
├── src/            → Frontend React
├── server/         → Backend Hono
├── prisma/         → Schema + migrations
└── studiohub-prdocusoject/guide/ → Esta documentação
```

---

> 💡 **Dica:** Use `Ctrl+Shift+F` no VitePress Guide para buscar comandos específicos.

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
