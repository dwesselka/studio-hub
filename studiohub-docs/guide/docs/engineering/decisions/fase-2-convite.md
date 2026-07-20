# Fase 2 — Convite do Profissional

## Objetivo

Lojista cria profissional na tela de equipe → profissional recebe convite e define senha.

---

## Task 2.1 — Model InviteToken

**Arquivo:** `prisma/schema.prisma`

**Modelo:**

```prisma
model InviteToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String   // ID do lojista que convida
  email     String   // Email do profissional
  teamMemberId String
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())
}
```

**Aprendizado:** Token de uso único, expiração, modelo de dado temporal

---

## Task 2.2 — Endpoint POST /v1/equipe/:id/convite

**Arquivo:** `server/routes/equipe.ts`

**O que faz:**

1. Gera token aleatório (crypto.randomUUID)
2. Salva `InviteToken` com expiração de 48h
3. Retorna link: `/convite?token=xxx`

**Aprendizado:** Geração segura de token, endpoint de ação

---

## Task 2.3 — Página pública /convite

**Arquivo:** `src/pages/ConvitePage.tsx`

**O que faz:**

- Lê `?token=` da URL
- Valida token (chama endpoint)
- Exibe formulário: email (bloqueado), nome, senha
- Submit → ativa conta

**Aprendizado:** Página pública com validação de token, formulário controlado

---

## Task 2.4 — Endpoint POST /v1/auth/ativar-convite

**Arquivo:** `server/routes/auth.ts`

**O que faz:**

1. Recebe `{ token, name, password }`
2. Valida token (existe, não expirado, não usado)
3. Marca `usedAt`
4. Cria `User { role: profissional, businessOwnerId, teamMemberId }`
5. Retorna tokens de acesso

**Aprendizado:** Transação Prisma (`$transaction`), validação + criação atômica

---

## Task 2.5 — Link de convite na tela de equipe

**Arquivo:** `src/features/equipe/`

**O que faz:** Botão "Convidar" ao lado de cada membro sem user vinculado. Copia link pro clipboard.

**Aprendizado:** Estado condicional por registro, clipboard API
