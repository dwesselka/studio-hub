# Segurança — StudioHub

## Visão

Estratégia de segurança: JWT, refresh token, rate limit, CORS, headers, proteção contra ataques.

## Autenticação

### JWT (HS256)

- **Access Token:** 15 minutos
- **Refresh Token:** 7 dias
- **Storage:** SafeLocalStorage (com fallback in-memory para navegação anônima)
- **Header:** `Authorization: Bearer <accessToken>`

### Fluxo de renovação

Quando o access token expira, o frontend usa o refresh token para obter um novo:

```
401 → POST /v1/auth/refresh { refreshToken } → { newAccessToken, newRefreshToken }
```

## Senhas

- **Algoritmo:** scrypt (Node.js crypto)
- **Salt:** automático por usuário
- **Comparação:** timingSafeEqual (proteção contra timing attack)

```typescript
// server/lib/crypto.ts
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex')
  const key = await scrypt(password, salt, 64)
  return `${salt}:${key.toString('hex')}`
}
```

## Rate Limit

| Rota                | Limite          | Janela   |
| ------------------- | --------------- | -------- |
| Geral (`/v1/*`)     | 120 requisições | 1 minuto |
| Auth (`/v1/auth/*`) | 20 requisições  | 1 minuto |

Implementado em memória (servidor único). Para escala, migrar para Redis.

## Headers de Segurança

Aplicados via middleware `secureHeaders` do Hono:

- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 0`
- `Referrer-Policy: strict-origin-when-cross-origin`

## CORS

```typescript
app.use(
  '/*',
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'],
    credentials: true,
  }),
)
```

## Proteções

| Ameaça        | Mitigação                                                   |
| ------------- | ----------------------------------------------------------- |
| SQL Injection | Eliminado pelo Prisma (queries parametrizadas)              |
| XSS           | React escapa HTML automaticamente + Content Security Policy |
| CSRF          | SameSite cookies + token em header                          |
| Brute Force   | Rate limit + scrypt (lento por design)                      |
| Token Leak    | Access token curto (15min) + refresh token rotativo         |
| Timing Attack | timingSafeEqual na comparação de senhas                     |

## Futuro (Fase 2)

- Multi-tenancy com isolamento por schema ou `tenantId`
- RBAC completo (proprietário, admin, profissional, recepcionista)
- Auditoria de ações (logs imutáveis)
