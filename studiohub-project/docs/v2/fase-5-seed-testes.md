# Fase 5 — Seed + Testes

## Objetivo

Povoar o banco com dados de exemplo de todos os perfis e validar o fluxo.

---

## Task 5.1 — Atualizar seed com perfis

**Arquivo:** `prisma/seed.ts`

**O que fazer:**

- Manter o seed de lojistas atual
- Adicionar 2 profissionais com `User { role: profissional }`
- Adicionar 3 clientes com `User { role: cliente }`

**Fluxo do seed:**

```
1. Cria lojista (como hoje)
2. Cria TeamMember vinculado
3. Cria User { role: profissional, businessOwnerId, teamMemberId }
4. Cria Cliente
5. Cria User { role: cliente, businessOwnerId, clienteId }
```

**Aprendizado:** Seed data complexa com relações entre modelos

---

## Task 5.2 — Testar login como profissional

**Script manual:**

```bash
# Login como profissional
curl -X POST http://localhost:3001/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"profissional@teste.com","password":"123456"}'

# Tentar acessar rota de lojista → deve dar 403
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/v1/clientes
```

**Aprendizado:** Teste manual de autorização, validação de 403

---

## Task 5.3 — Testes automatizados (Vitest)

**Arquivo:** `server/__tests__/auth.test.ts`

**O que testar:**

- Login como lojista → acesso total
- Login como profissional → 403 em rota restrita
- Login como profissional → 200 em rota permitida
- Token inválido → 401
- Token expirado → 401

**Aprendizado:** Testes de API com contexto autenticado, describe/it organizado

---

## Task 5.4 — Testar fluxo de convite

**Fluxo manual:**

1. Lojista cria profissional na tela de equipe
2. Chama endpoint de convite
3. Abre link `/convite?token=xxx` em aba anônima
4. Define senha
5. Login como profissional
6. Verifica acesso restrito

**Aprendizado:** Fluxo completo end-to-end, validação de experiência do usuário
