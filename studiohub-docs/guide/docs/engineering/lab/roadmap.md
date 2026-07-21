# 🗺️ Roadmap

> Visão macro da evolução do StudioHub — cada feature é uma hipótese de engenharia.

## Legenda

| Status       | Símbolo |
| ------------ | ------- |
| Concluído    | ✅      |
| Em andamento | 🔄      |
| Planejado    | 📋      |
| Em análise   | 🔬      |

---

## Fase 1 — Fundação (Jan–Mar 2026)

| Feature                   | Tecnologia          | Status | Sprint    |
| ------------------------- | ------------------- | ------ | --------- |
| Autenticação JWT          | JWT + Prisma        | ✅     | Sprint 01 |
| RBAC (controle de acesso) | Prisma + middleware | ✅     | Sprint 01 |
| ORM e migrations          | Prisma              | ✅     | Sprint 01 |
| BFF Pattern               | Express + Axios     | ✅     | Sprint 02 |
| Cache Layer               | Redis               | ✅     | Sprint 02 |

---

## Fase 2 — Produto (Abr–Jun 2026)

| Feature           | Tecnologia           | Status | Sprint    |
| ----------------- | -------------------- | ------ | --------- |
| Geolocalização    | Google Maps API      | 🔄     | Sprint 04 |
| Observabilidade   | OpenTelemetry        | ✅     | Sprint 03 |
| Monitoramento     | Prometheus + Grafana | ✅     | Sprint 03 |
| Notificações Push | FCM                  | 📋     | Sprint 05 |
| Pagamentos        | Stripe               | 📋     | Sprint 06 |

---

## Fase 3 — Escala (Jul–Dez 2026)

| Feature         | Tecnologia            | Status | Sprint    |
| --------------- | --------------------- | ------ | --------- |
| Multi-tenancy   | Isolamento por schema | 📋     | Sprint 07 |
| CDN & Assets    | Cloudflare R2         | 📋     | Sprint 08 |
| Background Jobs | Bull + Redis          | 🔬     | —         |
| Rate Limiting   | Redis                 | 🔬     | —         |
| WebSockets      | Socket.io             | 🔬     | —         |

---

## ADRs Relacionados

- [ADR-001: Escolha do Prisma como ORM](/engineering/decisions/)
- [ADR-007: Redis para cache e filas](/engineering/decisions/)
- [ADR-012: BFF Pattern](/engineering/decisions/)

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
