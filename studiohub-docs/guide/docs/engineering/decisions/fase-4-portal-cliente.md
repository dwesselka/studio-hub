# Fase 4 — Portal do Cliente

## Objetivo

Criar as páginas que o cliente acessa após logar no portal.

---

## Task 4.1 — Dashboard do cliente

**Arquivo:** `src/features/cliente/pages/dashboard.tsx`

**Endpoint:** `GET /v1/cliente/dashboard`

**O que mostra:**

- "Olá, [nome] 👋"
- Próximo agendamento (se tiver)
- Pontos de fidelidade
- Aviso se não tiver agendamento futuro

**Aprendizado:** Dashboard contextual, feedback visual de estado vazio

---

## Task 4.2 — Meus Agendamentos

**Arquivo:** `src/features/cliente/pages/agendamentos.tsx`

**Endpoint:** `GET /v1/cliente/agendamentos`

**Funcionalidades:**

- Lista de agendamentos passados e futuros
- Cancelar agendamento (se status = pending)
- Ver detalhes: data, horário, profissional, serviço, valor

**Aprendizado:** CRUD do lado do cliente, ações condicionais (só cancela se pending)

---

## Task 4.3 — Fidelidade

**Arquivo:** `src/features/cliente/pages/fidelidade.tsx`

**Endpoint:** `GET /v1/cliente/fidelidade`

**O que mostra:**

- Saldo de pontos
- Promoções disponíveis
- Histórico de pontos ganhos/gastos

**Aprendizado:** Consulta de fidelidade do ponto de vista do cliente

---

## Task 4.4 — Perfil

**Arquivo:** `src/features/cliente/pages/perfil.tsx`

**O que faz:**

- Editar nome, telefone
- Alterar senha
- Ver email (bloqueado)

**Aprendizado:** Edição de perfil, formulário controlado com validação

---

## Task 4.5 — Endpoints do cliente (backend)

**Arquivo:** `server/routes/cliente.ts`

**Endpoints:**

| Endpoint                                      | Descrição                    |
| --------------------------------------------- | ---------------------------- |
| `GET /v1/cliente/dashboard`                   | Próximo agendamento + pontos |
| `GET /v1/cliente/agendamentos`                | Histórico do cliente         |
| `PATCH /v1/cliente/agendamentos/:id/cancelar` | Cancelar agendamento         |
| `GET /v1/cliente/fidelidade`                  | Pontos e promoções           |
| `PATCH /v1/cliente/perfil`                    | Atualizar nome, telefone     |

**Aprendizado:** REST API do ponto de vista do cliente, permissões mínimas

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
