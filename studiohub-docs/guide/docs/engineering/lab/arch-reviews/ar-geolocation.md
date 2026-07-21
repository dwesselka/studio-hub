# 🏗️ AR-Geolocation — Busca por Proximidade

**Sprint:** 04  
**Autor:** Diego  
**Data:** 05 Jul 2026  
**Status:** ✅ Aprovada

---

## Problema

O StudioHub precisa permitir que clientes busquem estúdios próximos a eles, ordenados por distância. A tabela `studios` tem ~50k registros e pode crescer para centenas de milhares.

A query precisa ser eficiente o suficiente para retornar em < 200ms com índices adequados.

---

## Contexto

A busca por proximidade é uma das features mais solicitadas pelos usuários em pesquisa de produto. Sem ela, o usuário precisa navegar manualmente ou saber o nome exato do estúdio.

**Requisitos:**

- Busca por raio em km
- Ordenação por distância
- Filtros combinados (categoria, avaliação, disponibilidade)
- Latência p95 < 200ms
- Funcionar com até 500k estúdios

---

## Alternativas Consideradas

<div class="ar-option">
<div class="option-label">Opção A — Cálculo na Aplicação (Haversine)</div>

Buscar todos os estúdios dentro de um bounding box rough e calcular distâncias em JavaScript.

**Prós:**

- Sem dependência de extensão PostgreSQL
- Fácil de implementar

**Contras:**

- Muito lento com volume alto (lê todos os registros do bounding box)
- Lógica de negócio no servidor, não no banco
- Difícil de combinar com outros filtros SQL

</div>

<div class="ar-option chosen">
<div class="option-label">✅ Opção B — PostGIS (ESCOLHIDA)</div>

Usar a extensão PostGIS do PostgreSQL com `ST_DWithin` e índices espaciais GIST.

**Prós:**

- Query nativa no banco, extremamente otimizada
- Índice espacial GIST para busca em O(log n)
- Combina naturalmente com filtros SQL
- Padrão da indústria para geo queries em PostgreSQL
- Prisma suporta via extensões

**Contras:**

- Requer instalação da extensão PostGIS
- Maior complexidade nas migrations
- Curva de aprendizado em ST functions

</div>

<div class="ar-option">
<div class="option-label">Opção C — Elasticsearch / Algolia Geo</div>

Serviço externo especializado em busca geográfica.

**Prós:**

- Altamente otimizado
- Fácil de combinar com busca por texto

**Contras:**

- Custo adicional
- Sincronização de dados complexa
- Overhead desnecessário para esse volume
- Prematura para estágio atual do produto

</div>

---

## Decisão

**PostGIS** foi escolhido porque:

1. Já estamos no PostgreSQL — sem infraestrutura adicional
2. Performance adequada para o volume esperado (até 500k estúdios)
3. Índices espaciais GIST resolvem o problema de escala
4. É o que grandes empresas usam (Airbnb, Uber, iFood usam PostgreSQL com PostGIS)

---

## Arquitetura da Solução

```sql
-- Schema Prisma
model Studio {
  id        String   @id @default(cuid())
  lat       Float
  lng       Float
  -- campos adicionados via migration raw:
  -- location GEOGRAPHY(POINT, 4326)
}

-- Migration
ALTER TABLE studios
ADD COLUMN location GEOGRAPHY(POINT, 4326)
GENERATED ALWAYS AS (ST_MakePoint(lng, lat)) STORED;

CREATE INDEX idx_studios_location
ON studios USING GIST(location);

-- Query de busca
SELECT *,
  ST_Distance(location, ST_MakePoint($lng, $lat)::geography) as distance_meters
FROM studios
WHERE ST_DWithin(
  location,
  ST_MakePoint($lng, $lat)::geography,
  $radius_meters
)
ORDER BY distance_meters ASC
LIMIT 50;
```

---

## Trade-offs

| O que ganhamos                       | O que perdemos                  |
| ------------------------------------ | ------------------------------- |
| Performance excelente em geo queries | Dependência da extensão PostGIS |
| Sem infraestrutura extra             | Migrations mais complexas       |
| Queries SQL combinadas com filtros   | Curva de aprendizado            |
| Padrão da indústria                  | —                               |

---

## Riscos

| Risco                                       | Probabilidade | Mitigação                                  |
| ------------------------------------------- | ------------- | ------------------------------------------ |
| PostGIS não disponível no provider          | Baixo         | Testar no ambiente de produção antes       |
| Performance degradando com > 500k registros | Médio         | Monitor com EXPLAIN ANALYZE periodicamente |
| Custo de migração de lat/lng para geography | Baixo         | Migration com GENERATED ALWAYS             |

---

## ADRs Gerados

- ✅ [ADR-021: Uso de PostGIS para queries geográficas](/engineering/decisions/)
- ✅ [ADR-022: Redis cache para resultados de geocoding](/engineering/decisions/)

## Links

- [→ Sprint 04](/engineering/lab/sprints/sprint-04)
- [→ ADRs relacionados](/engineering/decisions/)

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
