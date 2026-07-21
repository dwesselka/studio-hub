# Fase 0 — Fundação (Backend)

## Objetivo

Preparar o banco e o servidor para suportar múltiplos perfis de acesso.

---

## Task 0.1 — Adicionar role enum ao schema Prisma

**Arquivo:** `prisma/schema.prisma`

**O que fazer:**

1. Criar enum `Role` com os valores `lojista`, `profissional`, `cliente`
2. Adicionar campo `role Role @default(lojista)` ao model `User`
3. Adicionar campo `businessOwnerId String?` (self-relation)
4. Adicionar relação `businessOwner User? @relation("BusinessOwner", fields: [businessOwnerId], references: [id])`
5. Adicionar relação `staffAccounts User[] @relation("BusinessOwner")`
6. Adicionar campo `teamMemberId String? @unique`
7. Adicionar relação `teamMember TeamMember? @relation(fields: [teamMemberId], references: [id])`
8. Adicionar campo `clienteId String? @unique`
9. Adicionar relação `cliente Cliente? @relation(fields: [clienteId], references: [id])`

**Aprendizado:** Enum no Prisma, self-relation (auto-relacionamento), relação opcional

**Critério de aceite:** `npx prisma generate` compila sem erros

---

## Task 0.2 — Criar migration

**Comando:** `npx prisma migrate dev --name add-role-perfis`

**O que fazer:**

1. Rodar a migration
2. Verificar o SQL gerado em `prisma/migrations/`
3. Atualizar os usuários existentes: `UPDATE "User" SET role = 'lojista'`

**Aprendizado:** Migration segura, backfill de dados existentes

**Critério de aceite:** Banco atualizado sem perda de dados, seed ainda funciona

---

## Task 0.3 — Atualizar `authGuard` para popular role

**Arquivo:** `server/lib/middleware.ts`

**O que fazer:**

- No `authGuard`, após verificar o token e carregar o user:
  ```typescript
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, role: true, businessOwnerId: true },
  })
  c.set('userRole', user.role)
  c.set('businessOwnerId', user.businessOwnerId ?? user.id)
  ```

**Aprendizado:** Contexto por request no Hono (`c.set` / `c.get`), consulta seletiva com Prisma

**Critério de aceite:** Rotas logadas conseguem ler `c.get('userRole')`

---

## Task 0.4 — Criar middleware `roleGuard`

**Arquivo:** `server/lib/middleware.ts`

**O que fazer:**

```typescript
export function roleGuard(...allowedRoles: string[]) {
  return async (c: Context, next: Next) => {
    const userRole = c.get('userRole') as string
    if (!allowedRoles.includes(userRole)) {
      return c.json({ error: 'FORBIDDEN', message: 'Acesso não autorizado' }, 403)
    }
    await next()
  }
}
```

**Aprendizado:** Higher-order function como middleware, rest params

**Critério de aceite:** Testar com curl: rota com `roleGuard('lojista')` retorna 403 se token for de profissional

---

## Task 0.5 — Atualizar response do `/v1/auth/me`

**Arquivo:** `server/routes/auth.ts`

**O que fazer:** Incluir `role`, `businessOwnerId`, `businessName`, `businessLogo` na resposta do `/me`

**Aprendizado:** Versionamento de API response, compatibilidade com frontend atual

**Critério de aceite:** `GET /v1/auth/me` retorna os novos campos

---

## Task 0.6 — Atualizar `normalizeUser` no frontend

**Arquivo:** `src/features/auth/context.tsx`

**O que fazer:** Extrair `role` do `RawUser` e incluir no `AuthUser` normalizado

**Aprendizado:** Mapeamento de API response para modelo do frontend, type safety

**Critério de aceite:** `user.role` disponível no `AuthContext`

---

## Resumo Fase 0

| Task | Arquivos                        | Status |
| ---- | ------------------------------- | ------ |
| 0.1  | `prisma/schema.prisma`          | ⏳     |
| 0.2  | Migration                       | ⏳     |
| 0.3  | `server/lib/middleware.ts`      | ⏳     |
| 0.4  | `server/lib/middleware.ts`      | ⏳     |
| 0.5  | `server/routes/auth.ts`         | ⏳     |
| 0.6  | `src/features/auth/context.tsx` | ⏳     |

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
