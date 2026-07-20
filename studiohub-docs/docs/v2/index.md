# RBAC — Roadmap de Implementação

## Visão Geral

Implementar 3 perfis de acesso no StudioHub: **Lojista**, **Profissional** e **Cliente**.

## Fases

| Fase                      | O que faz                                  | Entrega                                                    |
| ------------------------- | ------------------------------------------ | ---------------------------------------------------------- |
| **0 — Fundação**          | Modelagem Prisma + Migration + middlewares | `role` no User, `authGuard` atualizado, `roleGuard` criado |
| **1 — Autorização**       | Fechar rotas por perfil                    | Nenhuma rota vaza dado entre perfis                        |
| **2 — Convite**           | Profissional recebe convite e cria senha   | Fluxo completo de ativação                                 |
| **3 — Guards + Rotas**    | Frontend protege rotas por perfil          | Lojista, profissional e cliente em rotas diferentes        |
| **4 — Portal do Cliente** | Páginas do cliente                         | Agendamentos, fidelidade, perfil                           |
| **5 — Seed + Testes**     | Dados de exemplo + validação               | Seed funcional com todos os perfis                         |

## Gitflow

```
feature/rbac-{fase}.{task}
  → PR para feature/rbac
  → merge na main quando fases estiverem estáveis
```

## Branch atual

`feature/branding-dynamic` — pausada.  
Nova branch: `feature/rbac` (criar na Fase 0).
