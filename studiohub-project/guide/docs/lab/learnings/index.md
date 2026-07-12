# 📖 Learnings

> Base de conhecimento de tudo que foi aprendido na prática. Não é teoria — é o que funcionou (ou não) no código real.

<div class="dashboard-grid">

<div class="metric-card">
  <span class="metric-icon">📖</span>
  <span class="metric-label">Aprendizados</span>
  <span class="metric-value">87</span>
  <span class="metric-sub">Registrados</span>
</div>

<div class="metric-card">
  <span class="metric-icon">🚨</span>
  <span class="metric-label">Vindos de Incidentes</span>
  <span class="metric-value">24</span>
  <span class="metric-sub">Casos reais</span>
</div>

<div class="metric-card">
  <span class="metric-icon">🏆</span>
  <span class="metric-label">Vindos de Desafios</span>
  <span class="metric-value">31</span>
  <span class="metric-sub">De challenges</span>
</div>

</div>

## Por Categoria

### 🗄️ Banco de Dados

> **Volumetria muda tudo.** O que funciona com 500 registros pode ser catastrófico com 1M. Sempre teste com dados realistas.

> **EXPLAIN ANALYZE é ritual.** Nunca confie no EXPLAIN sem o ANALYZE em produção.

> **Índices parciais são subestimados.** Para tabelas com soft delete, um índice `WHERE deleted_at IS NULL` pode reduzir o índice em 60%.

> **CONCURRENTLY não é opcional.** Criar índice sem CONCURRENTLY bloqueia writes em produção. Nunca.

### ⚡ Performance

> **Cache não é bala de prata.** Cache introduz inconsistência. Sempre defina a política de invalidação ANTES de cachear.

> **Batching é gratuito.** Trocar N inserts individuais por 1 insert em batch pode ser 50-70% mais rápido sem custo de código.

> **N+1 queries são silenciosas.** Sem logging de queries, você não sabe que tem N+1. Prisma + logging ativo é obrigatório.

### 🔐 Segurança

> **JWT sem refresh token é frágil.** Token de 15min + refresh de 7 dias é o equilíbrio entre segurança e UX.

> **bcrypt tem custo de CPU.** Com muitas requisições simultâneas de login, bcrypt pode ser gargalo. Monitore.

> **Validação no servidor é lei.** Frontend validation é UX. Backend validation é segurança. São coisas diferentes.

### 🏗️ Arquitetura

> **BFF resolve o problema de over-fetching.** Frontend mobile e web têm necessidades diferentes. BFF é a resposta correta.

> **Decisões reversíveis vs. irreversíveis.** Seja rápido nas reversíveis. Seja lento e cuidadoso nas irreversíveis (ex: schema de banco).

> **Logging estruturado desde o dia 1.** Adicionar logging estruturado depois é 10x mais trabalhoso.

### 🐛 Debugging

> **Reprodução local é rei.** Se você não consegue reproduzir o bug localmente, você não entende o bug.

> **Binary search em commits.** `git bisect` é a ferramenta mais subestimada do universo.

> **Logs são cartas para o futuro.** Escreva log messages como se o leitor não tivesse contexto algum.

---

## Aprendizados Mais Recentes

| Data     | Aprendizado                                                 | Origem              |
| -------- | ----------------------------------------------------------- | ------------------- |
| Jun 2026 | EXPLAIN sem ANALYZE mente em produção                       | Incident #014       |
| Jun 2026 | PostGIS `ST_DWithin` é 20x mais rápido que Haversine em app | Architecture Review |
| Mai 2026 | Redis `SETNX` é base do distributed lock                    | Challenge #031      |
| Mai 2026 | Refresh token rotation previne token theft                  | Sprint 02           |

---

## Como Adicionar um Aprendizado

Qualquer código que quebrou, qualquer bug que demorou para resolver, qualquer coisa que você nunca quer esquecer — registre aqui.

```markdown
> **[Título curto e impactante]**  
> Explicação em 1-3 linhas do que você aprendeu e por quê importa.  
> — Origem: Incident #XXX / Challenge #XXX / Sprint XX
```
