# Riscos e Mitigações — Infinity Partner

## Visão

Identificação de riscos técnicos e de produto, com estratégias de mitigação.

## Tabela de riscos

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| 1 | Prisma 7 + `@prisma/adapter-pg` tem breaking changes ou bugs | Média | Alto | Testar integração em homologação antes de migrar produção. Manter versão fixa no package.json. |
| 2 | TanStack Query v5 → v6 quebra cache em produção | Média | Alto | Versionamento explícito, testar migração em homologação, período de canary. |
| 3 | MSW não funciona em produção (já desligado por env) | Baixa | Crítico | `mockEnabled: false` em produção validado em CI. Teste de fumaça sem mock. |
| 4 | Dados mockados não refletem a API real | Alta | Médio | Manter sync entre mock handlers e endpoints reais. Testar contra API real em homologação. |
| 5 | Vazamento de secrets (API keys, JWT secret) | Baixa | Crítico | `.env` no .gitignore, revisão em code review, varredura com `secretlint` no CI. |
| 6 | Cobertura de testes abaixo do aceitável | Média | Médio | Mínimo 70% configurado no Vitest. Bloquear PR se coverage cair. |
| 7 | Performance degradada com crescimento de dados | Média | Alto | Índices compostos no Prisma. Paginação em todas as listas. Monitorar queries lentas. |
| 8 | Rate limit insuficiente para clientes reais | Média | Médio | Configurável via env. Monitorar uso real e ajustar. Redis para rate limit distribuído no futuro. |
| 9 | Onboarding muito longo (5 passos) | Alta | Médio | Medir taxa de abandono por passo. Simplificar ou permitir pular etapas. |
| 10 | Dependência de serviços externos (WhatsApp, PIX) | Média | Alto | Fallback manual. Timeout configurável. Fila de tentativas. |

## Riscos técnicos detalhados

### Risco: Transição mock → real quebra funcionalidades

**Contexto:** Atualmente todo o frontend opera com dados mockados (MSW). A migração para API real precisa ser feita por domínio.

**Estratégia:**
1. Migrar um domínio por vez (auth primeiro)
2. Manter mock rodando para domínios não migrados
3. Feature flag por domínio (opcional)
4. Testar cada domínio exaustivamente antes de desligar o mock

### Risco: Modelo de dados Prisma não atende todos os casos de uso

**Contexto:** O schema foi definido antes de validar com dados reais.

**Estratégia:**
1. Validar schema com seed data realista
2. Criar migration scripts para alterações futuras
3. Evitar constraints muito restritivas no início

### Risco: JWT sem refresh token rotation

**Contexto:** Se um refresh token vazar, pode ser usado indefinidamente (7 dias).

**Estratégia:**
1. Implementar refresh token rotation (novo refresh token a cada uso)
2. Invalidar refresh tokens antigos no logout
3. Futuro: incluir `jti` (JWT ID) em allowlist no Redis
