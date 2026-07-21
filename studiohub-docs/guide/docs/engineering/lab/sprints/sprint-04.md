# 🏃 Sprint 04 — Geolocalização

<div class="sprint-card">
  <div class="sprint-header">
    <span class="sprint-name">Sprint 04 — Geolocalização</span>
    <span class="sprint-status">Em andamento</span>
  </div>
  <div class="progress-wrap">
    <div class="progress-label">
      <span>Progresso geral</span>
      <span>65%</span>
    </div>
    <div class="progress-bar-track">
      <div class="progress-bar-fill" style="width: 65%"></div>
    </div>
  </div>
  <div style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--vp-c-text-3);">
    📍 Próxima missão: <strong>Redis Cache Layer para coordenadas</strong>
  </div>
</div>

## Objetivo

Implementar busca de prestadores de serviço por proximidade geográfica, com cache inteligente de coordenadas e integração com Google Maps API.

## Tecnologias

| Tecnologia                | Propósito                         | Status            |
| ------------------------- | --------------------------------- | ----------------- |
| Google Maps Geocoding API | Converter endereço → coordenadas  | ✅ Integrado      |
| PostGIS (PostgreSQL)      | Queries de proximidade geográfica | 🔄 Em andamento   |
| Redis                     | Cache de geocoding (TTL: 24h)     | 📋 Próxima missão |
| Prisma                    | ORM para queries PostGIS          | ✅ Configurado    |

## Tasks

### Concluídas ✅

- [x] Configurar Google Maps Geocoding API
- [x] Criar schema Prisma com campos lat/lng
- [x] Endpoint `GET /studios/nearby?lat=&lng=&radius=`
- [x] Seed de dados com coordenadas reais
- [x] Testes de integração básicos

### Em andamento 🔄

- [ ] Implementar PostGIS com `ST_DWithin`
- [ ] Otimizar query com índice espacial GIST

### Planejado 📋

- [ ] Redis cache para resultados de geocoding
- [ ] Rate limit na Geocoding API
- [ ] Testes de carga com k6

## Decisões Técnicas

::: tip ADR-021 — PostGIS vs Solução Custom
Optamos por PostGIS em vez de calcular distâncias no código (Haversine formula) para aproveitar índices espaciais nativos do PostgreSQL e queries nativas em SQL. [→ Ver ADR completo](/engineering/decisions/)
:::

## Métricas de Sucesso

| Métrica                        | Alvo    | Atual |
| ------------------------------ | ------- | ----- |
| Latência do endpoint `/nearby` | < 200ms | 340ms |
| Cache hit rate (Redis)         | > 80%   | —     |
| Cobertura de testes            | > 85%   | 72%   |

## Lições Aprendidas

> "PostGIS requer extensão explícita no PostgreSQL. Não esquecer de adicionar `CREATE EXTENSION IF NOT EXISTS postgis;` na migration."

> "Geocoding não é instantâneo — sempre mostrar estado de loading na UI."

## Incidentes desta Sprint

Nenhum incidente registrado nesta sprint (ainda 😅).

## Links

- [→ Roadmap](/engineering/lab/roadmap)
- [→ Architecture Review: Geolocalização](/engineering/lab/arch-reviews/ar-geolocation)
- [→ ADRs relacionados](/engineering/decisions/)

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
