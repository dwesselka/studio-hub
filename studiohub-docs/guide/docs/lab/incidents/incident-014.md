# 🚨 Incident #014

<div class="incident-card">
  <div class="incident-header">
    <span class="incident-id">🚨 Incident #014</span>
    <span class="incident-badge resolved">✅ Resolvido</span>
  </div>
  <div class="incident-body">
    <div class="incident-field">
      <label>Ambiente</label>
      <span>🔴 Produção</span>
    </div>
    <div class="incident-field">
      <label>Severidade</label>
      <span>🔴 Alto</span>
    </div>
    <div class="incident-field">
      <label>MTTR</label>
      <span>⏱️ 3h 12min</span>
    </div>
    <div class="incident-field">
      <label>Data</label>
      <span>📅 15 Jun 2026</span>
    </div>
    <div class="incident-field">
      <label>Afetados</label>
      <span>👥 ~340 clientes</span>
    </div>
    <div class="incident-field">
      <label>Detectado por</label>
      <span>🔔 Alerta Grafana</span>
    </div>
  </div>
  <div class="incident-lesson">
    💡 <strong>Lição:</strong> Nunca confiar no EXPLAIN sem medir em produção. O planner do Postgres pode escolher um caminho diferente dependendo do volume de dados.
  </div>
</div>

## O que aconteceu?

Clientes relataram lentidão extrema ao carregar a lista de agendamentos. O endpoint `/api/appointments` estava retornando em **12–18 segundos** em vez dos < 200ms esperados.

O alerta do Grafana disparou às **14h37** com latência p95 acima de 10s.

## Timeline

| Hora  | Evento                                  |
| ----- | --------------------------------------- |
| 14h37 | Alerta do Grafana disparado (p95 > 10s) |
| 14h42 | Engenheiro notificado via PagerDuty     |
| 14h50 | Início da investigação no Datadog APM   |
| 15h15 | Causa identificada: índice faltando     |
| 15h20 | Migration criada e aplicada em staging  |
| 16h30 | Deploy em produção aprovado             |
| 17h49 | Incidente resolvido (p95 < 180ms)       |

## Como Descobrimos?

Monitoramento via **Grafana + OpenTelemetry**. O trace distribuído mostrou que 97% do tempo estava sendo gasto em uma única query SQL no endpoint de listagem.

```sql
-- Query problemática (sem índice)
SELECT * FROM appointments
WHERE studio_id = $1
  AND date >= $2
ORDER BY date ASC;
```

## Causa Raiz

Após analisar o `pg_stat_user_tables`, identificamos que a tabela `appointments` tinha **1.2M de registros** sem índice composto em `(studio_id, date)`.

O `EXPLAIN ANALYZE` em desenvolvimento (com ~500 registros) mostrava Sequential Scan aceitável. Em produção, com 1.2M registros, o planner escolheu um **Full Table Scan** que durou até 18 segundos.

## Resolução

```sql
-- Migration: 20260615_add_appointments_index.sql
CREATE INDEX CONCURRENTLY idx_appointments_studio_date
ON appointments(studio_id, date DESC);
```

Utilizamos `CONCURRENTLY` para criar o índice sem bloquear writes em produção.

**Resultado imediato:** latência p95 caiu de 18s → 145ms.

## O que Mudou?

- ✅ Índice `idx_appointments_studio_date` criado
- ✅ Checklist de performance adicionado ao template de PR
- ✅ Alerta de Query Slowlog configurado no Datadog (threshold: 500ms)
- ✅ EXPLAIN ANALYZE obrigatório para queries em tabelas com > 100k registros

## ADRs Impactados

- [ADR-019: Política de índices em tabelas de alto volume](/lab/adrs/)
- [ADR-020: Observabilidade obrigatória em queries críticas](/lab/adrs/)

## Post Mortem

[→ Post Mortem PM-001: Incident #014](/lab/post-mortems/pm-001)

---

::: warning Nunca mais esquecer
`EXPLAIN` em desenvolvimento ≠ `EXPLAIN ANALYZE` em produção.  
Volume de dados muda tudo.
:::
