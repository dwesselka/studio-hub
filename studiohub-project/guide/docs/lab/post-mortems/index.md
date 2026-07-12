# 🔬 Post Mortems

> Análises profundas após incidentes significativos. O objetivo não é culpar pessoas — é melhorar sistemas.

::: tip A filosofia do Post Mortem
"Postmortems are blameless. We focus on the systems and processes, not the individuals."  
— Google SRE Book
:::

<div class="dashboard-grid">

<div class="metric-card">
  <span class="metric-icon">🔬</span>
  <span class="metric-label">Post Mortems</span>
  <span class="metric-value">8</span>
  <span class="metric-sub">Documentados</span>
</div>

<div class="metric-card">
  <span class="metric-icon">📐</span>
  <span class="metric-label">ADRs Gerados</span>
  <span class="metric-value">12</span>
  <span class="metric-sub">A partir de PMs</span>
</div>

<div class="metric-card">
  <span class="metric-icon">🧪</span>
  <span class="metric-label">Testes Adicionados</span>
  <span class="metric-value">34</span>
  <span class="metric-sub">Por causa de PMs</span>
</div>

</div>

## Registro de Post Mortems

| PM                                 | Incidente                           | Resumo                                         | Data     | ADRs |
| ---------------------------------- | ----------------------------------- | ---------------------------------------------- | -------- | ---- |
| [PM-001](/lab/post-mortems/pm-001) | [#014](/lab/incidents/incident-014) | Índice inexistente causou lentidão em produção | Jun 2026 | 2    |
| PM-002                             | #013                                | Race condition no agendamento simultâneo       | Jun 2026 | 1    |
| PM-003                             | #015                                | JWT expirado não tratado no cliente            | Jun 2026 | 1    |

---

## Template de Post Mortem

```markdown
# PM-XXX: [Título]

**Incidente:** #XXX  
**Data:** DD/MM/YYYY  
**Autores:** @nome  
**Status:** Rascunho / Em revisão / Publicado

---

## O que aconteceu?

Resumo executivo em 2–3 linhas.

## Como descobrimos?

Via alerta / usuário reportou / monitoramento.

## Por que aconteceu?

Causa raiz (não sintoma).

## Como foi resolvido?

Ações tomadas, tempo de resolução.

## Como evitar no futuro?

Mudanças de processo, código, infra.

## Quais ADRs foram gerados ou modificados?

- [ ] ADR-XXX: ...

## Quais testes foram adicionados?

- [ ] Teste de X em Y
```
