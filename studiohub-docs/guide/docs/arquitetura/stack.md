# Stack

| Camada           | Tecnologia                            | Função                                    |
| ---------------- | ------------------------------------- | ----------------------------------------- |
| **Frontend**     | React 19 + TypeScript 6 + Vite 8      | SPA com lazy loading, HMR rápido          |
| **Estilização**  | Tailwind CSS 4 + shadcn/ui + Radix UI | Componentes acessíveis e customizáveis    |
| **Estado/API**   | TanStack React Query 5                | Cache, deduplicação, refetch automático   |
| **Formulários**  | React Hook Form 7 + Zod 4             | Validação tipada                          |
| **Animação**     | Framer Motion 12                      | Transições e animações                    |
| **Backend**      | Hono.js 4 (TypeScript/Node 20)        | API REST rápida com OpenAPI nativo        |
| **ORM**          | Prisma 7 + PostgreSQL 16              | Queries tipadas, migrations versionadas   |
| **Autenticação** | JWT (HS256)                           | Access token (15min) + Refresh token (7d) |
| **Testes**       | Vitest 4 + Testing Library            | Testes unitários e de integração          |
| **Container**    | Docker                                | Apenas PostgreSQL em dev                  |

## Docker

Usado exclusivamente para subir PostgreSQL 16 local:

```bash
pnpm db:up    # docker compose up -d
pnpm db:down  # docker compose down
```

## Decisões Técnicas

- **Hono.js** sobre Express: mais leve, perfomático, suporte nativo a OpenAPI
- **Prisma** sobre TypeORM: queries tipadas, migrations versionadas, DX superior
- **Tailwind CSS 4** sobre CSS modules: produtividade, theming nativo, bundle menor
- **Vitest** sobre Jest: integração nativa com Vite, mais rápido, ESM first
- **shadcn/ui**: componentes copiáveis e customizáveis (não é uma lib instalada no node_modules)
