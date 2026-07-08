# DevOps — Infinity Partner

## Visão

Pipeline, deploy, ambientes, variáveis, backup, monitoramento, logs.

## Ambientes

| Ambiente | URL | Mock |
|---|---|---|
| Development | `http://localhost:5173` | Sim (MSW) |
| Homologação | `https://homolog.infinity-partner.com.br` | Sim (MSW) |
| Produção | `https://infinity-partner.com.br` | Não |

## Pipeline (GitHub Actions)

```mermaid
flowchart LR
    PUSH["Push / PR"] --> CI["CI: Lint + Test + Build"]
    CI --> HOMOLOG["Deploy: Homologação"]
    HOMOLOG --> SAST["SAST + Tests E2E"]
    SAST --> PROD["Deploy: Produção<br/>(manual via tag)"]
```

## Deploy

### Frontend

- Build: `pnpm build` → `dist/`
- Deploy: Vercel / Cloudflare Pages / S3 + CloudFront
- Static assets com cache infinito e hash no filename

### Backend

- Build: `tsc -b` → `dist/`
- Deploy: Docker container rodando em Cloud Run / ECS / Railway
- Health check: `GET /health`

### Banco

- PostgreSQL 16 gerenciado (Neon / RDS / Supabase)
- Migrations via Prisma no startup (ou em step separado)
- Backup automático diário

## Variáveis de ambiente

```bash
# Frontend (Vite: VITE_*)
VITE_API_URL=https://api.infinity-partner.com.br
VITE_ENV=production

# Backend
DATABASE_URL=postgresql://user:pass@host:5432/infinity_partner
JWT_SECRET=<chave-segura-de-256-bits>
PORT=3001
CORS_ORIGIN=https://infinity-partner.com.br
```

## Docker

```yaml
# docker-compose.yml (dev)
services:
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: infinity_partner
      POSTGRES_USER: infinity
      POSTGRES_PASSWORD: infinity123
```

## Monitoramento

- **Logs:** Estrutura JSON padronizada no backend, coletados via stdout (Cloud Logging / Datadog)
- **Métricas:** Uso de CPU/memória, requisições por segundo, latência p95, taxa de erro
- **Alertas:** Erro 500 > 1% → notifica no Discord/Slack
- **Uptime:** Monitoramento sintético a cada 5 minutos

## Backup

- Banco: snapshot diário automático (retenção 30 dias)
- Assets: armazenados em S3/R2 com versionamento
- Código: Git (GitHub)
