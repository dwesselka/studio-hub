# Fase 1 — Autorização nas Rotas

## Objetivo

Aplicar `roleGuard` em todas as rotas do backend conforme a matriz de permissões.

---

## Matriz de acesso

| Rota                             | Lojista         | Profissional | Cliente |
| -------------------------------- | --------------- | ------------ | ------- |
| `GET /v1/dashboard`              | ✅ dados gerais | ✅ próprio   | ❌      |
| `GET /v1/dashboard/profissional` | ❌              | ✅           | ❌      |
| `GET/POST /v1/agenda`            | ✅ todos        | ✅ própria   | ❌      |
| `GET/POST /v1/atendimento`       | ✅ todos        | ✅ próprios  | ❌      |
| `GET/POST /v1/clientes`          | ✅ CRUD         | ✅ consulta  | ❌      |
| `GET/POST /v1/pagamentos`        | ✅              | ❌           | ❌      |
| `GET/POST /v1/equipe`            | ✅              | ❌           | ❌      |
| `GET/POST /v1/servicos`          | ✅              | ❌           | ❌      |
| `GET/POST /v1/configuracoes`     | ✅              | ❌           | ❌      |
| `GET/POST /v1/fidelizacao`       | ✅ admin        | ✅ consulta  | ❌      |
| `GET/POST /v1/campanhas`         | ✅              | ❌           | ❌      |
| `GET/POST /v1/insumos`           | ✅              | ❌           | ❌      |

---

## Task 1.1 — Aplicar roleGuard nas rotas existentes

**Arquivos:** Cada arquivo em `server/routes/`

**O que fazer:** Adicionar `roleGuard('lojista')` ou `roleGuard('lojista', 'profissional')` após o `authGuard` em cada grupo de rotas.

**Aprendizado:** Composição de middlewares no Hono, leitura de código legado para aplicar regras

**Critério:** Fazer requisição com token de profissional em rota de lojista → 403

---

## Task 1.2 — Filtrar queries por businessOwnerId

**Arquivos:** `server/routes/*.ts`

**O que fazer:** Onde houver `where: { userId }`, substituir por:

```typescript
const businessOwnerId = c.get('businessOwnerId')
const userId = c.get('userId')

// Se for profissional ou cliente, filtrar pelo dono
where: { userId: businessOwnerId }

// Se for profissional, filtrar também pelo próprio registro
where: { userId: businessOwnerId, professionalId: userId }
```

**Aprendizado:** Isolamento de dados multi-tenant, consulta segura por perfil

**Critério:** Profissional logado vê apenas agendamentos dele, não do salão inteiro

---

## Task 1.3 — Endpoint de dashboard do profissional

**Arquivo:** `server/routes/dashboard.ts`

**Endpoint:** `GET /v1/dashboard/profissional`

**O que retorna:**

- Total de atendimentos hoje
- Próximos agendamentos
- Receita gerada no dia
- Ocupação da agenda

**Aprendizado:** Query agregada por profissional, separação de responsabilidade

**Critério:** Lojista NÃO acessa esse endpoint, profissional SIM

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
