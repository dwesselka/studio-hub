# 🧪 Experiments

> Log de experimentos técnicos com hipóteses, resultados e conclusões. Ciência aplicada à engenharia.

::: tip Por que registrar experimentos?
Um experimento sem documentação é conhecimento perdido. Registrar resultados — mesmo os negativos — evita repetir erros e acelera decisões futuras.
:::

## Experimentos Ativos

| Exp     | Hipótese                                                             | Status          | Sprint    |
| ------- | -------------------------------------------------------------------- | --------------- | --------- |
| EXP-005 | Redis com serialização msgpack é 30% mais rápido que JSON            | 🔄 Em andamento | Sprint 04 |
| EXP-004 | Batching de inserts reduz latência em 50% em bulk operations         | ✅ Confirmado   | Sprint 03 |
| EXP-003 | Índice parcial reduz tamanho do índice em 60% para dados soft-delete | ✅ Confirmado   | Sprint 02 |

## Experimentos Concluídos

### EXP-004 — Batching de Inserts

**Hipótese:** Enviar inserts em batch de 1000 reduz latência em 50% comparado a inserts individuais.  
**Resultado:** ✅ Confirmado — redução de 58% na latência (2400ms → 1010ms para 10k registros).  
**Conclusão:** Adotado como padrão. [ADR-016 gerado].

### EXP-003 — Índice Parcial com Soft Delete

**Hipótese:** `WHERE deleted_at IS NULL` em índice parcial reduz tamanho do índice em 60%.  
**Resultado:** ✅ Confirmado — redução de 64% (índice de 45MB → 16MB).  
**Conclusão:** Adotado em todas as tabelas com soft delete. [ADR-017 gerado].

### EXP-001 — bcrypt vs Argon2

**Hipótese:** Argon2id é mais seguro que bcrypt para hashing de senhas sem diferença perceptível de performance.  
**Resultado:** ✅ Confirmado — Argon2id é 3x mais resistente a GPU attacks. Latência: +12ms (aceitável).  
**Conclusão:** Migrado para Argon2id. [ADR-004 gerado].

---

## Template de Experimento

```markdown
# EXP-XXX: [Título]

**Hipótese:** ...  
**Método:** ...  
**Ambiente:** ...  
**Sprint:** XX

## Setup

Como o experimento foi configurado?

## Resultados

Dados coletados com números reais.

## Conclusão

A hipótese foi confirmada ou refutada?

## Ação

O que mudamos baseado nesse experimento?
```

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
