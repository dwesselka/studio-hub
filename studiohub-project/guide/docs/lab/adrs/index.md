# 📐 ADRs — Architecture Decision Records

> O registro histórico de todas as decisões arquiteturais do StudioHub. Cada ADR documenta o contexto, as alternativas e a decisão final.

::: info O que é um ADR?
Um **Architecture Decision Record** é um documento curto que captura uma decisão arquitetural importante: o contexto em que foi tomada, as opções consideradas, a decisão e suas consequências.

Popularizado por Michael Nygard, é adotado por Netflix, Spotify, GitHub e Google.
:::

<div class="dashboard-grid">

<div class="metric-card">
  <span class="metric-icon">📐</span>
  <span class="metric-label">Total de ADRs</span>
  <span class="metric-value">28</span>
  <span class="metric-sub">Registrados</span>
</div>

<div class="metric-card">
  <span class="metric-icon">✅</span>
  <span class="metric-label">Ativos</span>
  <span class="metric-value">25</span>
  <span class="metric-sub">Em vigor</span>
</div>

<div class="metric-card">
  <span class="metric-icon">🔄</span>
  <span class="metric-label">Substituídos</span>
  <span class="metric-value">3</span>
  <span class="metric-sub">Superados</span>
</div>

</div>

## Registro de ADRs

| ADR     | Título                            | Decisão                          | Status   | Sprint    |
| ------- | --------------------------------- | -------------------------------- | -------- | --------- |
| ADR-028 | Retry policy em chamadas externas | Exponential backoff + jitter     | ✅ Ativo | Sprint 04 |
| ADR-027 | Estratégia de logging estruturado | Winston + JSON                   | ✅ Ativo | Sprint 03 |
| ADR-026 | Health check endpoints            | `/health` e `/ready` separados   | ✅ Ativo | Sprint 03 |
| ADR-025 | Tracing distribuído               | OpenTelemetry + Jaeger           | ✅ Ativo | Sprint 03 |
| ADR-022 | Redis cache para geocoding        | TTL de 24h por coordenada        | ✅ Ativo | Sprint 04 |
| ADR-021 | PostGIS para geo queries          | ST_DWithin + índice GIST         | ✅ Ativo | Sprint 04 |
| ADR-020 | Query analysis antes de deploy    | EXPLAIN ANALYZE obrigatório      | ✅ Ativo | —         |
| ADR-019 | Política de índices               | Índice para FK em tabelas > 100k | ✅ Ativo | —         |
| ADR-012 | BFF Pattern                       | BFF dedicado por plataforma      | ✅ Ativo | Sprint 02 |
| ADR-007 | Cache com Redis                   | Redis para cache e filas         | ✅ Ativo | Sprint 02 |
| ADR-003 | JWT + Refresh Token               | JWT de 15min + RT de 7 dias      | ✅ Ativo | Sprint 01 |
| ADR-001 | ORM                               | Prisma como ORM principal        | ✅ Ativo | Sprint 01 |

---

## Template de ADR

```markdown
# ADR-XXX: [Título]

**Data:** DD/MM/YYYY  
**Status:** Proposto / Aceito / Substituído / Obsoleto  
**Substitui:** ADR-YYY (se aplicável)

## Contexto

Por que essa decisão precisa ser tomada?

## Decisão

O que foi decidido?

## Alternativas Consideradas

- Opção A: ...
- Opção B: ...

## Consequências

### Positivas

- ...

### Negativas

- ...

## Notas

Qualquer contexto adicional.
```
