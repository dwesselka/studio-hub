# 🏗️ Architecture Reviews

> Cada feature importante passa por uma Architecture Review antes do código existir. Esse é o processo que separa engenharia amadora de engenharia profissional.

::: tip Por que fazer Architecture Reviews?

- Detectar problemas antes de escrever uma linha de código
- Documentar trade-offs e alternativas consideradas
- Criar registro histórico das decisões
- Aprender com o processo de design
  :::

<div class="dashboard-grid">

<div class="metric-card">
  <span class="metric-icon">🏗️</span>
  <span class="metric-label">Reviews Concluídas</span>
  <span class="metric-value">12</span>
  <span class="metric-sub">Desde Jan 2026</span>
</div>

<div class="metric-card">
  <span class="metric-icon">📐</span>
  <span class="metric-label">ADRs Gerados</span>
  <span class="metric-value">18</span>
  <span class="metric-sub">A partir das reviews</span>
</div>

<div class="metric-card">
  <span class="metric-icon">🎯</span>
  <span class="metric-label">Taxa de Acerto</span>
  <span class="metric-value">89%</span>
  <span class="metric-sub">Decisões sem revisão</span>
</div>

</div>

## Registro de Reviews

| AR                                                             | Feature              | Decisão                 | Sprint    | Status      |
| -------------------------------------------------------------- | -------------------- | ----------------------- | --------- | ----------- |
| [AR-Geolocation](/engineering/lab/arch-reviews/ar-geolocation) | Geolocalização       | PostGIS + Redis         | Sprint 04 | ✅ Aprovada |
| AR-Auth                                                        | Autenticação         | JWT + Refresh Token     | Sprint 01 | ✅ Aprovada |
| AR-Cache                                                       | Estratégia de Cache  | Redis com TTL variável  | Sprint 02 | ✅ Aprovada |
| AR-BFF                                                         | Backend for Frontend | BFF dedicado            | Sprint 02 | ✅ Aprovada |
| AR-Observability                                               | Observabilidade      | OpenTelemetry + Grafana | Sprint 03 | ✅ Aprovada |

---

## Template de Architecture Review

```markdown
# AR-XXX: [Nome da Feature]

**Sprint:** XX  
**Autor:** @nome  
**Status:** Rascunho / Em revisão / Aprovada

## Problema

O que precisa ser resolvido?

## Contexto

Por que isso é importante agora?

## Alternativas Consideradas

### Opção A — [Nome]

Descrição, prós, contras.

### Opção B — [Nome]

Descrição, prós, contras.

### Opção C — [Nome]

Descrição, prós, contras.

## Decisão

Qual alternativa foi escolhida e por quê.

## Trade-offs

O que abrimos mão ao escolher essa solução?

## Riscos

Quais riscos essa decisão introduce?

## ADRs Gerados

- [ ] ADR-XXX: ...
```

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
