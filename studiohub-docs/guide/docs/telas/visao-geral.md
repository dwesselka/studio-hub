# Telas do Sistema

Visão geral das principais telas do StudioHub.

## Mapa de Navegação

```
Landing Page (pública)
├── /cadastro → Onboarding
├── /login   → Login
└── /app     → Dashboard (autenticado)
    ├── /app/agendamentos   → Agenda
    ├── /app/atendimento    → Atendimento
    ├── /app/clientes       → Clientes
    ├── /app/servicos       → Serviços
    ├── /app/equipe         → Equipe
    ├── /app/pagamentos     → Pagamentos
    ├── /app/fidelizacao    → Fidelização
    ├── /app/relatorios     → Relatórios
    ├── /app/analytics      → Analytics
    ├── /app/configuracoes  → Configurações
    └── /app/pos-atendimento → Pós-Atendimento
```

## Layout Padrão (App)

Todas as telas autenticadas compartilham:

| Região     | Componente       | Descrição                                           |
| ---------- | ---------------- | --------------------------------------------------- |
| Topo       | `app-header`     | Logo, busca global, avatar do usuário, notificações |
| Lateral    | `app-sidebar`    | Navegação entre módulos, colapsável                 |
| Breadcrumb | `app-breadcrumb` | Indicador de localização atual                      |
| Conteúdo   | (page component) | Área principal da funcionalidade                    |

## Stack de Telas

| Tela                              | Descrição                                             |
| --------------------------------- | ----------------------------------------------------- |
| [Landing Page](/telas/landing)    | Página institucional com segmentos salão/barbearia    |
| [Dashboard](/telas/dashboard)     | Métricas do dia, ocupação, faturamento, agenda do dia |
| [Agenda](/telas/agenda)           | Grade de horários, agendamentos, conflitos            |
| [Atendimento](/telas/atendimento) | Fila de atendimentos em andamento                     |
| [Clientes](/telas/clientes)       | CRUD + busca/filtro de clientes                       |
| [Pagamentos](/telas/pagamentos)   | Registro e histórico de pagamentos                    |
