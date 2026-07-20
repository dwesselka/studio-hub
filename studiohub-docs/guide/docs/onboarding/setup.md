# Setup

## Pré-requisitos

- Node.js >= 20
- pnpm
- Docker Desktop

## Passo a passo

```bash
# 1. Instalar dependências do projeto principal
cd infinity-style
pnpm install

# 2. Subir PostgreSQL local
pnpm db:up

# 3. Rodar migrations
pnpm db:migrate

# 4. Popular banco com dados de teste
pnpm db:seed

# 5. Iniciar backend (terminal 1)
pnpm server:dev

# 6. Iniciar frontend (terminal 2)
pnpm dev
```

## Acessos

| Serviço       | URL                          |
| ------------- | ---------------------------- |
| Frontend      | `http://localhost:5173`      |
| Backend       | `http://localhost:3001`      |
| Swagger UI    | `http://localhost:3001/docs` |
| Prisma Studio | `http://localhost:5555`      |

## Variáveis de Ambiente

Copie `.env.example` para `.env`:

| Chave          | Descrição          | Padrão                  |
| -------------- | ------------------ | ----------------------- |
| `DATABASE_URL` | Conexão PostgreSQL | `postgresql://...`      |
| `JWT_SECRET`   | Chave JWT          | obrigatório             |
| `PORT`         | Porta do servidor  | `3001`                  |
| `CORS_ORIGIN`  | Origins permitidas | `http://localhost:5173` |

---

> ⚡ **Precisa de uma referência rápida?** Veja o [Command Pocket](/command-pocket) com todos os comandos, portas e URLs em um só lugar.
