# Fase 3 — Guards + Rotas no Frontend

## Objetivo

Proteger rotas no frontend por perfil e criar layouts específicos.

---

## Task 3.1 — Adicionar role ao AuthUser

**Arquivo:** `src/features/onboarding/types.ts`

**O que fazer:** Adicionar `role: 'lojista' | 'profissional' | 'cliente'` na interface `AuthUser`

**Aprendizado:** Union types, manutenção de tipo com consistência da API

---

## Task 3.2 — AuthGuard aceitar role opcional

**Arquivo:** `src/features/auth/guard.tsx`

**O que fazer:**

- Aceitar prop `role?: 'lojista' | 'profissional' | 'cliente'`
- Se `role` for informado e não bater com `user.role` → redirect
- Se `role` não for informado → comportamento atual (só verifica se logado)

**Aprendizado:** Componente de guarda reutilizável, redirect condicional

---

## Task 3.3 — Rotas do profissional

**Arquivo:** `src/app/App.tsx`

**Rotas:**

```tsx
<Route
  path="/app/profissional"
  element={
    <AuthGuard role="profissional">
      <ProfessionalLayout />
    </AuthGuard>
  }
>
  <Route index element={<ProfessionalDashboard />} />
  <Route path="agenda" element={<MyAgendaPage />} />
  <Route path="atendimentos" element={<MyAtendimentosPage />} />
</Route>
```

**Aprendizado:** Layout swapping, rotas aninhadas por perfil

---

## Task 3.4 — ProfessionalLayout + Sidebar

**Arquivo:** `src/layouts/professional-layout.tsx`

**Sidebar do profissional:**

```
Dashboard (próprio)
Minha Agenda
Meus Atendimentos
```

**Aprendizado:** Componente de layout reutilizável, navegação restrita

---

## Task 3.5 — Páginas do profissional

**Arquivos:**

- `src/features/profissional/pages/dashboard.tsx`
- `src/features/profissional/pages/agenda.tsx`
- `src/features/profissional/pages/atendimentos.tsx`

**O que cada página faz:**

- Dashboard: cards com métricas do profissional
- Agenda: agenda filtrada pelo profissional logado
- Atendimentos: lista de atendimentos realizados

**Aprendizado:** Consumo de API com filtro por perfil, UI restrita

---

## Task 3.6 — Rotas do cliente

**Arquivo:** `src/app/App.tsx`

**Rotas:**

```tsx
<Route
  path="/portal"
  element={
    <AuthGuard role="cliente">
      <ClientLayout />
    </AuthGuard>
  }
>
  <Route index element={<ClientDashboard />} />
  <Route path="agendamentos" element={<ClientAgendamentos />} />
  <Route path="fidelidade" element={<ClientFidelidade />} />
  <Route path="perfil" element={<ClientPerfil />} />
</Route>
```
