# Decisões Arquiteturais (ADR) — StudioHub

## Visão

Registro das decisões arquiteturais importantes, com opções consideradas, vantagens, desvantagens, justificativa e trade-offs.

---

## ADR-001: Hono.js como framework backend

**Contexto:** Precisávamos de um framework HTTP para Node.js.

**Opções:**

| Opção       | Vantagens                                                                              | Desvantagens                                     |
| ----------- | -------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Hono.js** | Leve, rápido, tipado (TS first), middleware simples, compatível com múltiplos runtimes | Ecossistema menor que Express                    |
| Express     | Mais popular, vasto ecossistema                                                        | Tipagem fraca, middleware verboso, mais pesado   |
| Fastify     | Rápido, schema-based (JSON Schema)                                                     | Curva de aprendizado, mais verboso               |
| NestJS      | Arquitetura modular, DI, opinionated                                                   | Overengineering para o escopo, complexidade alta |

**Decisão:** Hono.js.

**Justificativa:** Simplicidade + performance + tipos nativos. Para o escopo atual (API REST com ~60 endpoints), Hono oferece o melhor equilíbrio entre produtividade e performance. Express teria sido a alternativa mais conservadora, mas a falta de tipos first-class e a verbosidade dos middlewares adicionariam ruído desnecessário.

---

## ADR-002: Prisma como ORM

**Contexto:** Necessidade de ORM para PostgreSQL.

**Opções:**

| Opção       | Vantagens                                                         | Desvantagens                                                      |
| ----------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Prisma**  | Schema-first, migrations automáticas, types gerados, DX excelente | Performance inferior a raw SQL em queries complexas, maior bundle |
| Drizzle ORM | Leve, SQL-like, performance                                       | Ecossistema menor, migrations menos maduras                       |
| Kysely      | Tipado, SQL-like, performático                                    | Sem migrations próprias, mais verboso                             |
| Raw SQL     | Performance máxima                                                | Sem types, sem migrations, manutenção difícil                     |

**Decisão:** Prisma.

**Justificativa:** A produtividade e segurança de tipos do Prisma superam a perda marginal de performance. Para um SaaS com 18 modelos e relacionamentos complexos, o schema declarativo e as migrations automáticas eliminam uma classe inteira de bugs. Drizzle seria uma alternativa viável em projetos mais simples.

---

## ADR-003: React Query (TanStack Query) para server state

**Contexto:** Gerenciamento de dados do servidor no frontend.

**Opções:**

| Opção                  | Vantagens                                                  | Desvantagens                               |
| ---------------------- | ---------------------------------------------------------- | ------------------------------------------ |
| **TanStack Query**     | Cache automático, refetch inteligente, mutations, devtools | Dependência externa, curva de tipos        |
| SWR                    | Leve, simples                                              | Menos recursos que RQ                      |
| Zustand + fetch manual | Zero dependências                                          | Reimplementar cache, loading, error states |
| Context + fetch        | Nativo, sem libs                                           | Sem cache, sem dedup, boilerplate          |

**Decisão:** TanStack Query.

**Justificativa:** Elimina a necessidade de gerenciar estado de loading/error/cache manualmente. O cache por chave (`queryKey`) e a invalidação automática após mutations reduzem drasticamente o código boilerplate. SWR seria suficiente, mas o ecossistema de mutations do RQ é superior para o volume de operações de escrita do sistema.

---

## ADR-004: Sem Server Components / Server Actions

**Contexto:** Arquitetura SPA vs Next.js.

**Opções:**

| Opção               | Vantagens                           | Desvantagens                                    |
| ------------------- | ----------------------------------- | ----------------------------------------------- |
| **Vite SPA**        | Simples, deploy estático, sem SSR   | Sem SEO dinâmico (landing é estática)           |
| Next.js com SSR/SSG | SEO, Server Components, performance | Complexidade, custo de servidor, lock-in Vercel |

**Decisão:** Vite SPA + Hono.js separado.

**Justificativa:** O produto é um SaaS com dashboard autenticado (não precisa de SEO). A landing page é estática (pode ser pré-renderizada). Separar frontend e backend permite deploy independente, escalar cada camada separadamente, e evitar lock-in de framework. Next.js adicionaria complexidade sem benefício real.

---

## ADR-005: Mock API com MSW em dev/homolog

**Contexto:** Desenvolvimento e teste sem backend real.

**Opções:**

| Opção                         | Vantagens                                                  | Desvantagens                                   |
| ----------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| **MSW (Mock Service Worker)** | Intercepta no nível do fetch, realista, funciona em testes | Complexidade de setup, manutenção dos handlers |
| Mock manual (if/else)         | Simples de implementar                                     | Espalhado no código, propenso a ficar obsoleto |
| json-server                   | Zero código                                                | Não reflete a API real, sem tipos              |

**Decisão:** MSW com camada de abstração.

**Justificativa:** O MSW permite simular o backend de forma realista (incluindo latência, erros, jitter) sem modificar o código de produção. Os handlers são tipados e seguem o mesmo formato de resposta do backend real. A transição mock → real é feita por variável de ambiente, sem alteração de código.

---

## ADR-006: Feature-first organization

**Contexto:** Estrutura de pastas do frontend.

**Opções:**

| Opção                        | Vantagens                          | Desvantagens                                                           |
| ---------------------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| **Feature-first**            | Coeso, fácil de navegar, escalável | Pode duplicar utils entre features                                     |
| Type-first (types/ui/utils/) | Separação clara por tipo           | Navegação difícil em projetos grandes, componentes distantes dos dados |
| Page-first                   | Simples, intuitivo                 | Componentes inchados, sem reuso                                        |

**Decisão:** Feature-first com pastas compartilhadas.

**Justificativa:** Cada feature (agenda, clientes, etc.) é auto-contida com seus componentes, hooks, tipos e páginas. O que é compartilhado vai para `components/ui/`, `hooks/`, `lib/`. Isso mantém o código coeso e facilita a navegação entre arquivos relacionados.

---

## ADR-007: Zod para validação em ambas as camadas

**Contexto:** Validação de dados no frontend e backend.

**Opção:** Zod.

**Justificativa:** Esquemas compartilháveis entre frontend e backend. Integração nativa com React Hook Form (`@hookform/resolvers/zod`). Tipos inferidos automaticamente (`z.infer<typeof schema>`). Alternativas como Yup ou Joi são menos flexíveis e têm integração pior com TypeScript.

---

## ADR-008: Autenticação stateless com JWT

**Contexto:** Mecanismo de autenticação.

**Opção:** JWT HS256 + Refresh Token.

**Justificativa:** Stateless (não requer sessão no servidor), simples de implementar, funciona bem com APIs REST. Refresh token permite renovar access tokens sem re-autenticar. HS256 é suficiente para single-service; migrar para RS256 se micro-serviços no futuro.

---

## ADR-009: Conta única por estabelecimento (tenant = User)

**Contexto:** Modelo de multiempresa.

**Opção:** Cada `User` é um estabelecimento. Todos os dados pertencem ao `User`.

**Justificativa:** Simplicidade máxima. Para o MVP, cada estabelecimento é uma conta independente. Não há compartilhamento de dados entre estabelecimentos. Futuramente, pode-se evoluir para um modelo com `Company` + `Branch` + `User` com permissões.

**Trade-off:** Um cliente com múltiplas filiais precisará de uma conta por filial. No futuro, será necessário implementar multi-tenancy com `companyId`.
