# Agenda

Gerenciamento de agendamentos com grade visual.

## Layout

```
┌──────────────────────────────────────────────┐
│ 📅 Agenda                     [+ Novo]        │
├──────────────────────────────────────────────┤
│ [Hoje] [Amanhã] [Semana] [Mês]  ← Filtros   │
├──────────────────────────────────────────────┤
│ ┌───┬──────────┬────────┬────────┬────────┐  │
│ │   │ 09:00    │ 10:00  │ 11:00  │ 14:00  │  │
│ ├───┼──────────┼────────┼────────┼────────┤  │
│ │   │Ana Costa│        │        │Juliana │  │
│ │Cam│ Corte + │        │        │Mani Gel│  │  ← Grade
│ │ila│ Barba   │        │        │        │  │
│ ├───┼──────────┼────────┼────────┼────────┤  │
│ │   │João M.  │        │        │        │  │
│ │Raf│ Corte   │        │        │        │  │
│ │ael│ Barba   │        │        │        │  │
│ └───┴──────────┴────────┴────────┴────────┘  │
├──────────────────────────────────────────────┤
│ Legenda: ✅ Confirmado  ⏳ Pendente  ❌ Vago │
└──────────────────────────────────────────────┘
```

## Funcionalidades

- CRUD completo de agendamentos
- Confirmação e cancelamento
- Reagendamento com verificação de conflitos
- Sugestão automática de horários disponíveis
- Filtro por profissional e serviço

## API

```
GET    /v1/agenda           → Lista agendamentos
POST   /v1/agenda          → Criar agendamento
PATCH  /v1/agenda/:id      → Atualizar
DELETE /v1/agenda/:id      → Cancelar
POST   /v1/agenda/confirm  → Confirmar
POST   /v1/agenda/reschedule → Reagendar
```

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
