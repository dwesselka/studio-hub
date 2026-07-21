# 🚨 Incidents

> Registro completo de incidentes em produção. Cada incidente é uma lição — nunca desperdiçada.

::: tip Por que documentar incidentes?
Empresas de alto desempenho (Google, Netflix, Spotify) tratam incidentes como oportunidades de aprendizado. Documentar o que aconteceu, por que aconteceu e como evitar é parte fundamental da cultura de engenharia.
:::

<div class="dashboard-grid">

<div class="metric-card">
  <span class="metric-icon">🚨</span>
  <span class="metric-label">Total de Incidentes</span>
  <span class="metric-value">17</span>
  <span class="metric-sub">Desde Jan 2026</span>
</div>

<div class="metric-card">
  <span class="metric-icon">✅</span>
  <span class="metric-label">Resolvidos</span>
  <span class="metric-value">17</span>
  <span class="metric-sub">100% de resolução</span>
</div>

<div class="metric-card">
  <span class="metric-icon">⏱️</span>
  <span class="metric-label">MTTR Médio</span>
  <span class="metric-value">2h14</span>
  <span class="metric-sub">Mean Time to Resolve</span>
</div>

</div>

## Registro de Incidentes

| ID                                              | Ambiente | Descrição                                  | Severidade | Status       | MTTR  |
| ----------------------------------------------- | -------- | ------------------------------------------ | ---------- | ------------ | ----- |
| [#017](/engineering/lab/incidents/)             | Staging  | Timeout em query de relatório              | 🟡 Médio   | ✅ Resolvido | 45min |
| [#016](/engineering/lab/incidents/)             | Produção | Falha no envio de e-mail transacional      | 🟡 Médio   | ✅ Resolvido | 1h30  |
| [#015](/engineering/lab/incidents/)             | Produção | JWT expirado não tratado no cliente        | 🔴 Alto    | ✅ Resolvido | 2h00  |
| [#014](/engineering/lab/incidents/incident-014) | Produção | Lentidão generalizada — índice inexistente | 🔴 Alto    | ✅ Resolvido | 3h12  |
| [#013](/engineering/lab/incidents/)             | Staging  | Race condition no agendamento              | 🔴 Alto    | ✅ Resolvido | 4h45  |

_[Ver todos os incidentes...]_

---

## Como Registrar um Incidente

```markdown
## 🚨 Incident #XXX

**Ambiente:** Produção / Staging  
**Severidade:** 🔴 Alto / 🟡 Médio / 🟢 Baixo  
**Status:** Ativo / Investigando / Resolvido  
**MTTR:** Xh Ymin

### O que aconteceu

...

### Como descobrimos

...

### Causa raiz

...

### Resolução

...

### Lição aprendida

...

### ADRs impactados

- [ ] ADR-XXX: ...
```

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
